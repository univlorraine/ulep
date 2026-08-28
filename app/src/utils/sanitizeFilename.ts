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

/**
 * Caractères qu'Android refuse dans un nom de fichier (FileUtils.isValidFatFilenameChar).
 * Vérifié sur device Android 14 : MediaStore rejette l'écriture avec « File name contains
 * invalid characters », remonté en `Operation not permitted` par Capacitor.
 */
const INVALID_CHARACTERS = /["*\/:<>?\\|\u0000-\u001F\u007F]/g;

/**
 * Caractères légaux pour le système de fichiers, mais retirés quand même : la virgule est
 * refusée par MimeTypeMap.getFileExtensionFromUrl, qui n'accepte que [a-zA-Z_0-9.\-()%].
 * Un nom non encodé la contenant fait silencieusement retomber le type MIME sur le
 * type générique au lieu de application/pdf.
 */
const REMOVED_CHARACTERS = /,/g;

/**
 * Noms d'appareils réservés par Windows : un fichier ainsi nommé est refusé par l'explorateur
 * et les partages SMB, quelles que soient la casse et l'extension. Sans objet sur Android, mais
 * le fichier quitte l'app dès que l'utilisateur le partage.
 */
const WINDOWS_RESERVED_NAMES = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

/** Limite d'un nom de fichier sur ext4 et MediaStore : 255 octets, et non 255 caractères. */
const MAX_FILENAME_BYTES = 255;

/** Nom retenu quand le nettoyage ne laisse plus rien d'exploitable. */
const DEFAULT_FILENAME = 'fichier';

/** Longueur UTF-8. TextEncoder n'est pas disponible dans l'environnement de test jsdom. */
const utf8ByteLength = (value: string): number =>
    Array.from(value).reduce((bytes, character) => {
        const codePoint = character.codePointAt(0) ?? 0;
        if (codePoint <= 0x7f) return bytes + 1;
        if (codePoint <= 0x7ff) return bytes + 2;
        if (codePoint <= 0xffff) return bytes + 3;
        return bytes + 4;
    }, 0);

/** Retire des caractères entiers (jamais une demi-paire de substitution) jusqu'à tenir. */
const truncateToBytes = (value: string, maxBytes: number): string => {
    let characters = Array.from(value);
    while (utf8ByteLength(characters.join('')) > maxBytes) {
        characters = characters.slice(0, -1);
    }
    return characters.join('');
};

/**
 * Rend un nom de fichier écrivable sur Android sans le dénaturer : seuls les caractères
 * refusés par le système sont remplacés. Accents, CJK, cyrillique, arabe et emoji sont
 * conservés, leur écriture ayant été vérifiée sur device.
 */
const sanitizeFilename = (filename: string): string => {
    const sanitized = filename
        .replace(REMOVED_CHARACTERS, '')
        .replace(INVALID_CHARACTERS, '_')
        .replace(/_+/g, '_')
        .replace(/^[.\s]+/, '')
        .replace(/[.\s]+$/, '');

    if (!sanitized) return DEFAULT_FILENAME;

    const extensionIndex = sanitized.lastIndexOf('.');
    const extension = extensionIndex > 0 ? sanitized.slice(extensionIndex) : '';
    const rawBase = extensionIndex > 0 ? sanitized.slice(0, extensionIndex) : sanitized;
    const base = WINDOWS_RESERVED_NAMES.test(rawBase) ? `_${rawBase}` : rawBase;

    const candidate = `${base}${extension}`;
    if (utf8ByteLength(candidate) <= MAX_FILENAME_BYTES) return candidate;

    return `${truncateToBytes(base, MAX_FILENAME_BYTES - utf8ByteLength(extension))}${extension}`;
};

export default sanitizeFilename;
