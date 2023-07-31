class Profile {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly firstname: string,
        public readonly lastname: string,
        public readonly age: number,
        public readonly gender: Gender,
        public readonly universityId: string,
        public readonly role: Role,
        public readonly nativeLanguageCode: string,
        public readonly learningLanguageCode: string,
        public readonly goals: string[],
        public readonly frequency: MeetFrequency,
        public readonly interests: string[],
        public readonly bios: string[],
        public readonly avatar: string
    ) {}
}

export default Profile;
