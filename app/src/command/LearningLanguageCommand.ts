import ProfileCommand from './ProfileCommand';

interface LearningLanguageCommand {
    id: string;
    name: string;
    code: string;
    level: CEFR;
    profile: ProfileCommand;
}
export default LearningLanguageCommand;
