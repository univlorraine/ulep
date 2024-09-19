import Language from './Language';
import Profile from './Profile';

export enum ActivityStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    IN_VALIDATION = 'IN_VALIDATION',
}

export type ActivityProps = {
    id: string;
    title: string;
    description: string;
    status: ActivityStatus;
    imageUrl: string;
    creator: Profile;
    languageLevel: CEFR;
    language: Language;
    activityTheme: ActivityTheme;
    vocabularies: ActivityVocabulary[];
    exercises: ActivityExercises[];
    creditImage?: string;
    ressourceUrl?: string;
    ressourceFileUrl?: string;
};

export class Activity {
    public readonly id: string;
    public readonly title: string;
    public readonly description: string;
    public readonly status: ActivityStatus;
    public readonly imageUrl: string;
    public readonly creator: Profile;
    public readonly languageLevel: CEFR;
    public readonly language: Language;
    public readonly activityTheme: ActivityTheme;
    public readonly vocabularies: ActivityVocabulary[];
    public readonly exercises: ActivityExercises[];
    public readonly creditImage?: string;
    public readonly ressourceUrl?: string;
    public readonly ressourceFileUrl?: string;

    constructor(props: ActivityProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.status = props.status;
        this.imageUrl = props.imageUrl;
        this.creator = props.creator;
        this.languageLevel = props.languageLevel;
        this.language = props.language;
        this.activityTheme = props.activityTheme;
        this.vocabularies = props.vocabularies;
        this.exercises = props.exercises;
        this.creditImage = props.creditImage;
        this.ressourceUrl = props.ressourceUrl;
        this.ressourceFileUrl = props.ressourceFileUrl;
    }
}

export class ActivityTheme {
    constructor(public readonly id: string, public readonly content: string) {}
}

export class ActivityThemeCategory {
    constructor(public readonly id: string, public readonly content: string, public readonly themes: ActivityTheme[]) {}
}

export class ActivityVocabulary {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly pronunciationUrl: string
    ) {}
}

export class ActivityExercises {
    constructor(public readonly id: string, public readonly content: string, public readonly order: number) {}
}
