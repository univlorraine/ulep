import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UserCommand, { userCommandToDomain } from '../../command/UserCommand';
import University from '../entities/University';
import CreateUserUsecaseInterface from '../interfaces/CreateUserUsecase.interface';
import LoginUsecaseInterface from '../interfaces/LoginUsecase.interface';

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

            this.setUser({ user: userCommandToDomain(httpResponse.parsedBody) });

            await this.login.execute(email, password);

            return;
        } catch (error: any) {
            return new Error('errors.global');
        }
    }
}

export default CreateUserUsecase;
