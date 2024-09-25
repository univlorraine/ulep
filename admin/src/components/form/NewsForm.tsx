import { Box, Checkbox, FormControlLabel, FormGroup, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';
import React, { useEffect, useState } from 'react';
import { Button, Loading, TabbedForm, useGetIdentity, useRecordContext, useTranslate } from 'react-admin';
import { News, NewsFormPayload, NewsStatus, NewsTranslation } from '../../entities/News';
import University from '../../entities/University';
import customDataProvider from '../../providers/customDataProvider';
import ImageUploader from '../ImageUploader';
import useGetUniversitiesLanguages from './useGetUniversitiesLanguages';

interface NewsFormProps {
    handleSubmit: (payload: NewsFormPayload) => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ handleSubmit }) => {
    const dataProvider = customDataProvider;
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const translate = useTranslate();
    const universitiesLanguages = useGetUniversitiesLanguages();

    const record: News = useRecordContext();

    const [universityData, setUniversityData] = useState<University>(record?.university || undefined);
    const [title, setTitle] = useState<string>(record?.title || '');
    const [content, setContent] = useState<string>(record?.content || '');
    const [image, setImage] = useState<File | undefined>(undefined);
    const [status, setStatus] = useState<NewsStatus>(record?.status || NewsStatus.DRAFT);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>(record?.languageCode || 'en');
    const [newTranslationLanguage, setNewTranslationLanguage] = useState<string>('');
    const [translations, setTranslations] = useState<NewsTranslation[]>(record?.translations || []);

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

        if (!record && identity) {
            fetchUniversityData(identity.universityId);
        }
    }, [identity]);

    useEffect(() => {
        const filteredAvailableLanguages = universitiesLanguages.filter(
            (language) =>
                !translations?.some((translation) => translation?.languageCode === language) &&
                language !== defaultLanguage
        );
        setAvailableLanguages(filteredAvailableLanguages);
    }, [universitiesLanguages, translations, defaultLanguage]);

    const onCreatePressed = () =>
        handleSubmit({
            id: record?.id,
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
                    label={translate('news.form.add_translation')}
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
                            <Typography variant="subtitle1">{translate('news.form.change_language')}</Typography>
                            <Select
                                onChange={(e: any) => {
                                    setDefaultLanguage(e.target.value as string);
                                }}
                                sx={{ width: '200px' }}
                                value={defaultLanguage}
                            >
                                {availableLanguages.map((language) => (
                                    <MenuItem key={language} value={language}>
                                        {language}
                                    </MenuItem>
                                ))}
                                <MenuItem key={defaultLanguage} value={defaultLanguage}>
                                    {defaultLanguage}
                                </MenuItem>
                            </Select>
                        </Box>
                    )}

                    <Box>
                        <Typography variant="subtitle1">{translate('news.form.author')}</Typography>
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
                                label={translate(`news.status.${NewsStatus.PUBLISHED}`)}
                            />
                        </FormGroup>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate('news.form.illustration')}</Typography>
                        <ImageUploader onImageSelect={setImage} />
                    </Box>

                    <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle1">{translate('news.form.title')}</Typography>
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
                        <Typography variant="subtitle1">{translate('news.form.content')}</Typography>
                        <RichTextInput
                            defaultValue={content}
                            onChange={(e: any) => setContent(e)}
                            source={defaultLanguage}
                            fullWidth
                        />
                    </Box>
                </TabbedForm.Tab>

                {translations?.map((translation) => (
                    <TabbedForm.Tab
                        key={translation.languageCode}
                        label={translation.languageCode}
                        sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
                    >
                        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => {
                                    const filteredTranslation = translations?.filter(
                                        (originalTranslation) =>
                                            translation.languageCode !== originalTranslation.languageCode
                                    );
                                    setTranslations(filteredTranslation);
                                }}
                                variant="outlined"
                            >
                                <span style={{ fontSize: '0.9rem' }}>{translate('news.form.remove_translation')}</span>
                            </Button>
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{translate('news.form.title')}</Typography>
                            <Box alignItems="center" display="flex" flexDirection="row">
                                <OutlinedInput
                                    name="Title"
                                    onChange={(e: any) => {
                                        const filteredTranslation = translations?.filter(
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
                            <Typography variant="subtitle1">{translate('news.form.content')}</Typography>
                            <RichTextInput
                                defaultValue={translation.content || ''}
                                onChange={(e: any) => {
                                    const filteredTranslation = translations?.filter(
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
                <span>{record ? translate('news.update.cta') : translate('news.create.cta')}</span>
            </Button>
        </Box>
    );
};

export default NewsForm;
