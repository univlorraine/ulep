import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand, activityCommandToDomain } from '../../../command/ActivityCommand';
import { Activity, ActivityStatus } from '../../entities/Activity';
import UpdateActivityUsecaseInterface, {
    UpdateActivityCommand,
} from '../../interfaces/activity/UpdateActivityUsecase.interface';

interface ActivityPayload {
    title?: string;
    status?: ActivityStatus;
    description?: string;
    languageLevel?: string;
    languageCode?: string;
    themeId?: string;
    image?: File;
    creditImage?: string;
    ressource?: File;
    ressourceUrl?: string;
    exercises?: { content: string; order: number }[];
    vocabularies: string[];
    vocabulariesFiles?: File[];
    vocabulariesIdsToDelete?: string[];
}
class UpdateActivityUsecase implements UpdateActivityUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(id: string, command: UpdateActivityCommand): Promise<Activity | Error> {
        try {
            const formData: ActivityPayload = {
                title: command.title,
                status: command.status,
                description: command.description,
                languageLevel: command.languageLevel,
                languageCode: command.languageCode,
                themeId: command.themeId,
                image: command.image,
                creditImage: command.creditImage,
                ressourceUrl: command.ressourceUrl,
                exercises: command.exercises,
                vocabularies: [],
                vocabulariesIdsToDelete: command.vocabulariesIdsToDelete || [],
            };
            if (command.vocabularies) {
                command.vocabularies.forEach((vocabulary) => {
                    if (vocabulary.file) {
                        const newFile = new File([vocabulary.file], `${vocabulary.content}.wav`, {
                            type: vocabulary.file.type,
                        });
                        formData.vocabularies.push(vocabulary.content);
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

            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.put(
                `/activities/${id}`,
                formData,
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return activityCommandToDomain(httpResponse.parsedBody);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default UpdateActivityUsecase;
