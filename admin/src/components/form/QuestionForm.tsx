import { Box, Typography, Input } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import Translation from '../../entities/Translation';
import QuizzLevelPicker from '../QuizzLevelPicker';
import TranslationForm from './TranslationForm';

interface QuestionFormProps {
    handleSubmit: (
        level: string,
        name: string,
        translations: { index: number; item: Translation; file?: File }[]
    ) => Promise<void>;
    name?: string;
    level?: string;
    tranlsations?: { index: number; item: Translation }[];
}

const QuestionForm: React.FC<QuestionFormProps> = ({ handleSubmit, name, level, tranlsations }) => {
    const translate = useTranslate();
    const [currentName, setCurrentName] = useState<string | undefined>(name || '');
    const [currentLevel, setCurrentLevel] = useState<string | undefined>(level || '');
    const [currentTranslations, setCurrentTranslations] = useState<{ index: number; item: Translation }[]>(
        tranlsations ?? []
    );

    useEffect(() => {
        setCurrentName(name || '');
        setCurrentLevel(level || '');
        setCurrentTranslations(tranlsations ?? []);
    }, [name, level, tranlsations]);

    const sumbit = async () => {
        if (!currentLevel || !currentName) {
            return;
        }

        await handleSubmit(currentLevel, currentName, currentTranslations);
    };

    return (
        <Box component="form" sx={{ m: 4, width: 300 }} noValidate>
            <Typography variant="subtitle1">{translate('questions.create.level')}</Typography>
            <QuizzLevelPicker onChange={setCurrentLevel} value={currentLevel} />
            <Typography variant="subtitle1">{translate('questions.create.name')}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input name="Language" sx={{ mx: 4, my: 2, width: 40 }} value="FR" />
                <Input
                    name="Content"
                    onChange={(e) => setCurrentName(e.target.value)}
                    placeholder={translate('global.content')}
                    value={currentName}
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
