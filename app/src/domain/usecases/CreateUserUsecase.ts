import { HttpResponse } from '../../adapter/BaseHttpAdapter';
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
        countryCode: string
    ): Promise<void | Error> {
        try {
            const httpRepsonse: HttpResponse<undefined> = await this.domainHttpAdapter.post(`/users/`, {
                email,
                password,
                firstname,
                lastname,
                gender,
                age,
                university: university.id,
                role,
                countryCode,
            });

            if (!httpRepsonse.parsedBody) {
                return new Error('errors.global');
            }

            return this.login.execute(email, password);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateUserUsecase;
