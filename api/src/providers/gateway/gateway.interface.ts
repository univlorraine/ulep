export interface IPersonne {
    email: string,
    firstname: string,
    lastname: string,
    age?: number,
    gender?: string,
    role: string,
    diploma: Iinfos,
    departement: Iinfos
}

interface Iinfos {
    code?: string,
    label?: string
}
