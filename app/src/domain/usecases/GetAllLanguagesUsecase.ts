import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { CollectionCommand } from '../../command/CollectionCommand';
import LanguageCommand, { languageCommandToDomain } from '../../command/LanguageCommand';
import Language from '../entities/Language';
import GetAllLanguagesUsecaseInterface from '../interfaces/GetAllLanguagesUsecase.interface';

class GetAllLanguagesUsecase implements GetAllLanguagesUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(status: string): Promise<Language[] | Error> {
        try {
            let route = `/languages?${status ? `status=${status}` : ''}&pagination=false&field=name&order=asc`;
            const httpResponse: HttpResponse<CollectionCommand<LanguageCommand>> = await this.domainHttpAdapter.get(
                route
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
