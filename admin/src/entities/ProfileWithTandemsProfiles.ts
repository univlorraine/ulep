import Language from './Language';
import { LearningLanguageWithTandemWithPartnerProfile } from './LearningLanguage';
import User from './User';

export interface ProfileWithTandemsProfiles {
    id: string;
    user: User;
    nativeLanguage: Language;
    masteredLanguages: Language[];
    learningLanguages: LearningLanguageWithTandemWithPartnerProfile[];
    createdAt?: Date;
}
