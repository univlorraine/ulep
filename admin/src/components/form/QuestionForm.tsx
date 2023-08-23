import { Box, Typography, Input } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import QuizzLevelPicker from '../QuizzLevelPicker';
import TranslationForm from './TranslationForm';

interface QuestionFormProps {
    handleSubmit: (level: string, name: string, translations: IndexedTranslation[]) => Promise<void>;
    name?: string;
    level?: string;
    translations?: IndexedTranslation[];
}

const QuestionForm: React.FC<QuestionFormProps> = ({ handleSubmit, name, level, translations }) => {
    const translate = useTranslate();
    const [currentName, setCurrentName] = useState<string | undefined>(name || '');
    const [currentLevel, setCurrentLevel] = useState<string | undefined>(level || '');
    const [currentTranslations, setCurrentTranslations] = useState<IndexedTranslation[]>(translations ?? []);

    useEffect(() => {
        setCurrentName(name || '');
        setCurrentLevel(level || '');
        setCurrentTranslations(translations ?? []);
    }, [name, level, translations]);

    const sumbit = async () => {
        if (!currentLevel || !currentName) {
            return;
        }

        await handleSubmit(currentLevel, currentName, currentTranslations);
    };

    return (
        <Box component="form" sx={{ m: 4 }} noValidate>
            <Typography variant="subtitle1">{translate('questions.create.level')}</Typography>
            <QuizzLevelPicker onChange={setCurrentLevel} value={currentLevel} />
            <Typography variant="subtitle1">{translate('questions.create.name')}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input name="Language" sx={{ mx: 4, my: 2, width: 40 }} value="FR" />
                <Input
                    name="Content"
                    onChange={(e) => setCurrentName(e.target.value)}
                    placeholder={translate('global.content')}
                    sx={{ width: '80%' }}
                    value={currentName}
                    multiline
                    required
                />
            </Box>
            <Box sx={{ mt: 4 }}>
                <TranslationForm setTranslations={setCurrentTranslations} translations={currentTranslations} />
            </Box>
            <Button
                color="primary"
                disabled={!currentLevel || !currentName}
                onClick={sumbit}
                sx={{ mt: 4, width: 300 }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default QuestionForm;
