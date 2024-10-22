import { FormControl, MenuItem, Select } from '@mui/material';
import React, { useEffect } from 'react';
import { useGetList, useTranslate } from 'react-admin';
import Language from '../entities/Language';

interface LanguagePickerProps {
    onChange: (value: Language) => void;
    value?: Language;
    initialValue?: string;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ onChange, value, initialValue }) => {
    const { data: languages, isLoading } = useGetList('languages', {
        pagination: { page: 1, perPage: 250 },
        sort: { field: 'code', order: 'ASC' },
    });
    const translate = useTranslate();

    useEffect(() => {
        if (initialValue && languages) {
            onChange(languages.find((language: Language) => language.id === initialValue));
        }
    }, [initialValue, languages]);

    if (isLoading || !languages || (!value && initialValue)) {
        return <div />;
    }

    return (
        <FormControl>
            <Select
                id="language-picker"
                onChange={(event) =>
                    onChange(languages.find((newLanguage: Language) => event.target.value === newLanguage.id))
                }
                renderValue={(languageId: string) => {
                    const newLanguage = languages.find((language: Language) => language.id === languageId);

                    return languageId
                        ? translate(`languages_code.${newLanguage.code}`)
                        : translate('language_picker.placeholder');
                }}
                sx={{ mb: 2, width: '100%' }}
                value={value?.id || undefined}
                disableUnderline
                displayEmpty
            >
                <MenuItem value={undefined}>{translate('language_picker.placeholder')}</MenuItem>
                {languages.map((language: Language) => (
                    <MenuItem key={language.id} value={language.id}>
                        {translate(`languages_code.${language.code}`)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LanguagePicker;
