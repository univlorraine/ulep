import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UserCommand, { userCommandToDomain } from '../../command/UserCommand';
import University from '../entities/University';
import CreateUserUsecaseInterface from '../interfaces/CreateUserUsecase.interface';
import LoginUsecaseInterface from '../interfaces/LoginUsecase.interface';

interface UserPayload {
    age: number;
    code: string;
    countryCode: string;
    email: string;
    firstname: string;
    gender: Gender;
    lastname: string;
    password: string;
    role: Role;
    university: string;
    file?: File;
}

class CreateUserUsecase implements CreateUserUsecaseInterface {
    constructor(
        private readonly domainHttpAdapter: HttpAdapterInterface,
        private readonly login: LoginUsecaseInterface,
        private readonly setUser: Function
    ) {}

    async execute(
        email: string,
        password: string,
        firstname: string,
        lastname: string,
        gender: Gender,
        code: string,
        age: number,
        university: University,
        role: Role,
        countryCode: string,
        avatar?: File
    ): Promise<void | Error> {
        try {
            const body: UserPayload = {
                email,
                password,
                firstname,
                lastname,
                gender,
                code,
                age,
                university: university.id,
                role,
                countryCode,
            };

            if (avatar) {
                body.file = avatar;
            }

            const httpResponse: HttpResponse<UserCommand> = await this.domainHttpAdapter.post(
                `/users`,
                body,
                {},
                'multipart/form-data',
                false
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            this.setUser({
                user: userCommandToDomain(httpResponse.parsedBody),
            });

            await this.login.execute(email, password);

            return;
        } catch (err: any) {
            const error = err.error;

            if (!error || !error.statusCode) {
                return new Error('errors.global');
            }

            if (error.statusCode === 409) {
                return new Error('signup_informations_page.error_email_already_exist');
            }

            if (error.statusCode === 400 && error.message === 'Domain is invalid') {
                return new Error('signup_informations_page.error_domain');
            }

            if (error.statusCode === 400 && error.message === 'Code is invalid') {
                return new Error('signup_informations_page.error_code');
            }
            return new Error('errors.global');
        }
    }
}

export default CreateUserUsecase;
