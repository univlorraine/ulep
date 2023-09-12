import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { LanguageAskedCommand } from '../../command/LanguageCommand';
import Language from '../entities/Language';
import AskForLanguageUsecaseInterface from '../interfaces/AskForLanguageUsecase.interface';

class AskForLanguageUsecase implements AskForLanguageUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(language: Language): Promise<number | Error> {
        try {
            const httpResponse: HttpResponse<LanguageAskedCommand> = await this.domainHttpAdapter.post(
                `/languages/${language.code}/requests`,
                {}
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return httpResponse.parsedBody.count;
        } catch (error: any) {
            if (error.status === 409) {
                return new Error('errors.ask_language.conflit');
            }

            return new Error('errors.global');
        }
    }
}

export default AskForLanguageUsecase;
