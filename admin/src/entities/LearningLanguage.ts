import { Profile } from './Profile';
import { TandemSummary } from './Tandem';

export type LearningLanguage = {
    id: string;
    code: string;
    level: string;
    name: string;
    createdAt: Date;
    profile?: Profile;
    tandem?: TandemSummary;
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
