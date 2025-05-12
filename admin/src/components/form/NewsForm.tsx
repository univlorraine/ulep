/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Divider,
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
import { Button, Loading, TabbedForm, useGetIdentity, useNotify, useRecordContext, useTranslate } from 'react-admin';
import { News, NewsFormPayload, NewsStatus, NewsTranslation } from '../../entities/News';
import University from '../../entities/University';
import customDataProvider from '../../providers/customDataProvider';
import i18nProvider from '../../providers/i18nProvider';
import ImageUploader from '../ImageUploader';
import useGetUniversitiesLanguages from './useGetUniversitiesLanguages';

const ALL_OPTION = 'all';

const getFirstAvailableUniversity = (availableUniversities: University[], concernedUniversities: University[]) =>
    availableUniversities.filter(
        (availableUniversity) =>
            !concernedUniversities.some((concernedUniversity) => availableUniversity.id === concernedUniversity.id)
    )[0];

interface NewsFormProps {
    handleSubmit: (payload: NewsFormPayload) => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ handleSubmit }) => {
    const dataProvider = customDataProvider;
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const translate = useTranslate();
    const { universitiesLanguages, universitiesData } = useGetUniversitiesLanguages();
    const notify = useNotify();

    const record: News | undefined = useRecordContext();

    const [centralUniversity, setCentralUniversity] = useState<University>();
    const [authorUniversity, setAuthorUniversity] = useState<University>();

    const [universityData, setUniversityData] = useState<University | undefined>(record?.university || undefined);
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

    // Translations
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>(record?.languageCode || 'en');
    const [newTranslationLanguage, setNewTranslationLanguage] = useState<string>('');
    const [translations, setTranslations] = useState<NewsTranslation[]>(record?.translations || []);

    // Concerned universities
    const [forcedConcernedUniversities, setForcedConcernedUniversities] = useState<University[]>([]);
    const [concernedUniversities, setConcernedUniversities] = useState<University[]>(
        record?.concernedUniversities ?? []
    );
    const [newConcernedUniversity, setNewConcernedUniversity] = useState<University | string>();
    const [availableConcernedUniversities, setAvailableConcernedUniversities] = useState<University[]>([]);

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
                !translations?.some((translation) => translation?.languageCode === language.code) &&
                language.code !== defaultLanguage
        );
        setAvailableLanguages(filteredAvailableLanguages.map((language) => language.code));
    }, [universitiesLanguages, translations, defaultLanguage]);

    useEffect(() => {
        if (!universitiesData) return;

        setCentralUniversity(universitiesData.filter((university: University) => university.parent === null)[0]);
        const authorUniversityId = record?.university?.id ?? identity?.universityId;
        setAuthorUniversity(universitiesData.find((university: University) => university.id === authorUniversityId));
    }, [universitiesData, record, identity]);

    useEffect(() => {
        if (!universitiesData || !centralUniversity || !authorUniversity) return;

        const authorIsFromCentralUniversity = centralUniversity.id === authorUniversity.id;

        let concernedUniversitiesValues = record?.concernedUniversities ?? [];
        if (!authorIsFromCentralUniversity) {
            setForcedConcernedUniversities([authorUniversity]);
            concernedUniversitiesValues = record?.concernedUniversities ?? [authorUniversity];
        }
        setConcernedUniversities(concernedUniversitiesValues);

        const possibleConcernedUniversities = authorIsFromCentralUniversity ? universitiesData : [centralUniversity];
        setAvailableConcernedUniversities(possibleConcernedUniversities);
        const proposedConcernedUniversity = getFirstAvailableUniversity(
            possibleConcernedUniversities,
            concernedUniversities
        );
        setNewConcernedUniversity(proposedConcernedUniversity || undefined);
    }, [universitiesData, centralUniversity, authorUniversity]);

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
                concernedUniversities,
            });
        }
    };

    if (isLoadingIdentity || !identity || !universitiesData) {
        return <Loading />;
    }

    const locale = i18nProvider.getLocale();

    return (
        <div>
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
                                    sx={{ width: 'fit-content' }}
                                />
                            </FormGroup>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate('news.form.author')}</Typography>
                            <Typography>{universityData?.name}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`news.form.concerned_universities.label`)} *
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
                                                        onClick={() => {
                                                            const newConcernedUniversities =
                                                                concernedUniversities.filter(
                                                                    (concernedUniversity) =>
                                                                        university.id !== concernedUniversity.id
                                                                );
                                                            setConcernedUniversities(newConcernedUniversities);
                                                            const proposedConcernedUniversity =
                                                                getFirstAvailableUniversity(
                                                                    availableConcernedUniversities,
                                                                    newConcernedUniversities
                                                                );
                                                            setNewConcernedUniversity(
                                                                proposedConcernedUniversity || undefined
                                                            );
                                                        }}
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
                            {newConcernedUniversity && (
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
                                        onChange={(e: any) => {
                                            setNewConcernedUniversity(e.target.value as University);
                                        }}
                                        sx={{ width: '300px' }}
                                        value={newConcernedUniversity}
                                    >
                                        {centralUniversity?.id === authorUniversity?.id &&
                                            availableConcernedUniversities.length !== concernedUniversities.length && (
                                                <MenuItem value={ALL_OPTION}>
                                                    {translate('news.form.concerned_universities.all')}
                                                </MenuItem>
                                            )}
                                        {availableConcernedUniversities
                                            ?.filter(
                                                (university) =>
                                                    !concernedUniversities.some(
                                                        (concernedUniversity) =>
                                                            university.id === concernedUniversity.id
                                                    )
                                            )
                                            .map((university: any) => (
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
                                                let newConcernedUniversities = [
                                                    ...concernedUniversities,
                                                    newConcernedUniversity as University,
                                                ];
                                                if (newConcernedUniversity === ALL_OPTION) {
                                                    newConcernedUniversities = availableConcernedUniversities;
                                                }
                                                setConcernedUniversities(newConcernedUniversities);
                                                const proposedConcernedUniversity = getFirstAvailableUniversity(
                                                    availableConcernedUniversities,
                                                    newConcernedUniversities
                                                );
                                                setNewConcernedUniversity(proposedConcernedUniversity || undefined);
                                            }
                                        }}
                                        sx={{ padding: '8px 30px' }}
                                        variant="contained"
                                    >
                                        <span> {translate('news.form.concerned_universities.button')}</span>
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Box display="flex" flexDirection="row" gap="50px">
                            <Box>
                                <Typography variant="subtitle1">
                                    {translate('news.form.start_publication_date')} *
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
                                    {translate('news.form.end_publication_date')} *
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
                                    <Typography variant="subtitle1">{translate('news.form.title')} *</Typography>
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
                                    <Typography variant="subtitle1">{translate('news.form.content')} *</Typography>
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
                                        <Typography variant="subtitle1">{translate('news.form.content')} *</Typography>
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

                    <Typography sx={{ marginTop: '20px', fontStyle: 'italic' }}>
                        {translate('news.form.mandatory')}
                    </Typography>

                    <Button
                        color="primary"
                        disabled={
                            !title ||
                            !content ||
                            !startPublicationDate ||
                            !endPublicationDate ||
                            concernedUniversities?.length === 0
                        }
                        onClick={onCreatePressed}
                        sx={{ mt: 4, width: '100%' }}
                        type="button"
                        variant="contained"
                    >
                        <span>{record ? translate('news.update.cta') : translate('news.create.cta')}</span>
                    </Button>
                </Box>
            </LocalizationProvider>
        </div>
    );
};

export default NewsForm;
