import Profile from "./Profile";

class LearningLanguage {
    constructor(
        public id: string,
        public code: string,
        public name: string,
        public level: CEFR,
        public learningType: Pedagogy,
        public sameAge?: boolean,
        public sameGender?: boolean,
        public certificateOption?: boolean,
        public specificProgram?: boolean,
        public profile?: Profile,
    ) {}
}

export default LearningLanguage;
