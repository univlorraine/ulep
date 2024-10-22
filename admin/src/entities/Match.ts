import Language from './Language';
import { LearningLanguage } from './LearningLanguage';

export type MatchScore = {
    level: number;
    age: number;
    status: number;
    goals: number;
    interests: number;
    gender: number;
    university: number;
    meetingFrequency: number;
    certificateOption: number;
    total: number;
};

export type Match = {
    id: string;
    score: MatchScore;
    target: LearningLanguage;
    tandemLanguage?: Language;
};
