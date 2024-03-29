import { HttpResponse } from '../../adapter/BaseHttpAdapter';
import { HttpAdapterInterface } from '../../adapter/DomainHttpAdapter';
import UserResult, { userResultToDomain } from '../../command/UserResult';
import EditUserUsecaseInterface from '../interfaces/EditUserUsecase.interface';

interface UserPayload {
    age: number;
    firstname: string;
    gender: Gender;
    lastname: string;
    file?: File;
}

class EditUserUsecase implements EditUserUsecaseInterface {
    constructor(private readonly domainHttpAdapter: HttpAdapterInterface, private readonly setUser: Function) {}

    async execute(
        userId: string,
        firstname: string,
        lastname: string,
        gender: Gender,
        age: number,
        avatar?: File
    ): Promise<void | Error> {
        try {
            const body: UserPayload = {
                firstname,
                lastname,
                gender,
                age,
            };

            if (avatar) {
                body.file = avatar;
            }

            const httpResponse: HttpResponse<UserResult> = await this.domainHttpAdapter.post(
                `/users/edit/${userId}/`,
                body,
                {},
                'multipart/form-data'
            );

            if (!httpResponse.parsedBody) {
                return new Error('errors.global');
            }

            this.setUser({
                user: userResultToDomain(httpResponse.parsedBody),
            });

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

            if (error.statusCode === 400 && error.message === 'Domain is invalid') {
                return new Error('signup_informations_page.error_domain');
            }

            return new Error('errors.global');
        }
    }
}

export default EditUserUsecase;
