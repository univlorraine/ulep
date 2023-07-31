import CameraAdapterInterface from '../adapter/interfaces/CameraAdapter.interface';
import Configuration from '../domain/entities/Confirguration';
import AskForLanguageUsecaseInterface from '../domain/interfaces/AskForLanguageUsecase.interface';
import CreateUserUsecaseInterface from '../domain/interfaces/CreateUserUsecase.interface';
import GetAllCategoriesInterestUsecaseInterface from '../domain/interfaces/GetAllCategoriesInterestsUsecase.interface';
import GetAllCountriesUsecaseInterface from '../domain/interfaces/GetAllCountriesUsecase.interface';
import GetAllGoalsUsecaseInterface from '../domain/interfaces/GetAllGoalsUsecase.interface';
import GetAllLanguagesUsecaseInterface from '../domain/interfaces/GetAllLanguagesUsecase.interface';
import GetAllUniversitiesUsecaseInterface from '../domain/interfaces/GetAllUniversitiesUsecase.interface';
import GetQuizzByLevelUsecaseInterface from '../domain/interfaces/GetQuizzByLevelUsecase.interface';
import LoginUsecaseInterface from '../domain/interfaces/LoginUsecase.interface';
import ResetPasswordUsecaseInterface from '../domain/interfaces/ResetPasswordUsecase.interface';

export interface ConfigContextValueType {
    askForLanguage: AskForLanguageUsecaseInterface;
    cameraAdapter: CameraAdapterInterface;
    configuration: Configuration;
    createUser: CreateUserUsecaseInterface;
    getAllCategoriesInterests: GetAllCategoriesInterestUsecaseInterface;
    getAllCountries: GetAllCountriesUsecaseInterface;
    getAllGoals: GetAllGoalsUsecaseInterface;
    getAllLanguages: GetAllLanguagesUsecaseInterface;
    getAllUniversities: GetAllUniversitiesUsecaseInterface;
    getQuizzByLevel: GetQuizzByLevelUsecaseInterface;
    login: LoginUsecaseInterface;
    resetPassword: ResetPasswordUsecaseInterface;
}
