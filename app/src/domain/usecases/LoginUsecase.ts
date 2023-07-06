import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import DomainHttpAdapter from '../../adapter/DomainHttpAdapter';

class LoginCommand {}

class LoginUsecase implements LoginUsecaseInterface {
    constructor(private readonly domainHttpAdapter: DomainHttpAdapter) {}

    async execute(email: string, password: string): Promise<any> {
        try {
            const httpRepsonse: HttpResponse<LoginCommand> = await this.domainHttpAdapter.post('');
        } catch (error) {}
    }
}

export default LoginUsecase;
