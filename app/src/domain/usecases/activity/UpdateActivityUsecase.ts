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

import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand, activityCommandToDomain } from '../../../command/ActivityCommand';
import { normalizeString } from '../../../presentation/utils';
import { Activity } from '../../entities/Activity';
import UpdateActivityUsecaseInterface, {
    UpdateActivityCommand,
} from '../../interfaces/activity/UpdateActivityUsecase.interface';

interface ActivityPayload {
    title?: string;
    description?: string;
    languageLevel?: string;
    languageCode?: string;
    themeId?: string;
    image?: File;
    creditImage?: string;
    ressource?: File;
    ressourceUrl?: string;
    exercises?: { content: string; order: number }[];
    vocabularies: { id?: string; content: string; pronunciationUrl?: string }[];
    vocabulariesFiles?: File[];
    vocabulariesIdsToDelete?: string[];
}
class UpdateActivityUsecase implements UpdateActivityUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, command: UpdateActivityCommand): Promise<Activity | Error> {
        try {
            const formData: ActivityPayload = {
                title: command.title,
                description: command.description,
                languageLevel: command.languageLevel,
                languageCode: command.languageCode,
                themeId: command.themeId,
                creditImage: command.creditImage,
                exercises: command.exercises,
                vocabularies: [],
            };

            if (command.image) {
                formData.image = command.image;
            }

            if (command.vocabularies) {
                command.vocabularies.forEach((vocabulary) => {
                    const vocabularyToUpdate: any = { content: vocabulary.content };
                    if (vocabulary.pronunciationUrl) {
                        vocabularyToUpdate.pronunciationUrl = vocabulary.pronunciationUrl;
                    }

                    if (vocabulary.id) {
                        vocabularyToUpdate.id = vocabulary.id;
                    }

                    formData.vocabularies.push(vocabularyToUpdate);
                    if (vocabulary.file) {
                        const vocabularyNormalized = normalizeString(vocabulary.content);
                        const newFileName = `${vocabularyNormalized}.wav`;
                        const newFile = new File([vocabulary.file], newFileName, {
                            type: vocabulary.file.type,
                        });
                        formData.vocabulariesFiles
                            ? formData.vocabulariesFiles.push(newFile)
                            : (formData.vocabulariesFiles = [newFile]);
                    }
                });
            }

            if (command.ressource) {
                formData.ressource = command.ressource;
            }

            if (command.ressourceUrl) {
                formData.ressourceUrl = command.ressourceUrl;
            }

            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.post(
                `/activities/${id}/update`,
                formData,
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return activityCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            if (error.error.statusCode === 400 && error.error.message.includes('Unallowed content type')) {
                return new Error('errors.imageFormat');
            }

            return new Error('errors.global');
        }
    }
}

export default UpdateActivityUsecase;
