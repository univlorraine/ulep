import { Button, Input, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import ImageUploader from '../../components/ImageUploader';
import TranslationForm from '../../components/TranslationForm';
import Translation from '../../entities/Translation';

const CreateObjectives = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();
    const [name, setName] = useState<string>();
    const [file, setFile] = useState<File>();
    const [translations, setTranslations] = useState<{ index: number; item: Translation }[]>([]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name || '');
        if (file) {
            formData.append('file', file);
        }

        translations
            .map((translation) => translation.item)
            .filter((translation) => translation.content && translation.language)
            .forEach((translation, index) => {
                formData.append(`translations[${index}][content]`, translation.content);
                formData.append(`translations[${index}][language]`, translation.language);
            });
        try {
            return await create(
                'objectives',
                { data: formData },
                {
                    onSettled: (data: any, error: Error) => {
                        if (!error) {
                            return redirect('/objectives');
                        }

                        return notify('objectives.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('objectives.create.error');
        }
    };

    return (
        <Create title={translate('objectives.create.title')}>
            <Box component="form" onSubmit={handleSubmit} sx={{ m: 4, width: 300 }} noValidate>
                <Typography variant="subtitle1">{translate('objectives.create.name')}</Typography>

                <Box alignItems="center" display="flex" flexDirection="row">
                    <Input name="Language" sx={{ mx: 4, my: 2, width: 40 }} value="FR" />
                    <Input
                        name="Content"
                        onChange={(e) => setName(e.target.value)}
                        placeholder={translate('global.content')}
                        required
                    />
                </Box>
                <Typography sx={{ mt: 4 }} variant="subtitle1">
                    {translate('objectives.create.image')}
                </Typography>
                <ImageUploader onImageSelect={setFile} />
                <Box sx={{ mt: 4 }}>
                    <TranslationForm setTranslations={setTranslations} translations={translations} />
                </Box>
                <Button
                    color="primary"
                    disabled={!file && !name}
                    sx={{ mt: 4, width: 300 }}
                    type="submit"
                    variant="contained"
                >
                    <span>{translate('global.save')}</span>
                </Button>
            </Box>
        </Create>
    );
};

export default CreateObjectives;
