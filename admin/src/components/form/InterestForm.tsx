import { Box, Typography, Input } from '@mui/material';
import { Button } from 'react-admin';
import TranslationForm from './TranslationForm';
import React, { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';

interface InterestFormProps {
    handleSubmit: (name: string, translations: IndexedTranslation[]) => void;
    name?: string;
    tradKey: string;
    translations?: IndexedTranslation[];
}

const InterestForm: React.FC<InterestFormProps> = ({ handleSubmit, name, translations, tradKey = 'interests' }) => {
    const translate = useTranslate();
    const [newName, setName] = useState<string>(name || '');
    const [newTranslations, setTranslations] = useState<IndexedTranslation[]>(translations || []);

    useEffect(() => {
        setName(name || '');
        setTranslations(translations || []);
    }, [name, translations]);

    return (
        <Box component="form" sx={{ m: 4 }} noValidate>
            <Typography variant="subtitle1">{translate(`${tradKey}.create.name`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input name="Language" sx={{ mx: 4, my: 2, width: 40 }} value="FR" />
                <Input
                    name="Content"
                    onChange={(e) => setName(e.target.value)}
                    placeholder={translate('global.content')}
                    sx={{ width: '80%' }}
                    value={newName}
                    required
                />
            </Box>

            <TranslationForm setTranslations={setTranslations} translations={newTranslations} />
            <Button
                color="primary"
                sx={{ mt: 4 }}
                onClick={() => handleSubmit(newName, newTranslations)}
                variant="contained"
            >
                <>{translate('global.save')}</>
            </Button>
        </Box>
    );
};

export default InterestForm;
