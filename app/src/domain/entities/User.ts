import MediaObject from './MediaObject';
import University from './University';

class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly firstname: string,
        public readonly lastname: string,
        public readonly status: UserStatus,
        public readonly staffFunction: string,
        public readonly role: Role,
        public readonly gender: Gender,
        public readonly division: string,
        public readonly diploma: string,
        public readonly country: string,
        public readonly age: number,
        public university: University,
        public acceptsEmail: boolean,
        public avatar?: MediaObject
    ) {}
}

export class UserMessage implements Pick<User, 'id' | 'firstname' | 'lastname' | 'avatar' | 'email'> {
    constructor(
        public readonly id: string,
        public readonly firstname: string,
        public readonly lastname: string,
        public readonly email: string,
        public readonly avatar?: MediaObject
    ) {}
}

export default User;
