import { Box, Typography, Input } from '@mui/material';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import Translation from '../../entities/Translation';
import QuizzLevelPicker from '../QuizzLevelPicker';
import TranslationForm from './TranslationForm';

interface QuestionFormProps {
    handleSubmit: (
        test: string,
        name: string,
        translations: { index: number; item: Translation; file?: File }[]
    ) => Promise<void>;
    name?: string;
    testId?: string;
    tranlsations?: { index: number; item: Translation }[];
}

const QuestionForm: React.FC<QuestionFormProps> = ({ handleSubmit, name, testId, tranlsations }) => {
    const translate = useTranslate();
    const [currentName, setCurrentName] = useState<string | undefined>(name || '');
    const [currentTest, setCurrentTest] = useState<string | undefined>(testId);
    const [currentTranslations, setCurrentTranslations] = useState<{ index: number; item: Translation }[]>(
        tranlsations ?? []
    );

    const sumbit = async () => {
        if (!currentTest || !currentName) {
            return;
        }

        await handleSubmit(currentTest, currentName, currentTranslations);
    };

    return (
        <Box component="form" sx={{ m: 4, width: 300 }} noValidate>
            <Typography variant="subtitle1">{translate('questions.create.level')}</Typography>
            <QuizzLevelPicker onChange={setCurrentTest} value={currentTest} />
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
                disabled={!currentTest || !currentName}
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
