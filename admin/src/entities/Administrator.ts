import Language from './Language';

export type KeycloakGroup = {
    id: string;
    name: string;
    path: string;
};

export enum Role {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super-admin',
    ANIMATOR = 'animator',
    MANAGER = 'manager',
}

export enum AdminGroup {
    SUPER_ADMIN = 'Administrator',
    ANIMATOR = 'Animator',
    MANAGER = 'Manager',
}

type Administrator = {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    universityId: string;
    languageId: string;
    language: Language;
    group: KeycloakGroup;
};

export interface AdministratorFormPayload {
    id?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
    universityId?: string;
    group: KeycloakGroup;
    file: File | undefined;
    languageId?: string;
}

export default Administrator;
