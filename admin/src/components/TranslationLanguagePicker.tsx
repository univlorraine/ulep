import { FormControl, Select, MenuItem } from '@mui/material';
import React from 'react';

interface TranslationLanguagePickerProps {
    onChange: (value: TranslatedLanguage) => void;
    value: TranslatedLanguage;
}

const TranslationLanguagePicker: React.FC<TranslationLanguagePickerProps> = ({ onChange, value }) => (
    <FormControl>
        <Select
            id="language-picker"
            onChange={(language) => onChange(language.target.value as TranslatedLanguage)}
            sx={{ mx: 4, my: 2, minWidth: 48 }}
            value={value}
            variant="standard"
            disableUnderline
        >
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="zh">ZH</MenuItem>
            <MenuItem value="de">DE</MenuItem>
            <MenuItem value="es">ES</MenuItem>
        </Select>
    </FormControl>
);

export default TranslationLanguagePicker;
