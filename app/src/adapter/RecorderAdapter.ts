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

import { VoiceRecorder } from 'capacitor-voice-recorder';
import RecorderAdapterInterface from './interfaces/RecorderAdapter.interface';

export class RecorderAdapter implements RecorderAdapterInterface {
    private recordingTimeout: NodeJS.Timeout | null = null;
    private startTime: number | null = null;
    private isRecording: boolean = false;

    async requestPermission() {
        await VoiceRecorder.requestAudioRecordingPermission();
    }

    async startRecording(onStop: (audio?: File, error?: Error) => void) {
        if (this.isRecording) {
            console.warn('Recording already in progress');
            return onStop(undefined, new Error('ALREADY_RECORDING'));
        }

        try {
            const requestPermission = await VoiceRecorder.requestAudioRecordingPermission();

            if (!requestPermission.value) {
                return onStop(undefined, new Error('record.error.permission'));
            }

            await VoiceRecorder.startRecording();
            this.isRecording = true;
            this.startTime = Date.now();

            this.recordingTimeout = setTimeout(() => {
                this.stopRecording(onStop);
            }, 60000);
        } catch (error) {
            console.error(error);
            this.isRecording = false;
            onStop(undefined, new Error('record.error.unexpected'));
        }
    }

    async stopRecording(onStop: (audio?: File, error?: Error) => void) {
        if (!this.isRecording) {
            console.warn('No recording in progress');
            setTimeout(() => {
                this.stopRecording(onStop);
            }, 500);
            return;
        }

        if (this.recordingTimeout) {
            clearTimeout(this.recordingTimeout);
            this.recordingTimeout = null;
        }

        try {
            const result = await VoiceRecorder.stopRecording();
            this.isRecording = false;

            if (result.value && result.value.recordDataBase64) {
                const endTime = Date.now();
                const duration = (endTime - (this.startTime || 0)) / 1000; // Durée en secondes

                if (duration < 1) {
                    this.resetState();
                    onStop(undefined, new Error('record.error.too_short'));
                    return;
                }

                try {
                    const audioBlob = this.base64ToBlob(result.value.recordDataBase64, 'audio/wav');

                    if (audioBlob.size === 0) {
                        this.resetState();
                        onStop(undefined, new Error('record.error.empty_file'));
                        return;
                    }

                    const audioFile = new File([audioBlob], `recording_${Date.now()}.wav`, {
                        type: 'audio/wav',
                        lastModified: Date.now(),
                    });

                    this.resetState();

                    setTimeout(() => {
                        onStop(audioFile);
                    }, 100);
                } catch (error) {
                    console.error('Error creating audio file:', error);
                    this.resetState();
                    onStop(undefined, new Error('record.error.file_creation'));
                }
            } else {
                this.resetState();
                onStop(undefined, new Error('record.error.no_data'));
            }
        } catch (error) {
            console.error('Recording error:', error);
            this.resetState();
            onStop(undefined, new Error('record.error.unexpected'));
        }
    }

    private resetState() {
        this.isRecording = false;
        this.startTime = null;
        if (this.recordingTimeout) {
            clearTimeout(this.recordingTimeout);
            this.recordingTimeout = null;
        }
    }

    private base64ToBlob(base64: string, type: string): Blob {
        try {
            if (!base64 || typeof base64 !== 'string') {
                throw new Error('Invalid base64 data');
            }

            const base64Data = base64.replace(/^data:[^;]+;base64,/, '');

            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type });
        } catch (error) {
            console.error('Error converting base64 to blob:', error);
            throw new Error('Failed to convert audio data');
        }
    }
}
