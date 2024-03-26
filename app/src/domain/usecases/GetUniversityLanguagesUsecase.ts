import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import LanguageCommand, { languageCommandToDomain } from '../../command/LanguageCommand';
import Language from '../entities/Language';
import GetUniversityLanguagesUsecaseInterface from '../interfaces/GetUniversityLanguagesUsecase.interface';

class GetUniversityLanguagesUsecase implements GetUniversityLanguagesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}
    async execute(universityId: string): Promise<Language[] | Error> {
        try {
            const httpResponse: HttpResponse<LanguageCommand[]> = await this.domainHttpAdapter.get(
                `/university/${universityId}/languages`
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
            return httpResponse.parsedBody.map(languageCommandToDomain);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetUniversityLanguagesUsecase;
