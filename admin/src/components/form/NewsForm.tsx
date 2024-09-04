import { Box, Checkbox, FormControlLabel, FormGroup, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';
import React, { useEffect, useState } from 'react';
import { Button, Loading, TabbedForm, useGetIdentity, useGetList, useTranslate } from 'react-admin';
import { NewsFormPayload, NewsStatus } from '../../entities/News';
import University from '../../entities/University';
import customDataProvider from '../../providers/customDataProvider';
import ImageUploader from '../ImageUploader';

// const toChoices = (items: string[]) => items.map((item) => ({ id: item, name: item }));

interface NewsFormProps {
    handleSubmit: (payload: NewsFormPayload) => void;
}

type Translation = {
    languageCode: string;
    title: string;
    content: string;
};

const NewsForm: React.FC<NewsFormProps> = ({ handleSubmit }) => {
    const dataProvider = customDataProvider;
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const translate = useTranslate();

    const [universityData, setUniversityData] = useState<University>();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<File | undefined>(undefined);
    const [status, setStatus] = useState<NewsStatus>(NewsStatus.DRAFT);
    const [universitiesLanguages, setUniversitiesLanguages] = useState<string[]>([]);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>('en');
    const [newTranslationLanguage, setNewTranslationLanguage] = useState<string>('');
    const [translations, setTranslations] = useState<Translation[]>([]);
    const { data: universitiesData } = useGetList<University>('universities');

    useEffect(() => {
        async function fetchUniversityData(universityId: string) {
            const result = await dataProvider.getOne('universities', {
                id: universityId,
            });
            if (result.data) {
                setUniversityData(result.data);
                setDefaultLanguage(result.data.nativeLanguage.code);
            }
        }
        if (identity) {
            fetchUniversityData(identity.universityId);
        }
    }, [identity]);

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

    const onCreatePressed = () =>
        handleSubmit({
            title,
            content,
            languageCode: defaultLanguage,
            translations,
            status,
            universityId: identity?.universityId,
            image,
        });

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                '& .MuiToolbar-root': { display: 'none' },
                '& .MuiDivider-root': { display: 'none' },
            }}
        >
            <Box sx={{ display: 'flex', gap: 1, marginBottom: '20px' }}>
                <Select
                    onChange={(e: any) => setNewTranslationLanguage(e.target.value as string)}
                    sx={{ width: '200px' }}
                    value={newTranslationLanguage}
                >
                    {availableLanguages.map((language) => (
                        <MenuItem key={language} value={language}>
                            {language}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    label="Ajouter une traduction"
                    onClick={() => {
                        if (newTranslationLanguage) {
                            setTranslations([
                                ...translations,
                                { languageCode: newTranslationLanguage, title: '', content: '' },
                            ]);
                            setNewTranslationLanguage('');
                        }
                    }}
                    variant="contained"
                />
            </Box>

            <TabbedForm>
                <TabbedForm.Tab label={defaultLanguage} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {availableLanguages.length > 0 && (
                        <Box>
                            <Typography variant="subtitle1">{translate('news.change_language')}</Typography>
                            <Select
                                onChange={(e: any) => {
                                    setDefaultLanguage(e.target.value as string);
                                }}
                                sx={{ width: '200px' }}
                                value=""
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
                        <Typography variant="subtitle1">{translate('news.author')}</Typography>
                        <Typography>{universityData?.name}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate('news.status.label')}</Typography>
                        <FormGroup>
                            <FormControlLabel
                                checked={status === NewsStatus.PUBLISHED}
                                control={
                                    <Checkbox
                                        onChange={(event: any) =>
                                            setStatus(event.target.checked ? NewsStatus.PUBLISHED : NewsStatus.DRAFT)
                                        }
                                    />
                                }
                                label={translate('news.status.published')}
                            />
                        </FormGroup>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate('news.illustration')}</Typography>
                        <ImageUploader onImageSelect={setImage} source="image.id" />
                    </Box>

                    <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle1">Title</Typography>
                        <OutlinedInput
                            name="Title"
                            onChange={(e: any) => setTitle(e.target.value)}
                            placeholder="Title"
                            type="text"
                            value={title}
                            fullWidth
                            required
                        />
                    </Box>

                    <Box sx={{ width: '100%', '& .RaLabeled-label': { display: 'none' } }}>
                        <Typography variant="subtitle1">Content</Typography>
                        <RichTextInput
                            defaultValue={content}
                            onChange={(e: any) => setContent(e)}
                            source={defaultLanguage}
                            fullWidth
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
                                variant="outlined"
                            >
                                <span style={{ fontSize: '0.9rem' }}>{translate('news.remove_translation')}</span>
                            </Button>
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">Title</Typography>
                            <Box alignItems="center" display="flex" flexDirection="row">
                                <OutlinedInput
                                    name="Title"
                                    onChange={(e: any) => {
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

                        <Box sx={{ width: '100%', '& .RaLabeled-label': { display: 'none' } }}>
                            <Typography variant="subtitle1">Content</Typography>
                            <RichTextInput
                                onChange={(e: any) => {
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
                                fullWidth
                            />
                        </Box>
                    </TabbedForm.Tab>
                ))}
            </TabbedForm>
            <Button
                color="primary"
                disabled={false}
                onClick={onCreatePressed}
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
