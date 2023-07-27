import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import { LanguageAskedCommand } from '../../command/LanguageCommand';
import Language from '../entities/Language';
import AskForLanguageUsecaseInterface from '../interfaces/AskForLanguageUsecase.interface';

class AskForLanguageUsecase implements AskForLanguageUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(language: Language): Promise<number | Error> {
        try {
            const httpRepsonse: HttpResponse<LanguageAskedCommand> = await this.domainHttpAdapter.post(
                `/laguages/${language.code}/requests`,
                {}
            );

            if (!httpRepsonse.parsedBody) {
                return new Error('errors.global');
            }

            return httpRepsonse.parsedBody.count;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default AskForLanguageUsecase;
