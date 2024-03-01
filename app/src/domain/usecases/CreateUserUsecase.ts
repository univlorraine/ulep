import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UserResult, { userResultToDomain } from '../../command/UserResult';
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
    division?: string;
    diploma?: string;
    staffFunction?: string;
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
        division?: string,
        diploma?: string,
        staffFunction?: string,
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

            if(division) {
                body.division = division;
            }

            if(diploma) {
                body.diploma = diploma;
            }

            if(staffFunction) {
                body.staffFunction = staffFunction;
            }

            const httpResponse: HttpResponse<UserResult> = await this.domainHttpAdapter.post(
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
                user: userResultToDomain(httpResponse.parsedBody),
            });

            await this.login.execute(email, password);

            return;
        } catch (err: any) {
            const error = err.error;

            if (!error || !error.statusCode) {
                return new Error('errors.global');
            }

            if (error.statusCode === 400 && error.message.includes('expected size')) {
                return new Error('signup_informations_page.error_picture_weight');
            }

            if (error.statusCode === 400 && error.message.includes('expected type')) {
                return new Error('signup_informations_page.error_picture_format');
            }

            if (error.statusCode === 401) {
                return new Error('signup_informations_page.error_unauthorized');
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
