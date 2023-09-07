import { Profile } from './Profile';

type MatchScore = {
    level: number;
    age: number;
    status: number;
    goals: number;
    interests: number;
    gender: number;
    university: number;
    total: number;
};

type MatchTarget = {
    id: string;
    code: string;
    createdAt: Date;
    level: string;
    name: string;
    profile: Profile;
};

export type Match = {
    id: string;
    score: MatchScore;
    target: MatchTarget;
};
