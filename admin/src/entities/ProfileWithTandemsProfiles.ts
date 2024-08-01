import Language from './Language';
import { LearningLanguageWithTandem } from './LearningLanguage';
import User from './User';

export interface ProfileWithTandemsProfiles {
    id: string;
    user: User;
    nativeLanguage: Language;
    masteredLanguages: Language[];
    learningLanguages: LearningLanguageWithTandem[];
    createdAt?: Date;
}
