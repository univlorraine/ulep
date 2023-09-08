import { Profile } from './Profile';

export type LearningLanguage = {
    id: string;
    code: string;
    level: string;
    name: string;
    createdAt: Date;
    profile?: Profile;
};

export type LearningLanguageTandem = {
    id: string;
    status: string;
    learningLanguage: LearningLanguage;
    partner: Profile;
};

export enum TandemStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
}
