import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UserResult, { userResultToDomain } from '../../command/UserResult';
import EditUserUsecaseInterface from '../interfaces/EditUserUsecase.interface';

interface UserEditPayload {
    age: number;
    email: string;
    firstname: string;
    gender: Gender;
    lastname: string;
    file?: File;
}

class EditUserUsecase implements EditUserUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setUserUpdated: Function) {}

    async execute(
        userId: string,
        age: number,
        email: string,
        firstname: string,
        gender: Gender,
        lastname: string,
        avatar?: File
    ): Promise<void | Error> {
        try {
            const body: UserEditPayload = {
                email,
                firstname,
                lastname,
                gender,
                age,
            };

            if (avatar) {
                body.file = avatar;
            }

            const httpResponse: HttpResponse<UserResult> = await this.domainHttpAdapter.post(
                `/users/${userId}/`,
                body,
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            return this.setUserUpdated({
                user: userResultToDomain(httpResponse.parsedBody),
                keepProfile: true,
                keepProfileSignUp: true,
            });
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

            if (error.statusCode === 409) {
                return new Error('signup_informations_page.error_email_already_exist');
            }

            if (error.statusCode === 401) {
                return new Error('signup_informations_page.error_unauthorized');
            }

            return new Error('errors.global');
        }
    }
}

export default EditUserUsecase;
