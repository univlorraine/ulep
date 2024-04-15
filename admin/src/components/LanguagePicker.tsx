import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useGetList, useTranslate } from 'react-admin';
import Language from '../entities/Language';

interface LanguagePickerProps {
    onChange: (value: Language) => void;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ onChange }) => {
    const { data: languages, isLoading } = useGetList('languages', {
        pagination: { page: 1, perPage: 250 },
        sort: { field: 'code', order: 'ASC' },
    });
    const translate = useTranslate();

    if (isLoading || !languages) {
        return <div />;
    }

    return (
        <FormControl>
            <Select
                defaultValue={languages[0]}
                id="language-picker"
                onChange={(language) => onChange(languages.find((c: Language) => language.target.value === c.id))}
                renderValue={() => translate('language_picker.placeholder')}
                sx={{ mb: 2, width: '100%' }}
                variant="standard"
                disableUnderline
            >
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
