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

            if (division) {
                body.division = division;
            }

            if (diploma) {
                body.diploma = diploma;
            }

            if (staffFunction) {
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

            // Gestion des erreurs de fichier
            if (error.statusCode === 400 && error.message.includes('expected size')) {
                return new Error('signup_informations_page.error_picture_weight');
            }

            if (error.statusCode === 400 && error.message.includes('expected type')) {
                return new Error('signup_informations_page.error_picture_format');
            }

            // Gestion des erreurs d'authentification
            if (error.statusCode === 401) {
                return new Error('signup_informations_page.error_unauthorized');
            }

            // Gestion des erreurs de conflit
            if (error.statusCode === 409) {
                return new Error('signup_informations_page.error_email_already_exist');
            }

            // Gestion des erreurs d'inscription par message
            if (error.statusCode === 400 && error.message === 'Domain is invalid') {
                return new Error('signup_informations_page.error_domain');
            }

            if (error.statusCode === 400 && error.message === 'Code is invalid') {
                return new Error('signup_informations_page.error_code');
            }

            if (error.statusCode === 400 && error.message === 'University does not exist') {
                return new Error('signup_informations_page.error_university_not_found');
            }

            if (error.statusCode === 400 && error.message === 'Country code does not exist') {
                return new Error('signup_informations_page.error_country_not_found');
            }

            if (error.statusCode === 400 && error.message === 'Registration unavailable') {
                return new Error('signup_informations_page.error_registration_unavailable');
            }

            if (error.statusCode === 400 && error.message === 'User does not exist') {
                return new Error('signup_informations_page.error_user_not_found');
            }

            if (error.statusCode === 400 && error.message === 'User already exist') {
                return new Error('signup_informations_page.error_user_already_exists');
            }

            if (error.statusCode === 400 && error.message === 'User password is not valid') {
                return new Error('signup_informations_page.error_password');
            }

            return new Error('errors.global');
        }
    }
}

export default CreateUserUsecase;
