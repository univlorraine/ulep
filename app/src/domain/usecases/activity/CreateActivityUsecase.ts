import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand, activityCommandToDomain } from '../../../command/ActivityCommand';
import { Activity } from '../../entities/Activity';
import CreateActivityUsecaseInterface, {
    CreateActivityCommand,
} from '../../interfaces/activity/CreateActivityUsecase.interface';

interface ActivityPayload {
    title: string;
    description: string;
    languageLevel: string;
    languageCode: string;
    themeId: string;
    image: File;
    creditImage?: string;
    ressource?: File;
    ressourceUrl?: string;
    profileId: string;
    exercises: { content: string; order: number }[];
    vocabularies: string[];
    vocabulariesFiles: File[];
}
class CreateActivityUsecase implements CreateActivityUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateActivityCommand): Promise<Activity | Error> {
        try {
            const formData: ActivityPayload = {
                title: command.title,
                description: command.description,
                languageLevel: command.languageLevel,
                languageCode: command.languageCode,
                themeId: command.themeId,
                image: command.image,
                creditImage: command.creditImage,
                ressourceUrl: command.ressourceUrl,
                profileId: command.profileId,
                exercises: command.exercises,
                vocabularies: command.vocabularies.map((vocabulary) => vocabulary.content),
                vocabulariesFiles: [],
            };

            command.vocabularies.forEach((vocabulary) => {
                if (vocabulary.file) {
                    const newFile = new File([vocabulary.file], vocabulary.content, { type: vocabulary.file.type });
                    formData.vocabulariesFiles.push(newFile);
                }
            });

            if (command.ressource) {
                formData.ressource = command.ressource;
            }

            if (command.ressourceUrl) {
                formData.ressourceUrl = command.ressourceUrl;
            }

            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.post(
                `/activities`,
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

export default CreateActivityUsecase;
