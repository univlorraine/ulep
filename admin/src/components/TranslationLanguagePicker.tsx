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
            sx={{ mx: 4, my: 2 }}
            value={value}
            variant="standard"
        >
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="zh">ZH</MenuItem>
        </Select>
    </FormControl>
);

export default TranslationLanguagePicker;
