import Tokens from '../entities/Tokens';

interface LoginUsecaseInterface {
    execute(email: string, password: string): Promise<Tokens | Error>;
}
export default LoginUsecaseInterface;
