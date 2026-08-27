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

import sanitizeFilename from '../../src/utils/sanitizeFilename';

describe('sanitizeFilename', () => {
    it('replaces the characters Android rejects in a file name', () => {
        // Vérifié sur device (Android 14) : MediaStore refuse " * / : < > ? \ | et les
        // caractères de contrôle avec « File name contains invalid characters ».
        expect(sanitizeFilename('Fiche : les verbes ?.pdf')).toBe('Fiche _ les verbes _.pdf');
    });

    it('collapses consecutive replacements into a single underscore', () => {
        expect(sanitizeFilename('Prosper<>Merimee.pdf')).toBe('Prosper_Merimee.pdf');
    });

    it('strips leading and trailing dots and spaces', () => {
        // Un point en tête masque le fichier, un point ou une espace en fin casse
        // l'interopérabilité Windows/SMB si l'utilisateur déplace le PDF.
        expect(sanitizeFilename('  .Le soir. ')).toBe('Le soir');
    });

    it('keeps the extension when trimming the end', () => {
        expect(sanitizeFilename('.Le soir.pdf')).toBe('Le soir.pdf');
    });

    it('falls back to a default name when nothing usable remains', () => {
        expect(sanitizeFilename('...')).toBe('fichier');
    });

    it('truncates to the filesystem byte limit while keeping the extension', () => {
        // 200 caractères chinois = 600 octets en UTF-8, bien au-delà des 255 d'ext4.
        const result = sanitizeFilename(`${'\u591C'.repeat(200)}.pdf`);
        expect(Buffer.byteLength(result, 'utf8')).toBeLessThanOrEqual(255);
        expect(result.endsWith('.pdf')).toBe(true);
    });
});
