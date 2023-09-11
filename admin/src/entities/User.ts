import University from './University';

type User = {
    id: string;
    status: UserStatus;
    role: UserRole;
    firstname: string;
    lastname: string;
    university: University;
};

export default User;
