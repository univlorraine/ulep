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

## Other tasks

- Configuration of Asian learning language (API + BO)

## TODOs

- Vérifier que langue découverte est que dans un sens (LL1 -> LL2)
  - On peut donc avoir LL1 -> LL2 en découverte sans l'inverse
