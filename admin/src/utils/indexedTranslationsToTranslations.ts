import IndexedTranslation from '../entities/IndexedTranslation';

const indexedTranslationsToTranslations = (indexedTranslations: IndexedTranslation[]) =>
    indexedTranslations
        .map((translation) => translation.translation)
        .filter((translation) => translation.content && translation.language);

export default indexedTranslationsToTranslations;
