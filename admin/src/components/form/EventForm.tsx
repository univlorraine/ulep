import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    FormControlLabel,
    FormGroup,
    MenuItem,
    OutlinedInput,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import daysjs from 'dayjs';
import { RichTextInput } from 'ra-input-rich-text';
import React, { useEffect, useState } from 'react';
import { Button, Loading, TabbedForm, useGetIdentity, useGetList, useRecordContext, useTranslate } from 'react-admin';
import { EventFormPayload, EventObject, EventStatus, EventTranslation, EventType } from '../../entities/Event';
import University from '../../entities/University';
import customDataProvider from '../../providers/customDataProvider';
import i18nProvider from '../../providers/i18nProvider';
import ImageUploader from '../ImageUploader';
import useGetUniversitiesLanguages from './useGetUniversitiesLanguages';

interface EventFormProps {
    handleSubmit: (payload: EventFormPayload) => void;
}

const EventForm: React.FC<EventFormProps> = ({ handleSubmit }) => {
    const dataProvider = customDataProvider;
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const translate = useTranslate();
    const { data: universities, isLoading: isLoadingUniversities } = useGetList('universities', {
        sort: { field: 'name', order: 'ASC' },
    });
    const universitiesLanguages = useGetUniversitiesLanguages();

    const record: EventObject = useRecordContext();

    const [universityData, setUniversityData] = useState<University>(record?.authorUniversity || undefined);
    const [title, setTitle] = useState<string>(record?.title || '');
    const [content, setContent] = useState<string>(record?.content || '');
    const [image, setImage] = useState<File | undefined>(undefined);
    const [imageCredit, setImageCredit] = useState<string>(record?.imageCredit || '');
    const [status, setStatus] = useState<EventStatus>(record?.status || EventStatus.DRAFT);
    const [type, setType] = useState<EventType>(record?.type || EventType.ONLINE);
    const [withSubscription, setWithSubscription] = useState<boolean>(record?.withSubscription || false);
    const [eventURL, setEventURL] = useState<string>(record?.eventURL || '');
    const [address, setAddress] = useState<string>(record?.address || '');
    const [addressName, setAddressName] = useState<string>(record?.addressName || '');

    const [startDate, setStartDate] = useState<Date>(
        record?.startDate ? new Date(record.startDate) : new Date(new Date().setHours(0, 1, 0, 0))
    );
    const [endDate, setEndDate] = useState<Date>(
        record?.endDate ? new Date(record.endDate) : new Date(new Date().setHours(23, 59, 0, 0))
    );

    const authorUniversityId = record?.authorUniversity?.id ?? identity?.universityId;

    // Diffusion languages
    const [diffusionLanguages, setDiffusionLanguages] = useState<string[]>(
        record?.diffusionLanguages?.map((language) => language.code) || []
    );
    const [newDiffusionLanguage, setNewDiffusionLanguage] = useState<string>();

    // Translations
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>(record?.languageCode || 'en');
    const [newTranslationLanguage, setNewTranslationLanguage] = useState<string>('');
    const [translations, setTranslations] = useState<EventTranslation[]>(record?.translations || []);

    // Concerned universities
    const forcedConcernedUniversities: University[] = [];
    if (universities) {
        const centralUniversity = universities.filter((university: University) => university.parent === null)[0];
        forcedConcernedUniversities.push(centralUniversity);

        if (authorUniversityId !== centralUniversity.id) {
            forcedConcernedUniversities.push(
                universities.filter((university: University) => university.id === authorUniversityId)[0]
            );
        }
    }
    const [concernedUniversities, setConcernedUniversities] = useState<University[]>(
        record?.concernedUniversities ?? forcedConcernedUniversities
    );
    const [newConcernedUniversity, setNewConcernedUniversity] = useState<University>();

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
            type,
            withSubscription,
            authorUniversityId,
            startDate,
            endDate,
            image,
            imageCredit,
            eventURL: type === EventType.ONLINE ? eventURL : undefined,
            address: type === EventType.PRESENTIAL ? address : undefined,
            addressName: type === EventType.PRESENTIAL ? addressName : undefined,
            diffusionLanguages,
            concernedUniversities,
        });

    if (isLoadingIdentity || !identity || isLoadingUniversities) {
        return <Loading />;
    }

    const locale = i18nProvider.getLocale();

    return (
        <LocalizationProvider adapterLocale={locale} dateAdapter={AdapterDayjs}>
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
                        disabled={!newTranslationLanguage}
                        label={translate('events.form.add_translation')}
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
                    <TabbedForm.Tab
                        label={defaultLanguage}
                        sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                    >
                        {availableLanguages.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1">{translate('events.form.change_language')}</Typography>
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
                            <Typography variant="subtitle1">{translate('events.form.status')}</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    checked={status === EventStatus.READY}
                                    color="secondary"
                                    control={
                                        <Switch
                                            onChange={(event: any) =>
                                                setStatus(event.target.checked ? EventStatus.READY : EventStatus.DRAFT)
                                            }
                                        />
                                    }
                                    label={translate(`events.status.${EventStatus.READY}`)}
                                />
                            </FormGroup>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate('events.form.author')}</Typography>
                            <Typography>{universityData?.name}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                            <Box>
                                <Typography variant="subtitle1">
                                    {translate(`events.form.concerned_universities.label`)}
                                </Typography>
                                <Table>
                                    <TableBody>
                                        {concernedUniversities.map((university) => (
                                            <TableRow key={university.id}>
                                                <TableCell sx={{ width: '60px', padding: '0' }}>
                                                    {!forcedConcernedUniversities.some(
                                                        (forcedUniversity) => university.id === forcedUniversity.id
                                                    ) && (
                                                        <Button
                                                            onClick={() =>
                                                                setConcernedUniversities(
                                                                    concernedUniversities.filter(
                                                                        (concernedUniversity) =>
                                                                            university.id !== concernedUniversity.id
                                                                    )
                                                                )
                                                            }
                                                            sx={{ '& span': { margin: 0 } }}
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ padding: '10px' }}>{university.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginTop: '5px',
                                    }}
                                >
                                    <Select
                                        onChange={(e: any) => setNewConcernedUniversity(e.target.value as University)}
                                        sx={{ width: '300px' }}
                                        value={newConcernedUniversity}
                                    >
                                        {universities
                                            ?.filter(
                                                (university) =>
                                                    !concernedUniversities.some(
                                                        (concernedUniversity) =>
                                                            university.id === concernedUniversity.id
                                                    )
                                            )
                                            .map((university) => (
                                                <MenuItem key={university.id} value={university}>
                                                    {university.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    <Button
                                        color="primary"
                                        disabled={!newConcernedUniversity}
                                        onClick={() => {
                                            if (newConcernedUniversity) {
                                                setConcernedUniversities([
                                                    ...concernedUniversities,
                                                    newConcernedUniversity,
                                                ]);
                                                setNewConcernedUniversity(undefined);
                                            }
                                        }}
                                        sx={{ padding: '8px 30px' }}
                                        variant="contained"
                                    >
                                        <span> {translate('events.form.concerned_universities.button')}</span>
                                    </Button>
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1">
                                    {translate(`events.form.diffusion_languages.label`)}
                                </Typography>
                                <Table>
                                    <TableBody>
                                        {diffusionLanguages.map((language) => (
                                            <TableRow key={language}>
                                                <TableCell sx={{ width: 10, padding: '0' }}>
                                                    <Button
                                                        onClick={() =>
                                                            setDiffusionLanguages(
                                                                diffusionLanguages.filter(
                                                                    (diffusionLanguage) =>
                                                                        language !== diffusionLanguage
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </TableCell>
                                                <TableCell sx={{ padding: '10px' }}>{language}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginTop: '5px',
                                    }}
                                >
                                    <Select
                                        onChange={(e: any) => setNewDiffusionLanguage(e.target.value as string)}
                                        sx={{ width: '300px' }}
                                        value={newDiffusionLanguage}
                                    >
                                        {universitiesLanguages
                                            ?.filter((language) => !diffusionLanguages.includes(language))
                                            .map((language) => (
                                                <MenuItem key={language} value={language}>
                                                    {language}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    <Button
                                        color="primary"
                                        disabled={!newDiffusionLanguage}
                                        onClick={() => {
                                            if (newDiffusionLanguage) {
                                                setDiffusionLanguages([...diffusionLanguages, newDiffusionLanguage]);
                                                setNewDiffusionLanguage(undefined);
                                            }
                                        }}
                                        sx={{ padding: '8px 30px' }}
                                        variant="contained"
                                    >
                                        <span> {translate('events.form.diffusion_languages.button')}</span>
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

                        <Box display="flex" flexDirection="row" gap="50px">
                            <Box>
                                <Typography variant="subtitle1">{translate('events.form.type.label')}</Typography>
                                <Select onChange={(e: any) => setType(e.target.value as EventType)} value={type}>
                                    <MenuItem value={EventType.ONLINE}>{translate('events.form.type.online')}</MenuItem>
                                    <MenuItem value={EventType.PRESENTIAL}>
                                        {translate('events.form.type.presential')}
                                    </MenuItem>
                                </Select>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1">{translate('events.form.subscriptions')}</Typography>
                                <FormGroup>
                                    <FormControlLabel
                                        checked={withSubscription}
                                        color="secondary"
                                        control={
                                            <Switch
                                                onChange={(event: any) => setWithSubscription(event.target.checked)}
                                            />
                                        }
                                        label={translate(`events.form.with_subscriptions`)}
                                    />
                                </FormGroup>
                            </Box>
                        </Box>

                        {type === EventType.ONLINE && (
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle1">{translate('events.form.event_url')}</Typography>
                                <OutlinedInput
                                    name="eventURL"
                                    onChange={(e: any) => setEventURL(e.target.value)}
                                    type="text"
                                    value={eventURL}
                                    fullWidth
                                    required
                                />
                            </Box>
                        )}

                        {type === EventType.PRESENTIAL && (
                            <>
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="subtitle1">{translate('events.form.address_name')}</Typography>
                                    <OutlinedInput
                                        name="addressName"
                                        onChange={(e: any) => setAddressName(e.target.value)}
                                        type="text"
                                        value={addressName}
                                        fullWidth
                                        required
                                    />
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="subtitle1">{translate('events.form.address')}</Typography>
                                    <OutlinedInput
                                        name="address"
                                        onChange={(e: any) => setAddress(e.target.value)}
                                        type="text"
                                        value={address}
                                        fullWidth
                                        required
                                    />
                                </Box>
                            </>
                        )}

                        <Box display="flex" flexDirection="row" gap="50px">
                            <Box>
                                <Typography variant="subtitle1">{translate('events.form.start_date')}</Typography>
                                <DateTimePicker
                                    ampm={false}
                                    // @ts-ignore
                                    defaultValue={daysjs(startDate)}
                                    onChange={(value: Date | null) => {
                                        if (value) {
                                            setStartDate(value);
                                        }
                                    }}
                                    sx={{ my: 2, width: '100%' }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle1">{translate('events.form.end_date')}</Typography>
                                <DateTimePicker
                                    ampm={false}
                                    // @ts-ignore
                                    defaultValue={daysjs(endDate)}
                                    onChange={(value: Date | null) => {
                                        if (value) {
                                            setEndDate(value);
                                        }
                                    }}
                                    sx={{ my: 2, width: '100%' }}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate('events.form.illustration')}</Typography>
                            <ImageUploader onImageSelect={setImage} />
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{translate('events.form.image_credit')}</Typography>
                            <OutlinedInput
                                name="imageCredit"
                                onChange={(e: any) => setImageCredit(e.target.value)}
                                type="text"
                                value={imageCredit}
                                fullWidth
                                required
                            />
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{translate('events.form.title')}</Typography>
                            <OutlinedInput
                                name="Title"
                                onChange={(e: any) => setTitle(e.target.value)}
                                type="text"
                                value={title}
                                fullWidth
                                required
                            />
                        </Box>

                        <Box sx={{ width: '100%', '& .RaLabeled-label': { display: 'none' } }}>
                            <Typography variant="subtitle1">{translate('events.form.content')}</Typography>
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
                                        {translate('events.form.remove_translation')}
                                    </span>
                                </Button>
                            </Box>

                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle1">{translate('events.form.title')}</Typography>
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
                                <Typography variant="subtitle1">{translate('events.form.content')}</Typography>
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
                <Button
                    color="primary"
                    disabled={
                        !title ||
                        !content ||
                        !startDate ||
                        !endDate ||
                        diffusionLanguages?.length === 0 ||
                        (type === EventType.ONLINE && !eventURL) ||
                        (type === EventType.PRESENTIAL && (!address || !addressName))
                    }
                    onClick={onCreatePressed}
                    sx={{ mt: 4, width: '100%' }}
                    type="button"
                    variant="contained"
                >
                    <span>{record ? translate('events.update.cta') : translate('events.create.cta')}</span>
                </Button>
            </Box>
        </LocalizationProvider>
    );
};

export default EventForm;
