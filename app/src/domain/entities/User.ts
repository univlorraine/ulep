import MediaObject from './MediaObject';
import University from './University';

class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly firstname: string,
        public readonly lastname: string,
        public readonly status: UserStatus,
        public university: University,
        public acceptsEmail: boolean,
        public avatar?: MediaObject
    ) {}
}

export default User;
