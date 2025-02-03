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
                ressourceUrl: command.ressourceUrl,
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
