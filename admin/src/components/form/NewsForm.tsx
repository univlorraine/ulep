import {
    Box,
    Divider,
    FormControlLabel,
    FormGroup,
    MenuItem,
    OutlinedInput,
    Select,
    Switch,
    Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import daysjs from 'dayjs';
import { RichTextInput } from 'ra-input-rich-text';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Form,
    Loading,
    TabbedForm,
    useGetIdentity,
    useNotify,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { News, NewsFormPayload, NewsStatus, NewsTranslation } from '../../entities/News';
import University from '../../entities/University';
import customDataProvider from '../../providers/customDataProvider';
import i18nProvider from '../../providers/i18nProvider';
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
    const notify = useNotify();

    const record: News = useRecordContext();

    const [universityData, setUniversityData] = useState<University>(record?.university || undefined);
    const [title, setTitle] = useState<string>(record?.title || '');
    const [content, setContent] = useState<string>(record?.content || '');
    const [image, setImage] = useState<File | undefined>(undefined);
    const [creditImage, setCreditImage] = useState<string>(record?.creditImage || '');
    const [status, setStatus] = useState<NewsStatus>(record?.status || NewsStatus.DRAFT);

    const [startPublicationDate, setStartPublicationDate] = useState<Date>(
        record?.startPublicationDate ? new Date(record.startPublicationDate) : new Date(new Date().setHours(0, 1, 0, 0))
    );
    const [endPublicationDate, setEndPublicationDate] = useState<Date>(
        record?.endPublicationDate ? new Date(record.endPublicationDate) : new Date(new Date().setHours(23, 59, 0, 0))
    );

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

    const onCreatePressed = () => {
        if (startPublicationDate && endPublicationDate && startPublicationDate > endPublicationDate) {
            notify('news.form.error.start_publication_date_greater_than_end_publication_date', {
                type: 'error',
            });
        } else {
            handleSubmit({
                id: record?.id,
                title,
                content,
                languageCode: defaultLanguage,
                translations,
                status,
                universityId: identity?.universityId,
                startPublicationDate,
                endPublicationDate,
                image,
                creditImage,
            });
        }
    };

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    const locale = i18nProvider.getLocale();

    return (
        <Form>
            <LocalizationProvider adapterLocale={locale} dateAdapter={AdapterDayjs}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        '& .MuiToolbar-root': { display: 'none' },
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Box>
                            <Typography variant="subtitle1">{translate('news.status.label')}</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    checked={status === NewsStatus.READY}
                                    control={
                                        <Switch
                                            onChange={(event: any) =>
                                                setStatus(event.target.checked ? NewsStatus.READY : NewsStatus.DRAFT)
                                            }
                                        />
                                    }
                                    label={translate(`news.status.${NewsStatus.READY}`)}
                                />
                            </FormGroup>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate('news.form.author')}</Typography>
                            <Typography>{universityData?.name}</Typography>
                        </Box>

                        <Box display="flex" flexDirection="row" gap="50px">
                            <Box>
                                <Typography variant="subtitle1">
                                    {translate('news.form.start_publication_date')}
                                </Typography>
                                <DateTimePicker
                                    ampm={false}
                                    // @ts-ignore
                                    defaultValue={daysjs(startPublicationDate)}
                                    onChange={(value: Date | null) => {
                                        if (value) {
                                            setStartPublicationDate(value);
                                        }
                                    }}
                                    sx={{ my: 2, width: '100%' }}
                                    views={['year', 'month', 'day']}
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle1">
                                    {translate('news.form.end_publication_date')}
                                </Typography>
                                <DateTimePicker
                                    ampm={false}
                                    // @ts-ignore
                                    defaultValue={daysjs(endPublicationDate)}
                                    onChange={(value: Date | null) => {
                                        if (value) {
                                            setEndPublicationDate(value);
                                        }
                                    }}
                                    sx={{ my: 2, width: '100%' }}
                                    views={['year', 'month', 'day']}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate('news.form.illustration')}</Typography>
                            <ImageUploader onImageSelect={setImage} />
                        </Box>

                        {(image || record?.imageURL) && (
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle1">{translate('news.form.credit_image')}</Typography>
                                <OutlinedInput
                                    name="creditImage"
                                    onChange={(e: any) => setCreditImage(e.target.value)}
                                    placeholder="Credit image"
                                    type="text"
                                    value={creditImage}
                                    fullWidth
                                />
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ margin: '40px 0' }} />

                    <Box sx={{ display: 'flex', gap: 1, marginBottom: '20px', marginLeft: 'auto' }}>
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
                            disabled={!newTranslationLanguage}
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

                    <Box sx={{ '& .MuiDivider-root': { display: 'none' } }}>
                        <TabbedForm>
                            <TabbedForm.Tab
                                label={defaultLanguage}
                                sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                            >
                                {availableLanguages.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {translate('news.form.change_language')}
                                        </Typography>
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

                            {translations?.map((translation, index) => (
                                <TabbedForm.Tab
                                    key={translation.languageCode}
                                    label={translation.languageCode}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
                                >
                                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                                        <Button
                                            onClick={() => {
                                                const filteredTranslations = translations?.filter(
                                                    (originalTranslation) =>
                                                        translation.languageCode !== originalTranslation.languageCode
                                                );
                                                setTranslations(filteredTranslations);
                                            }}
                                            variant="outlined"
                                        >
                                            <span style={{ fontSize: '0.9rem' }}>
                                                {translate('news.form.remove_translation')}
                                            </span>
                                        </Button>
                                    </Box>

                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="subtitle1">{translate('news.form.title')}</Typography>
                                        <Box alignItems="center" display="flex" flexDirection="row">
                                            <OutlinedInput
                                                name="Title"
                                                onChange={(e: any) => {
                                                    const newTranslations = [...translations];
                                                    newTranslations[index].title = e.target.value;
                                                    setTranslations(newTranslations);
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
                                                const newTranslations = [...translations];
                                                const newTranslation = {
                                                    languageCode: translation.languageCode,
                                                    title: translation.title,
                                                    content: e,
                                                };
                                                newTranslations[index] = newTranslation;

                                                setTranslations(newTranslations);
                                            }}
                                            source={translation.languageCode}
                                            fullWidth
                                        />
                                    </Box>
                                </TabbedForm.Tab>
                            ))}
                        </TabbedForm>
                    </Box>

                    <Button
                        color="primary"
                        disabled={!title || !content || !startPublicationDate || !endPublicationDate}
                        onClick={onCreatePressed}
                        sx={{ mt: 4, width: '100%' }}
                        type="button"
                        variant="contained"
                    >
                        <span>{record ? translate('news.update.cta') : translate('news.create.cta')}</span>
                    </Button>
                </Box>
            </LocalizationProvider>
        </Form>
    );
};

export default NewsForm;
