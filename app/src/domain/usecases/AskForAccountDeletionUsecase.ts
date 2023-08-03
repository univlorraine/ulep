import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';

class AskForAccountDeletion implements AskForAccountDeletion {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<void | Error> {
        try {
            //TODO: Change this when route will be up
            /*
            const httpResponse: HttpResponse<LanguageAskedCommand> = await this.domainHttpAdapter.post(
                `/users/ask-deletion`,
                {}
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }
*/
            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default AskForAccountDeletion;
