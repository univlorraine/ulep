import { TextContent, University } from 'src/core/models';
import { Language } from 'src/core/models/language.model';
import { MediaObject } from 'src/core/models/media.model';
import { ProficiencyLevel } from 'src/core/models/proficiency.model';
import { Profile } from 'src/core/models/profile.model';

export enum ActivityStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_VALIDATION = 'IN_VALIDATION',
  REJECTED = 'REJECTED',
}

interface ActivityProps {
  id: string;
  title: string;
  description: string;
  creator?: Profile;
  university: University;
  status: ActivityStatus;
  creditImage?: string;
  image: MediaObject;
  imageUrl?: string;
  languageLevel: ProficiencyLevel;
  language: Language;
  ressourceUrl?: string;
  ressourceFile?: MediaObject;
  ressourceFileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  activityTheme: ActivityTheme;
  activityVocabularies: ActivityVocabulary[];
  activityExercises: ActivityExercise[];
  metadata?: any;
}

export class Activity {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly creator?: Profile;
  readonly university: University;
  readonly status: ActivityStatus;
  readonly creditImage?: string;
  readonly image: MediaObject;
  readonly languageLevel: ProficiencyLevel;
  readonly language: Language;
  readonly ressourceUrl?: string;
  readonly ressourceFile?: MediaObject;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly activityTheme: ActivityTheme;
  activityVocabularies: ActivityVocabulary[];
  readonly activityExercises: ActivityExercise[];
  ressourceFileUrl?: string;
  imageUrl?: string;
  readonly metadata?: any;

  constructor({
    id,
    title,
    description,
    university,
    creator,
    status,
    creditImage,
    image,
    languageLevel,
    language,
    ressourceUrl,
    ressourceFile,
    ressourceFileUrl,
    imageUrl,
    createdAt,
    updatedAt,
    activityTheme,
    activityVocabularies,
    activityExercises,
    metadata,
  }: ActivityProps) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.creator = creator;
    this.university = university;
    this.status = status;
    this.creditImage = creditImage;
    this.image = image;
    this.languageLevel = languageLevel;
    this.language = language;
    this.ressourceUrl = ressourceUrl;
    this.ressourceFile = ressourceFile;
    this.ressourceFileUrl = ressourceFileUrl;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.activityTheme = activityTheme;
    this.activityVocabularies = activityVocabularies;
    this.activityExercises = activityExercises;
    this.metadata = metadata;
  }
}

interface ActivityThemeProps {
  id: string;
  content: TextContent;
  category?: ActivityThemeCategory;
  createdAt: Date;
  updatedAt: Date;
}

export class ActivityTheme {
  readonly id: string;
  readonly content: TextContent;
  readonly category?: ActivityThemeCategory;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor({
    id,
    content,
    category,
    createdAt,
    updatedAt,
  }: ActivityThemeProps) {
    this.id = id;
    this.content = content;
    this.category = category;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

interface ActivityThemeCategoryProps {
  id: string;
  content: TextContent;
  themes: ActivityTheme[];
  createdAt: Date;
  updatedAt: Date;
}

export class ActivityThemeCategory {
  readonly id: string;
  readonly content: TextContent;
  readonly themes: ActivityTheme[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor({
    id,
    content,
    themes,
    createdAt,
    updatedAt,
  }: ActivityThemeCategoryProps) {
    this.id = id;
    this.content = content;
    this.themes = themes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

interface ActivityVocabularyProps {
  id: string;
  content: string;
  pronunciationActivityVocabulary: MediaObject;
  pronunciationActivityVocabularyUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ActivityVocabulary {
  readonly id: string;
  readonly content: string;
  readonly pronunciationActivityVocabulary: MediaObject;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  pronunciationActivityVocabularyUrl: string;

  constructor({
    id,
    content,
    pronunciationActivityVocabulary,
    pronunciationActivityVocabularyUrl,
    createdAt,
    updatedAt,
  }: ActivityVocabularyProps) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.pronunciationActivityVocabulary = pronunciationActivityVocabulary;
    this.pronunciationActivityVocabularyUrl =
      pronunciationActivityVocabularyUrl;
  }
}

interface ActivityExerciseProps {
  id: string;
  content: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ActivityExercise {
  readonly id: string;
  readonly content: string;
  readonly order: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor({
    id,
    content,
    order,
    createdAt,
    updatedAt,
  }: ActivityExerciseProps) {
    this.id = id;
    this.content = content;
    this.order = order;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
