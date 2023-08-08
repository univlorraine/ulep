import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import University from '../entities/University';
import CreateUserUsecaseInterface from '../interfaces/CreateUserUsecase.interface';
import LoginUsecaseInterface from '../interfaces/LoginUsecase.interface';

class CreateUserUsecase implements CreateUserUsecaseInterface {
    constructor(
        private readonly domainHttpAdapter: HttpAdapterInterface,
        private readonly login: LoginUsecaseInterface
    ) {}

    async execute(
        email: string,
        password: string,
        firstname: string,
        lastname: string,
        gender: Gender,
        age: number,
        university: University,
        role: Role,
        countryCode: string,
        avatar: File
    ): Promise<void | Error> {
        try {
            //TODO: Change this when api will be ready ( test is ignored too)
            /*
            const body = {
                file: avatar,
                email,
                password,
                firstname,
                lastname,
                gender,
                age,
                university: university.id,
                role,
                countryCode,
            };
            const httpResponse: HttpResponse<undefined> = await this.domainHttpAdapter.post(
                `/users`,
                body,
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return this.login.execute(email, password);*/
            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateUserUsecase;
