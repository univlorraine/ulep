import { Box, Typography, Input } from '@mui/material';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import MediaObject from '../../entities/MediaObject';
import Translation from '../../entities/Translation';
import ImageUploader from '../ImageUploader';
import TranslationForm from './TranslationForm';

interface ObjectiveFormProps {
    handleSubmit: (
        name: string,
        translations: { index: number; item: Translation; file?: File }[],
        file?: File
    ) => Promise<void>;
    name?: string;
    image?: MediaObject;
    tranlsations?: { index: number; item: Translation }[];
}

const ObjectiveForm: React.FC<ObjectiveFormProps> = ({ handleSubmit, name, image, tranlsations }) => {
    const translate = useTranslate();
    const [currentName, setCurrentName] = useState<string | undefined>(name);
    const [file, setFile] = useState<File>();
    const [currentTranslations, setCurrentTranslations] = useState<{ index: number; item: Translation }[]>(
        tranlsations ?? []
    );

    const sumbit = async () => {
        if (!currentName) {
            return;
        }

        await handleSubmit(currentName, currentTranslations, file);
    };

    return (
        <Box component="form" sx={{ m: 4, width: 300 }} noValidate>
            <Typography variant="subtitle1">{translate('objectives.create.name')}</Typography>

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
            <Typography sx={{ mt: 4 }} variant="subtitle1">
                {translate('objectives.create.image')}
            </Typography>
            <ImageUploader image={image} onImageSelect={setFile} />
            <Box sx={{ mt: 4 }}>
                <TranslationForm setTranslations={setCurrentTranslations} translations={currentTranslations} />
            </Box>
            <Button
                color="primary"
                disabled={!currentName}
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

export default ObjectiveForm;
