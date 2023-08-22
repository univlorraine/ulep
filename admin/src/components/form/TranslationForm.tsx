import { Typography, Box, Input } from '@mui/material';
import React from 'react';
import { Button, useTranslate } from 'react-admin';
import Translation from '../../entities/Translation';
import TranslationLanguagePicker from '../TranslationLanguagePicker';

interface TranslationFormProps {
    setTranslations: (translations: { index: number; item: Translation }[]) => void;
    translations: { index: number; item: Translation }[];
}

const TranslationForm: React.FC<TranslationFormProps> = ({ setTranslations, translations }) => {
    const translate = useTranslate();

    const onTraductionLanguageAdded = (value: TranslatedLanguage, index: number) => {
        const currentTraductions = [...translations];
        currentTraductions[index].item.language = value;
        setTranslations(currentTraductions);
    };

    const onTraductionContentAdded = (value: string, index: number) => {
        const currentTraductions = [...translations];
        currentTraductions[index].item.content = value;
        setTranslations(currentTraductions);
    };

    return (
        <div>
            <Typography variant="subtitle1">{translate('global.translations')}</Typography>
            {translations.map((item, index) => (
                <Box key={item.index} alignItems="center" display="flex" flexDirection="row">
                    <TranslationLanguagePicker
                        onChange={(value: TranslatedLanguage) => onTraductionLanguageAdded(value, index)}
                        value={translations[index].item.language}
                    />
                    <Input
                        name={`Content${item.index}`}
                        onChange={(e) => onTraductionContentAdded(e.target.value, index)}
                        placeholder={translate('global.content')}
                        value={translations[index].item.content}
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
                                item: new Translation('', 'en'),
                            },
                        ])
                    }
                    type="button"
                >
                    <>{translate('global.new_translation')}</>
                </Button>
            </Box>
        </div>
    );
};

export default TranslationForm;
