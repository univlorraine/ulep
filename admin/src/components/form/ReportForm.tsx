import { Box, Typography, Input } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import inputStyle from '../../theme/inputStyle';
import TranslationForm from './TranslationForm';

interface ReportFormProps {
    handleSubmit: (name: string, translations: IndexedTranslation[]) => void;
    name?: string;
    tradKey: string;
    translations?: IndexedTranslation[];
}

const ReportForm: React.FC<ReportFormProps> = ({ handleSubmit, name, translations, tradKey = 'create' }) => {
    const translate = useTranslate();
    const [newName, setNewName] = useState<string>(name || '');
    const [newTranslations, setNewTranslations] = useState<IndexedTranslation[]>(translations || []);

    useEffect(() => {
        setNewName(name || '');
        setNewTranslations(translations || []);
    }, [name, translations]);

    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate(`report_categories.${tradKey}.name`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input name="Language" sx={{ mx: 4, my: 2, width: 40 }} value="FR" disableUnderline />
                <Input
                    name="Content"
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={translate('global.content')}
                    sx={inputStyle}
                    value={newName}
                    disableUnderline
                    required
                />
            </Box>

            <TranslationForm setTranslations={setNewTranslations} translations={newTranslations} />
            <Button
                color="primary"
                onClick={() => handleSubmit(newName, newTranslations)}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default ReportForm;
