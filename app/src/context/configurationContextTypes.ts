import Configuration from '../domain/entities/Confirguration';
import GetAllCategoriesInterestUsecaseInterface from '../domain/interfaces/GetAllCategoriesInterestsUsecase.interface';
import GetAllCountriesUsecaseInterface from '../domain/interfaces/GetAllCountriesUsecase.interface';
import GetAllGoalsUsecaseInterface from '../domain/interfaces/GetAllGoalsUsecase.interface';
import GetAllLanguagesUsecaseInterface from '../domain/interfaces/GetAllLanguagesUsecase.interface';
import GetAllUniversitiesUsecaseInterface from '../domain/interfaces/GetAllUniversitiesUsecase.interface';
import LoginUsecaseInterface from '../domain/interfaces/LoginUsecase.interface';
import ResetPasswordUsecaseInterface from '../domain/interfaces/ResetPasswordUsecase.interface';

export interface ConfigContextValueType {
    configuration: Configuration;
    getAllCategoriesInterests: GetAllCategoriesInterestUsecaseInterface;
    getAllCountries: GetAllCountriesUsecaseInterface;
    getAllGoals: GetAllGoalsUsecaseInterface;
    getAllLanguages: GetAllLanguagesUsecaseInterface;
    getAllUniversities: GetAllUniversitiesUsecaseInterface;
    login: LoginUsecaseInterface;
    resetPassword: ResetPasswordUsecaseInterface;
}
