import { Box, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';
import React, { useEffect, useState } from 'react';
import { Button, Loading, TabbedForm, useGetIdentity, useGetList } from 'react-admin';
import University from '../../entities/University';

// const toChoices = (items: string[]) => items.map((item) => ({ id: item, name: item }));

interface NewsFormProps {
    handleSubmit: () => void;
}

type Translation = {
    languageCode: string;
    title: string;
    content: string;
};

const NewsForm: React.FC<NewsFormProps> = ({ handleSubmit }) => {
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const [universitiesLanguages, setUniversitiesLanguages] = useState<string[]>([]);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>('en');
    const [newTranslationLanguage, setNewTranslationLanguage] = useState<string>('');
    const [translations, setTranslations] = useState<Translation[]>([]);
    const { data: universitiesData } = useGetList<University>('universities');

    useEffect(() => {
        if (universitiesData) {
            const languages = new Set<string>(['en']);
            universitiesData.forEach((university: University) => {
                languages.add(university.nativeLanguage.code);
                if (university.specificLanguagesAvailable) {
                    university.specificLanguagesAvailable.forEach((specificLanguage) => {
                        languages.add(specificLanguage.code);
                    });
                }
            });
            setUniversitiesLanguages(Array.from(languages));
        }
    }, [universitiesData]);

    useEffect(() => {
        const filteredAvailableLanguages = universitiesLanguages.filter(
            (language) =>
                !translations.some((translation) => translation.languageCode === language) &&
                language !== defaultLanguage
        );
        setAvailableLanguages(filteredAvailableLanguages);
    }, [universitiesLanguages, translations, defaultLanguage]);

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    console.log({ translations });
    console.log({ availableLanguages });

    return (
        <Box
            sx={{
                m: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                '& .MuiToolbar-root': { display: 'none' },
                '& .MuiDivider-root': { display: 'none' },
            }}
        >
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Select onChange={(e) => setNewTranslationLanguage(e.target.value as string)}>
                    {availableLanguages.map((language) => (
                        <MenuItem key={language} value={language}>
                            {language}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    label="Ajouter une traduction"
                    onClick={() =>
                        setTranslations([
                            ...translations,
                            { languageCode: newTranslationLanguage, title: '', content: '' },
                        ])
                    }
                    variant="contained"
                />
            </Box>

            <TabbedForm>
                <TabbedForm.Tab label={defaultLanguage} sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {availableLanguages.length > 0 && (
                        <Box>
                            <Typography variant="subtitle1">Change language</Typography>
                            <Select
                                onChange={(e: any) => {
                                    setDefaultLanguage(e.target.value as string);
                                }}
                                value={defaultLanguage}
                            >
                                {availableLanguages.map((language) => (
                                    <MenuItem key={language} value={language}>
                                        {language}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    )}

                    <Box>
                        <Typography variant="subtitle1">Title</Typography>
                        <Box alignItems="center" display="flex" flexDirection="row">
                            <OutlinedInput
                                name="Title"
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                type="text"
                                value={title}
                                required
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">Content</Typography>
                        <RichTextInput
                            defaultValue={content}
                            onChange={(e) => setContent(e)}
                            source={defaultLanguage}
                        />
                    </Box>
                </TabbedForm.Tab>

                {translations.map((translation) => (
                    <TabbedForm.Tab
                        key={translation.languageCode}
                        label={translation.languageCode}
                        sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
                    >
                        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => {
                                    const filteredTranslation = translations.filter(
                                        (originalTranslation) =>
                                            translation.languageCode !== originalTranslation.languageCode
                                    );
                                    setTranslations(filteredTranslation);
                                }}
                            >
                                <span>REMOVE TRANSLATION</span>
                            </Button>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">Title</Typography>
                            <Box alignItems="center" display="flex" flexDirection="row">
                                <OutlinedInput
                                    name="Title"
                                    onChange={(e) => {
                                        const filteredTranslation = translations.filter(
                                            (originalTranslation) =>
                                                translation.languageCode !== originalTranslation.languageCode
                                        );
                                        setTranslations([
                                            ...filteredTranslation,
                                            {
                                                languageCode: translation.languageCode,
                                                title: e.target.value,
                                                content: translation.content,
                                            },
                                        ]);
                                    }}
                                    placeholder="Title"
                                    type="text"
                                    value={translation.title}
                                    required
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">Content</Typography>
                            <RichTextInput
                                onChange={(e) => {
                                    const filteredTranslation = translations.filter(
                                        (originalTranslation) =>
                                            translation.languageCode !== originalTranslation.languageCode
                                    );
                                    setTranslations([
                                        ...filteredTranslation,
                                        {
                                            languageCode: translation.languageCode,
                                            title: translation.title,
                                            content: e,
                                        },
                                    ]);
                                }}
                                source={translation.languageCode}
                            />
                        </Box>
                    </TabbedForm.Tab>
                ))}
            </TabbedForm>

            <Button
                color="primary"
                disabled={false}
                onClick={handleSubmit}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>CREATE</span>
            </Button>
        </Box>
    );
};

export default NewsForm;
