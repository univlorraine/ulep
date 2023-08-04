import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../command/CollectionCommand';
import LanguageCommand, { languageCommandToDomain } from '../../command/LanguageCommand';
import Language from '../entities/Language';
import GetAllLanguagesUsecaseInterface from '../interfaces/GetAllLanguagesUsecase.interface';

// TODO(herve): Validate the usecase, cause there is 2 ways to do this:
// 1. Use /languages to get all existing languages
// 2. Use /universities/{id}/languages to get all languages available for a specific university
class GetAllLanguagesUsecase implements GetAllLanguagesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<Language[] | Error> {
        try {
            const httpResponse: HttpResponse<CollectionCommand<LanguageCommand>> = await this.domainHttpAdapter.get(
                `/languages`
            );

            if (!httpResponse.parsedBody || !httpResponse.parsedBody.items) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.items.map((language) => languageCommandToDomain(language));
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default GetAllLanguagesUsecase;
