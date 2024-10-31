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
        if (initialValue !== undefined && languages) {
            onChange(languages.find((language: Language) => language.id === initialValue) || { id: 'none' });
        }
    }, [initialValue, languages]);

    if (isLoading || !languages || (value === undefined && initialValue)) {
        return null;
    }

    return (
        <FormControl>
            <Select
                onChange={(event) =>
                    onChange(
                        languages.find((newLanguage: Language) => event.target.value === newLanguage.id) || {
                            id: 'none',
                        }
                    )
                }
                renderValue={(languageId: string) => {
                    const newLanguage = languages.find((language: Language) => language.id === languageId);

                    return languageId !== 'none' && newLanguage
                        ? translate(`languages_code.${newLanguage.code}`)
                        : translate('language_picker.placeholder');
                }}
                sx={{ mb: 2, width: '100%' }}
                value={value?.id || 'none'}
                disableUnderline
                displayEmpty
            >
                <MenuItem value="none">{translate('language_picker.placeholder')}</MenuItem>
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
