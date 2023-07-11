import GetAllCountriesUsecaseInterface from '../domain/interfaces/GetAllCountriesUsecase.interface';
import GetAllUniversitiesUsecaseInterface from '../domain/interfaces/GetAllUniversitiesUsecase.interface';
import LoginUsecaseInterface from '../domain/interfaces/LoginUsecase.interface';
import ResetPasswordUsecaseInterface from '../domain/interfaces/ResetPasswordUsecase.interface';

export interface ConfigContextValueType {
    getAllCountries: GetAllCountriesUsecaseInterface;
    getAllUniversities: GetAllUniversitiesUsecaseInterface;
    loginUsecase: LoginUsecaseInterface;
    resetPasswordUsecase: ResetPasswordUsecaseInterface;
}
