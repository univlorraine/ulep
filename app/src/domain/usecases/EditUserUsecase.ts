/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
