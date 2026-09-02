/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { resumeVisibilityRefresh, suspendVisibilityRefresh } from '../presentation/hooks/visibilityRefreshControl';
import sanitizeFilename from '../utils/sanitizeFilename';
import DeviceAdapterInterface from './interfaces/DeviceAdapter.interface';
import FileAdapterInterface from './interfaces/FileAdapter.interface';

class FileAdapter implements FileAdapterInterface {
    deviceAdapter: DeviceAdapterInterface;

    constructor(deviceAdapter: DeviceAdapterInterface) {
        this.deviceAdapter = deviceAdapter;
    }

    async getFile({ isTypeOnlyPdf }: { isTypeOnlyPdf?: boolean }): Promise<File | undefined> {
        const types = ['application/pdf'];
        if (!isTypeOnlyPdf) {
            types.push(
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
                'application/vnd.oasis.opendocument.text', // .odt
                'application/vnd.oasis.opendocument.spreadsheet', // .ods
                'application/vnd.oasis.opendocument.presentation' // .odp
            );
        }
        // Le sélecteur de fichiers met l'app en arrière-plan : on suspend le
        // rafraîchissement au retour au premier plan pour ne pas perdre le
        // fichier sélectionné (cf. useAppVisibilityRefresh).
        suspendVisibilityRefresh();
        try {
            // readData reste true sur le web (on utilise le blob directement), mais
            // false sur natif : charger le fichier en base64 en mémoire fait exploser
            // la RAM sur les appareils limités (iPhone 8/iOS 16) et tue la WebView.
            // Sur natif on récupère le `path` et on lit les octets à la demande.
            const readData = !this.deviceAdapter.isNativePlatform();
            const pickedFiles = await FilePicker.pickFiles({
                types,
                readData,
            });

            if (pickedFiles.files.length > 0) {
                const pickedFile = pickedFiles.files[0];
                return this.createFileFromPickedFile(pickedFile);
            }

            return undefined;
        } finally {
            // On maintient la suspension un court instant : l'event
            // `visibilitychange` arrive ~0,5 s APRÈS la résolution du picker.
            setTimeout(resumeVisibilityRefresh, 2000);
        }
    }

    async saveFile(file: string, filename: string): Promise<void> {
        const response = await fetch(file);
        const blob = await response.blob();
        // Point de passage unique vers le système de fichiers : on nettoie ici plutôt que
        // dans chaque appelant, pour qu'aucun nom construit depuis une saisie utilisateur
        // ne puisse faire échouer l'écriture (cf. ULEP-17).
        const safeFilename = sanitizeFilename(filename);

        if (this.deviceAdapter.isNativePlatform()) {
            const base64Data = await this.convertBlobToBase64(blob);
            try {
                // Écriture en stockage applicatif (aucune permission requise), puis partage
                // pour laisser l'utilisateur choisir où enregistrer le fichier.
                const written = await Filesystem.writeFile({
                    path: safeFilename,
                    data: base64Data,
                    directory: Directory.Cache,
                    recursive: true,
                });

                await Share.share({
                    title: safeFilename,
                    url: written.uri,
                });
            } catch (error) {
                console.error("Erreur lors de l'enregistrement du fichier:", error);
                throw error;
            }
        } else {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = safeFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    }

    async saveBlob(blob: Blob, filename: string): Promise<void> {
        const url = window.URL.createObjectURL(blob);
        await this.saveFile(url, filename);
    }

    private convertBlobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => {
                console.error(error);
                reject(error);
            };
            reader.readAsDataURL(blob);
        });
    };

    private async createFileFromPickedFile(pickedFile: PickedFile): Promise<File | undefined> {
        if (pickedFile.blob) {
            // Web : le blob est fourni directement par le plugin.
            return new File([pickedFile.blob], pickedFile.name, { type: pickedFile.mimeType });
        } else if (pickedFile.path) {
            // Natif : on lit les octets depuis le path via une URL fetchable par la
            // WebView (même approche que le CameraAdapter), sans base64 en mémoire.
            const webPath = Capacitor.convertFileSrc(pickedFile.path);
            const response = await fetch(webPath);
            const blob = await response.blob();
            return new File([blob], pickedFile.name, { type: pickedFile.mimeType || blob.type });
        } else if (pickedFile.data) {
            // Fallback (si jamais des octets base64 sont tout de même fournis).
            const byteString = atob(pickedFile.data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: pickedFile.mimeType });
            return new File([blob], pickedFile.name, { type: pickedFile.mimeType });
        }

        return undefined;
    }
}

export default FileAdapter;
