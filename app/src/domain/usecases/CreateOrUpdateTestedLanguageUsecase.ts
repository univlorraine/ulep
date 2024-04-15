import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import ProfileCommand, { profileCommandToDomain } from '../../command/ProfileCommand';
import Language from '../entities/Language';
import CreateOrUpdateTestedLanguageUsecaseInterface from '../interfaces/CreateOrUpdateTestedLanguageUsecase.interface';

class CreateOrUpdateTestedLanguageUsecase implements CreateOrUpdateTestedLanguageUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setProfile: Function) {}

    async execute(id: string, language: Language, level: CEFR): Promise<void | Error> {
        try {
            const httpResponse: HttpResponse<ProfileCommand> = await this.domainHttpAdapter.post(
                `/profiles/${id}/tested-language`,
                {
                    code: language.code,
                    level,
                }
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            const profile = profileCommandToDomain(httpResponse.parsedBody);

            return await this.setProfile({ profile });
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateOrUpdateTestedLanguageUsecase;
