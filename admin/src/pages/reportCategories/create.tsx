import { Button, Input, Typography, Box } from '@mui/material';
import React, { useState } from 'react';
import { Create, useTranslate, useCreate } from 'react-admin';
import Translation from '../../entities/Translation';

const CreateReportCategory = () => {
    const translate = useTranslate();
    const [create] = useCreate();
    const [name, setName] = useState<string>();
    const [translations, setTranslations] = useState<{index: number, item: Translation}[]>([]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const payload = { name,
            translations: translations.map((translation) => translation.item)
                .filter((translation) => translation.content && translation.language) };
        await create('reports/categories', { data: payload });

        // TODO: handle error and navigation
    };

    const onTraductionLanguageAdded = (value: string, index: number) => {
        const currentTraductions = [...translations];
        currentTraductions[index].item.language = value;
        setTranslations(currentTraductions);
    };

    const onTraductionContentAdded = (value: string, index: number) => {
        const currentTraductions = [...translations];
        currentTraductions[index].item.content = value;
        setTranslations(currentTraductions);
    };

    return (
        <Create title={translate('report_categories.create.title')}>
            <Box component="form" onSubmit={handleSubmit} sx={{ m: 4 }} noValidate>
                <Typography variant='subtitle1'>
                    {translate('report_categories.create.name')}
                </Typography>

                <Box alignItems="center" display="flex" flexDirection="row">
                    <Input name='Language' sx={{ mx: 4, my: 2, width: 30 }} value="FR" />
                    <Input
                        name='Content'
                        onChange={(e) => setName(e.target.value)}
                        placeholder={translate('report_categories.create.content')}
                        required
                    />
                </Box>

                <Typography variant='subtitle1'>
                    {translate('report_categories.create.translations')}
                </Typography>
                {translations.map((item, index) => (
                    <Box key={item.index} alignItems="center" display="flex" flexDirection="row">
                        <Input
                            inputProps={{ maxLength: 2 }}
                            name={`Language${item.index}`}
                            onChange={(e) => onTraductionLanguageAdded(e.target.value, index)}
                            placeholder='FR'
                            sx={{ mx: 4, my: 2, width: 30 }}
                            value={translations[index].item.language}
                        />
                        <Input
                            name={`Content${item.index}`}
                            onChange={(e) => onTraductionContentAdded(e.target.value, index)}
                            placeholder={translate('report_categories.create.content')}
                            value={translations[index].item.content}
                        />

                    </Box>
                ))}

                <Box alignContent="flex-start" display="flex" flexDirection="column" sx={{ width: 300 }}>
                    <Button
                        onClick={() => setTranslations([...translations,
                            { index: translations.length + 1, item: new Translation('', '') }])}
                        type="button"
                    >
                        {translate('report_categories.create.new_translation')}
                    </Button>

                    <Button color="primary" sx={{ mt: 4 }} type="submit" variant="contained">
                        {translate('report_categories.create.save')}
                    </Button>
                </Box>
            </Box>
        </Create>
    );
};

export default CreateReportCategory;
