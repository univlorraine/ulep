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

import {
    MaxFileSizeValidator,
    ParseFilePipe,
    FileTypeValidator,
    BadRequestException,
} from '@nestjs/common';

export type FileOptions = {
    maxSize?: number;
    fileType?: string | RegExp;
};

// Validateur personnalisé pour les types de fichiers avec message d'erreur spécifique
class CustomFileTypeValidator extends FileTypeValidator {
    constructor(options: { fileType: string | RegExp }) {
        super(options);
    }

    isValid(fileOrFiles: Express.Multer.File | Express.Multer.File[]): boolean {
        const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

        for (const file of files) {
            if (!super.isValid(file)) {
                // Lancer une BadRequestException avec un message spécifique
                throw new BadRequestException(
                    'Unallowed content type: ' + file.mimetype,
                );
            }
        }

        return true;
    }
}

export class FilePipe extends ParseFilePipe {
    constructor(options?: FileOptions) {
        const sizeValidator = new MaxFileSizeValidator({
            maxSize: options?.maxSize ?? 10000000,
        });

        const validMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'audio/wav',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/msword',
            'application/vnd.ms-excel',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-word.document.macroEnabled.12',
            'application/vnd.ms-excel.sheet.macroEnabled.12',
            'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
            'application/vnd.openxmlformats-officedocument.presentationml.template',
            'application/vnd.ms-word.template.macroEnabled.12',
            'application/vnd.ms-excel.template.macroEnabled.12',
            'application/vnd.ms-powerpoint.template.macroEnabled.12',
            'application/vnd.oasis.opendocument.text',
            'application/vnd.oasis.opendocument.spreadsheet',
            'application/vnd.oasis.opendocument.presentation',
            'application/vnd.oasis.opendocument.text-template',
            'application/vnd.oasis.opendocument.spreadsheet-template',
            'application/vnd.oasis.opendocument.presentation-template',
            'application/vnd.oasis.opendocument.graphics',
            'application/vnd.oasis.opendocument.formula',
            'application/vnd.oasis.opendocument.database',
            'application/vnd.oasis.opendocument.chart',
        ];

        const mimeTypeRegex = new RegExp(
            `^(${validMimeTypes
                .map((type) => type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                .join('|')})$`,
        );

        const mimeValidator = new CustomFileTypeValidator({
            fileType: options?.fileType ?? mimeTypeRegex,
        });

        super({
            validators: [sizeValidator, mimeValidator],
        });
    }

    transform(value: any) {
        if (!value) return value;

        return super.transform(value);
    }
}
