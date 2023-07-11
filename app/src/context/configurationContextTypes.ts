import GetAllCountriesUsecaseInterface from '../domain/interfaces/GetAllCountriesUsecase.interface';
import LoginUsecaseInterface from '../domain/interfaces/LoginUsecase.interface';
import ResetPasswordUsecaseInterface from '../domain/interfaces/ResetPasswordUsecase.interface';

export interface ConfigContextValueType {
    getAllCountries: GetAllCountriesUsecaseInterface;
    loginUsecase: LoginUsecaseInterface;
    resetPasswordUsecase: ResetPasswordUsecaseInterface;
}
