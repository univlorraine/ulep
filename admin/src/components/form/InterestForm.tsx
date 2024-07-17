import { Box, Typography, Input } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import TranslationForm from './TranslationForm';

interface InterestFormProps {
    handleSubmit: (name: string, translations: IndexedTranslation[]) => void;
    name?: string;
    tradKey: string;
    tradModeKey: string;
    translations?: IndexedTranslation[];
}

const InterestForm: React.FC<InterestFormProps> = ({
    handleSubmit,
    name,
    translations,
    tradKey = 'interests',
    tradModeKey = 'create',
}) => {
    const translate = useTranslate();
    const [newName, setNewName] = useState<string>(name || '');
    const [newTranslations, setNewTranslations] = useState<IndexedTranslation[]>(translations || []);

    useEffect(() => {
        setNewName(name || '');
        setNewTranslations(translations || []);
    }, [name, translations]);

    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate(`${tradKey}.${tradModeKey}.name`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input name="Language" sx={{ mx: 4, my: 2, width: '80px' }} value="FR" disableUnderline />
                <Input
                    name="Content"
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={translate('global.content')}
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

export default InterestForm;
