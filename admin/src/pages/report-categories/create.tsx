import { Button, Input, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import TranslationForm from '../../components/form/TranslationForm';
import IndexedTranslation from '../../entities/IndexedTranslation';
import indexedTranslationsToTranslations from '../../utils/indexedTranslationsToTranslations';

const CreateReportCategory = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();
    const [name, setName] = useState<string>();
    const [translations, setTranslations] = useState<IndexedTranslation[]>([]);

    const handleSubmit = async () => {
        const payload = {
            name,
            translations: indexedTranslationsToTranslations(translations),
        };
        try {
            const result = await create('reports/categories', { data: payload });
            redirect('/reports/categories');

            return result;
        } catch (err) {
            console.error(err);

            return notify('report_categories.create.error');
        }
    };

    return (
        <Create title={translate('report_categories.create.title')}>
            <Box component="form" sx={{ m: 4 }} noValidate>
                <Typography variant="subtitle1">{translate('report_categories.create.name')}</Typography>

                <Box alignItems="center" display="flex" flexDirection="row">
                    <Input name="Language" sx={{ mx: 4, my: 2, width: 40 }} value="FR" />
                    <Input
                        name="Content"
                        onChange={(e) => setName(e.target.value)}
                        placeholder={translate('global.content')}
                        sx={{ width: '80%' }}
                        required
                    />
                </Box>

                <TranslationForm setTranslations={setTranslations} translations={translations} />
                <Button color="primary" sx={{ mt: 4 }} onClick={() => handleSubmit()} variant="contained">
                    {translate('global.save')}
                </Button>
            </Box>
        </Create>
    );
};

export default CreateReportCategory;
