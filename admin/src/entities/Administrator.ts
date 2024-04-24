export type KeycloakGroup = {
    id: string;
    name: string;
    path: string;
};

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
