import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import RefreshTokensUsecaseInterface from '../interfaces/RefreshTokensUsecase.interface';

class RefreshTokensUsecase implements RefreshTokensUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface) {}

    async execute(): Promise<void | Error> {
        try {
            await this.domainHttpAdapter.handleTokens(true);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default RefreshTokensUsecase;
