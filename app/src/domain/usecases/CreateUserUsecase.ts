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
        countryCode: string,
        avatar: File
    ): Promise<void | Error> {
        try {
            const formData = new FormData();
            formData.append('file', avatar);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('firstname', firstname);
            formData.append('lastname', lastname);
            formData.append('gender', gender);
            formData.append('age', age.toString());
            formData.append('university', university.id);
            formData.append('role', role);
            formData.append('countryCode', countryCode);

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

            return await this.login.execute(email, password);
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateUserUsecase;
