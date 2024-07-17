import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useGetList, useTranslate } from 'react-admin';
import Language from '../entities/Language';

interface LanguagesPickerProps {
    hideGlobalLanguages?: boolean;
    onChange: (value: Language) => void;
    value?: Language[];
}

const LanguagesPicker: React.FC<LanguagesPickerProps> = ({ hideGlobalLanguages, onChange, value }) => {
    const { data, isLoading } = useGetList('languages', {
        pagination: { page: 1, perPage: 250 },
        sort: { field: 'code', order: 'ASC' },
    });
    const translate = useTranslate();

    if (isLoading || !data) {
        return <div />;
    }

    const filteredLanguages = data.filter((language: Language) => {
        // Check if the language is already in the value
        if (value?.find((l) => l.code === language.code)) {
            return false;
        }
        // If hideGlobalLanguages is true, exclude languages where mainUniversityStatus or secondaryUniversityActive is true
        if (hideGlobalLanguages && language.secondaryUniversityActive) {
            return false;
        }

        return true;
    });

    return (
        <FormControl>
            <Select
                defaultValue={filteredLanguages[0]}
                id="languages-picker"
                onChange={(language) =>
                    onChange(filteredLanguages.find((c: Language) => language.target.value === c.id))
                }
                renderValue={() => translate('languages_picker.placeholder')}
                sx={{ mb: 2, width: '100%' }}
                disableUnderline
            >
                {filteredLanguages.map((language: Language) => (
                    <MenuItem key={language.id} value={language.id}>
                        {translate(`languages_code.${language.code}`)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LanguagesPicker;
