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

import qsAdapter from '../providers/qsAdapter';

export interface LearningLanguagesParams {
    filter: {
        universityIds: string[];
        hasActiveTandem?: boolean;
        hasActionableTandem?: boolean;
        hasPausedTandem?: boolean;
        profile: {
            user: {
                lastname: string;
            };
        };
    };
    pagination: {
        page: string;
        perPage: string;
    };
    sort?: {
        field: string;
        order: string;
    };
}

const handleOrderField = (field?: string) => {
    switch (field) {
        case 'profile.name':
            return 'profile';
        case 'name':
            return 'language';
        case 'profile.user.university.name':
            return 'university';
        case 'profile.user.role':
            return 'role';
        case 'level':
        case 'createdAt':
        case 'activeTandem':
        case 'specificProgram':
            return field;
        default:
            return undefined;
    }
};

export const LearningLanguagesQuery = (params: LearningLanguagesParams): string => {
    const query = {
        lastname: params.filter.profile?.user?.lastname,
        universityIds: params.filter.universityIds,
        hasActiveTandem: params.filter.hasActiveTandem,
        hasActionableTandem: params.filter.hasActionableTandem,
        hasPausedTandem: params.filter.hasPausedTandem,
        page: params.pagination.page,
        limit: params.pagination.perPage,
        field: handleOrderField(params.sort?.field),
        order: params.sort?.order?.toLowerCase(),
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export interface LearningLanguageMatchesParams {
    filter: {
        id: string;
        universityIds: string[];
        count?: number;
    };
}

export const LearningLanguageMatchesQuery = (params: LearningLanguageMatchesParams): string => {
    const query = {
        universityIds: params.filter.universityIds,
        count: params.filter.count,
    };

    return new URLSearchParams(qsAdapter().stringify(query)).toString();
};

export default LearningLanguagesQuery;
