import { Box, Typography, Input } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import TranslationForm from './TranslationForm';

interface InterestFormProps {
    handleSubmit: (name: string, translations: IndexedTranslation[]) => void;
    name?: string;
    tradKey: string;
    translations?: IndexedTranslation[];
}

const InterestForm: React.FC<InterestFormProps> = ({ handleSubmit, name, translations, tradKey = 'interests' }) => {
    const translate = useTranslate();
    const [newName, setNewName] = useState<string>(name || '');
    const [newTranslations, setNewTranslations] = useState<IndexedTranslation[]>(translations || []);

    useEffect(() => {
        setNewName(name || '');
        setNewTranslations(translations || []);
    }, [name, translations]);

    return (
        <Box component="form" sx={{ m: 4 }} noValidate>
            <Typography variant="subtitle1">{translate(`${tradKey}.create.name`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input name="Language" sx={{ mx: 4, my: 2, width: 40 }} value="FR" />
                <Input
                    name="Content"
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={translate('global.content')}
                    sx={{ width: '80%' }}
                    value={newName}
                    required
                />
            </Box>

            <TranslationForm setTranslations={setNewTranslations} translations={newTranslations} />
            <Button
                color="primary"
                onClick={() => handleSubmit(newName, newTranslations)}
                sx={{ mt: 4 }}
                variant="contained"
            >
                <>{translate('global.save')}</>
            </Button>
        </Box>
    );
};

export default InterestForm;
