import { Button, Input, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import { Create, useTranslate, useCreate, useNotify, useRedirect } from 'react-admin';
import TranslationForm from '../../components/TranslationForm';
import Translation from '../../entities/Translation';

const CreateReportCategory = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const redirect = useRedirect();
    const notify = useNotify();
    const [name, setName] = useState<string>();
    const [translations, setTranslations] = useState<{ index: number; item: Translation }[]>([]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const payload = {
            name,
            translations: translations
                .map((translation) => translation.item)
                .filter((translation) => translation.content && translation.language),
        };
        try {
            return await create(
                'reports/categories',
                { data: payload },
                {
                    onSettled: (data: any, error: Error) => {
                        if (!error) {
                            return redirect('/reports/categories');
                        }

                        return notify('report_categories.create.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('report_categories.create.error');
        }
    };

    return (
        <Create title={translate('report_categories.create.title')}>
            <Box component="form" onSubmit={handleSubmit} sx={{ m: 4 }} noValidate>
                <Typography variant="subtitle1">{translate('report_categories.create.name')}</Typography>

                <Box alignItems="center" display="flex" flexDirection="row">
                    <Input name="Language" sx={{ mx: 4, my: 2, width: 40 }} value="FR" />
                    <Input
                        name="Content"
                        onChange={(e) => setName(e.target.value)}
                        placeholder={translate('global.content')}
                        required
                    />
                </Box>

                <TranslationForm setTranslations={setTranslations} translations={translations} />
                <Button color="primary" sx={{ mt: 4 }} type="submit" variant="contained">
                    {translate('global.save')}
                </Button>
            </Box>
        </Create>
    );
};

export default CreateReportCategory;
