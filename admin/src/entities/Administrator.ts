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
    SUPER_ADMIN = 'SuperAdministrators',
    ANIMATOR = 'Animators',
    MANAGER = 'Managers',
}

type Administrator = {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    universityId: string;
    groups: KeycloakGroup[];
};

export interface AdministratorFormPayload {
    id?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
    universityId?: string;
    groups: string[] | KeycloakGroup[];
}

export default Administrator;
