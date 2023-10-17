# Discovery languages

## Context

We're considering a learning language has discover when: 
- LearningLanguage's learning type is TANDEM
- LearningLanguage's language is joker
- LearningLanguage's language is asian language
- LearningLanguage's learningType AND match learningType are BOTH


## Impacts

### Global

- Update discoverLearningLanguage definition (see context section above)
- Different score computation matrix
- Take potential match learningLanguages into account when checking learning compatibility (if learning is considered discover
- Update forbidden cases for discover languages (ex: tandem verifications, match score verifications for null score)

### Individual routine

- Need to consider learningLanguages in potential match of discover learningLanguage

### Joker language

Joker language can match with several languages spoken or learnt by an other profile.
Therefor:
- when we computing language score for a joker language, we must compare to all languages spoken / learnt by profile that the learning language owner do not speak
- when we create or suggest a tandem we also need to store which language has been matched

We'll store the language learnt (in case of joker language) in LearningLanguage model.

```plantuml

class Languages {
  id: string
  ---
  // other languages props
}

class LearningLanguages {
  id: string
  ---
  languageId: string
  ---
  // all props
  tandemId: string
  tandemLearntLanguageId: string
}

class Tandems {
  id: string
  ---
  // all other props
}

LearningLanguages::languageId ||--o{ Languages::id
LearningLanguages::tandemLearntLanguageId |o--o{ Languages::id
LearningLanguages::tandemId |o--|| Tandems::id
```

### Both learning type

If both learning languages has a learning type `BOTH` and are on the same campus, we consider their tandem with `TANDEM` learning type (thus with discovery mode).

## Other tasks

- Configuration of Asian learning language (API + BO)

## TODOs

- Vérifier que langue découverte est que dans un sens (LL1 -> LL2)
  - On peut donc avoir LL1 -> LL2 en découverte sans l'inverse
