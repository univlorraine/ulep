import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import LanguageCommand, { languageCommandToDomain } from '../../command/LanguageCommand';
import Language from '../entities/Language';
import GetAllLanguagesUsecaseInterface from '../interfaces/GetAllLanguagesUsecase.interface';

class GetAllLanguagesUsecase implements GetAllLanguagesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<Language[] | Error> {
        try {
            const httpResponse: HttpResponse<LanguageCommand[]> = await this.domainHttpAdapter.get(`/languages`);

            if (!httpResponse.parsedBody || !httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.map((language) => languageCommandToDomain(language));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllLanguagesUsecase;
