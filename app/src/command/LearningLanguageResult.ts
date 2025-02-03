import CustomLearningGoal from '../domain/entities/CustomLearningGoal';
import LearningLanguage from '../domain/entities/LearningLanguage';
import MediaObject from '../domain/entities/MediaObject';
import { customLearningGoalCommandToDomain } from './CustomLearningGoalCommand';
import { mediaObjectCommandToDomain } from './MediaObjectCommand';
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
    customLearningGoals?: CustomLearningGoal[];
    // Profile can be included but not always
    profile?: ProfileCommand;
    certificateFile?: MediaObject;
    sharedCertificate?: boolean;
    sharedLogsDate?: Date;
    visioDuration?: number;
    countVocabularies?: number;
    countActivities?: number;
}

export const learningLanguageResultToDomain = (result: LearningLanguageResult) =>
    new LearningLanguage(
        result.id,
        result.code,
        result.name,
        result.level,
        result.learningType,
        result.sameAge,
        result.sameGender,
        result.certificateOption,
        result.specificProgram,
        result.profile ? profileCommandToDomain(result.profile) : undefined,
        result.customLearningGoals ? result.customLearningGoals.map(customLearningGoalCommandToDomain) : undefined,
        result.certificateFile ? mediaObjectCommandToDomain(result.certificateFile) : undefined,
        result.sharedCertificate,
        result.sharedLogsDate,
        result.visioDuration,
        result.countVocabularies,
        result.countActivities
    );

export default learningLanguageResultToDomain;
