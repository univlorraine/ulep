import LoginUsecaseInterface from '../../../src/domain/interfaces/LoginUsecase.interface';

class LoginUsecase implements LoginUsecaseInterface {
    execute(email: string, password: string): Promise<void | Error> {
        return Promise.resolve();
    }
}

export default LoginUsecase;
