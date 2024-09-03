import { Language } from 'src/core/models/language.model';
import { MediaObject } from 'src/core/models/media.model';
import { Profile } from 'src/core/models/profile.model';

type VocabularyListProps = {
  id: string;
  name: string;
  profiles: Profile[];
  symbol: string;
  vocabularies: Vocabulary[];
  translationLanguage: Language;
  wordLanguage: Language;
};

type VocabularyProps = {
  id: string;
  word: string;
  translation: string;
  pronunciationWord?: MediaObject;
  pronunciationTranslation?: MediaObject;
};

export class VocabularyList {
  readonly id: string;

  readonly name: string;

  readonly profiles: Profile[];

  readonly symbol: string;

  readonly translationLanguage: Language;

  readonly wordLanguage: Language;

  readonly vocabularies: Vocabulary[];

  constructor(props: VocabularyListProps) {
    this.id = props.id;
    this.name = props.name;
    this.symbol = props.symbol;
    this.profiles = props.profiles;
    this.vocabularies = props.vocabularies;
    this.translationLanguage = props.translationLanguage;
    this.wordLanguage = props.wordLanguage;
  }
}

export class Vocabulary {
  readonly id: string;

  readonly word: string;

  readonly translation: string;

  pronunciationWord?: MediaObject;

  pronunciationTranslation?: MediaObject;

  constructor(props: VocabularyProps) {
    this.id = props.id;
    this.word = props.word;
    this.translation = props.translation;
    this.pronunciationWord = props.pronunciationWord;
    this.pronunciationTranslation = props.pronunciationTranslation;
  }
}
