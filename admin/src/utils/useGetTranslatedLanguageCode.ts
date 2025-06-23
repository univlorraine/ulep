import { useCallback } from 'react';
import { useTranslate } from 'react-admin';

const useGetTranslatedLanguageCode = () => {
    const translate = useTranslate();

    const translateLanguageCode = useCallback(
        (languageCode: string) => translate(`languages_code.${languageCode}`),
        [translate]
    );

    return translateLanguageCode;
};

export default useGetTranslatedLanguageCode;
