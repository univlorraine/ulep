import CustomLearningGoal from './CustomLearningGoal';
import MediaObject from './MediaObject';
import Profile from './Profile';

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
        public customLearningGoals?: CustomLearningGoal[],
        public certificateFile?: MediaObject,
        public sharedCertificate?: boolean,
        public sharedLogsDate?: Date,
        public visioDuration?: number,
        public countVocabularies?: number,
        public countActivities?: number
    ) {}
}

export default LearningLanguage;
