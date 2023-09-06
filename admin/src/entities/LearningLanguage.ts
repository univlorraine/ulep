import { Profile } from './Profile';

type LearningLanguage = {
    id: string;
    code: string;
    level: string;
    name: string;
    createdAt: Date;
    profile: Profile;
};

export default LearningLanguage;
