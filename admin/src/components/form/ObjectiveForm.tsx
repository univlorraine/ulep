import { Box, Typography, OutlinedInput } from '@mui/material';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import IndexedTranslation from '../../entities/IndexedTranslation';
import ImageUploader from '../ImageUploader';
import TranslationForm from './TranslationForm';

interface ObjectiveFormProps {
    handleSubmit: (name: string, translations: IndexedTranslation[], file?: File) => Promise<void>;
    name?: string;
    tranlsations?: IndexedTranslation[];
}

const ObjectiveForm: React.FC<ObjectiveFormProps> = ({ handleSubmit, name, tranlsations }) => {
    const translate = useTranslate();
    const [currentName, setCurrentName] = useState<string | undefined>(name || '');
    const [file, setFile] = useState<File>();
    const [currentTranslations, setCurrentTranslations] = useState<IndexedTranslation[]>(tranlsations ?? []);

    const sumbit = async () => {
        if (!currentName) {
            return;
        }

        await handleSubmit(currentName, currentTranslations, file);
    };

    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate('objectives.create.name')}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row" gap="10px">
                <OutlinedInput name="Language" sx={{ width: '80px' }} value="FR" />
                <OutlinedInput
                    name="Content"
                    onChange={(e) => setCurrentName(e.target.value)}
                    placeholder={translate('global.content')}
                    value={currentName}
                    required
                />
            </Box>
            <Typography sx={{ mt: 4 }} variant="subtitle1">
                {translate('objectives.create.image')}
            </Typography>
            <ImageUploader onImageSelect={setFile} source="image.id" />
            <Box sx={{ mt: 4 }}>
                <TranslationForm setTranslations={setCurrentTranslations} translations={currentTranslations} />
            </Box>
            <Button
                color="primary"
                disabled={!currentName}
                onClick={sumbit}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default ObjectiveForm;
