import { Typography, Box, OutlinedInput } from '@mui/material';
import React from 'react';
import { Button, useTranslate } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import Translation from '../../entities/Translation';
import TranslationLanguagePicker from '../TranslationLanguagePicker';

interface TranslationFormProps {
    setTranslations: (translations: IndexedTranslation[]) => void;
    translations: IndexedTranslation[];
}

const TranslationForm: React.FC<TranslationFormProps> = ({ setTranslations, translations }) => {
    const translate = useTranslate();

    const onTraductionLanguageAdded = (value: TranslatedLanguage, index: number) => {
        const currentTraductions = [...translations];
        currentTraductions[index].translation.language = value;
        setTranslations(currentTraductions);
    };

    const onTraductionContentAdded = (value: string, index: number) => {
        const currentTraductions = [...translations];
        currentTraductions[index].translation.content = value;
        setTranslations(currentTraductions);
    };

    return (
        <Box>
            <Typography variant="subtitle1">{translate('global.translations')}</Typography>
            {translations.map((item, index) => (
                <Box
                    key={item.index}
                    alignItems="center"
                    display="flex"
                    flexDirection="row"
                    gap="20px"
                    marginBottom="20px"
                >
                    <TranslationLanguagePicker
                        onChange={(value: TranslatedLanguage) => onTraductionLanguageAdded(value, index)}
                        value={translations[index].translation.language}
                    />
                    <OutlinedInput
                        name={`Content${item.index}`}
                        onChange={(e) => onTraductionContentAdded(e.target.value, index)}
                        placeholder={translate('global.content')}
                        value={translations[index].translation.content}
                    />
                </Box>
            ))}

            <Box alignContent="flex-start" display="flex" flexDirection="column" sx={{ width: 300 }}>
                <Button
                    onClick={() =>
                        setTranslations([
                            ...translations,
                            {
                                index: translations.length + 1,
                                translation: new Translation('', 'en'),
                            },
                        ])
                    }
                    type="button"
                    variant="outlined"
                >
                    <>{translate('global.new_translation')}</>
                </Button>
            </Box>
        </Box>
    );
};

export default TranslationForm;
