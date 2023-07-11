import LoginUsecaseInterface from '../domain/interfaces/LoginUsecase.interface';
import ResetPasswordUsecaseInterface from '../domain/interfaces/ResetPasswordUsecase.interface';

export interface ConfigContextValueType {
    loginUsecase: LoginUsecaseInterface;
    resetPasswordUsecase: ResetPasswordUsecaseInterface;
}
