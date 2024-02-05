type Administrator = {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    universityId: string;
};

export interface AdministratorFormPayload {
    id?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
    universityId?: string;
}

export default Administrator;
