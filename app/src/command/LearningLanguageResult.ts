import LearningLanguage from '../domain/entities/LearningLanguage';
import ProfileCommand, { profileCommandToDomain } from './ProfileCommand';

export interface LearningLanguageResult {
    id: string;
    code: string;
    name: string;
    learningType: Pedagogy;
    level: CEFR;
    sameAge?: boolean;
    sameGender?: boolean;
    certificateOption?: boolean;
    specificProgram?: boolean;

    // Profile can be included but not always
    profile?: ProfileCommand;
}


export const learningLanguageResultToDomain = (result: LearningLanguageResult) => new LearningLanguage(
    result.id,
    result.code,
    result.name,
    result.level,
    result.learningType,
    result.sameAge,
    result.sameGender,
    result.certificateOption,
    result.specificProgram,
    result.profile ? profileCommandToDomain(result.profile) : undefined
);

export default learningLanguageResultToDomain;
