import { HttpResponse } from '../../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../../adapter/DomainHttpAdapter';
import { ActivityCommand, activityCommandToDomain } from '../../../command/ActivityCommand';
import { Activity } from '../../entities/Activity';
import CreateActivityUsecaseInterface, {
    CreateActivityCommand,
} from '../../interfaces/activity/CreateActivityUsecase.interface';

class CreateActivityUsecase implements CreateActivityUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(command: CreateActivityCommand): Promise<Activity | Error> {
        try {
            const formData: any = {
                title: command.title,
                description: command.description,
                languageLevel: command.languageLevel,
                languageCode: command.languageCode,
                themeId: command.themeId,
                image: command.image,
                creditImage: command.creditImage,
                ressourceFile: command.ressourceFile,
                ressourceUrl: command.ressourceUrl,
                profileId: command.profileId,
                exercises: command.exercises,
            };

            if (command.ressourceFile) {
                formData.ressourceFile = command.ressourceFile;
            }

            if (command.ressourceUrl) {
                formData.ressourceUrl = command.ressourceUrl;
            }

            if (command.vocabularies) {
                command.vocabularies.forEach((vocabulary, index) => {
                    formData.vocabularies[index].content = vocabulary.content;
                    formData.vocabularies[index].pronunciationActivityVocabulary =
                        vocabulary.pronunciationActivityVocabulary;
                });
            }

            const httpResponse: HttpResponse<ActivityCommand> = await this.domainHttpAdapter.post(
                `/activities/`,
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
