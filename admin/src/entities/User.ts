import University from './University';

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

type User = {
    id: string;
    status: UserStatus;
    role: UserRole;
    email: string;
    firstname: string;
    lastname: string;
    gender: Gender;
    university: University;
    age: number;
};

export default User;
