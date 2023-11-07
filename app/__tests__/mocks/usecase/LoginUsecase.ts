import Tokens from '../../../src/domain/entities/Tokens';
import LoginUsecaseInterface from '../../../src/domain/interfaces/LoginUsecase.interface';

class LoginUsecase implements LoginUsecaseInterface {
    execute(email: string, password: string): Promise<Tokens | Error> {
        return Promise.resolve({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
    }
}

export default LoginUsecase;
