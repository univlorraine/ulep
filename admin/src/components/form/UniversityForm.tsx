import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Typography,
    Input,
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
    FormControl,
    Select,
    MenuItem,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import daysjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslate, useNotify, Form } from 'react-admin';
import Country from '../../entities/Country';
import Language from '../../entities/Language';
import MediaObject from '../../entities/MediaObject';
import { PairingMode } from '../../entities/University';
import i18nProvider from '../../providers/i18nProvider';
import inputStyle from '../../theme/inputStyle';
import isCodeValid from '../../utils/isCodeValid';
import isUrlValid from '../../utils/isUrlValid';
import CountriesPicker from '../CountriesPicker';
import ImageUploader from '../ImageUploader';
import LanguagePicker from '../LanguagePicker';
import LanguagesPicker from '../LanguagesPicker';
import TimezonePicker from '../TimezonePicker';

interface UniversityFormProps {
    admissionEndDate?: string;
    admissionStartDate?: string;
    openServiceDate?: string;
    closeServiceDate?: string;
    codes?: string[];
    country?: Country;
    domains?: string[];
    handleSubmit: (
        name: string,
        country: Country,
        timezone: string,
        admissionStart: Date,
        admissionEnd: Date,
        openService: Date,
        closeService: Date,
        codes: string[],
        domains: string[],
        pairingMode: string,
        maxTandemsPerUser: number,
        nativeLanguage: Language,
        website?: string,
        notificationEmail?: string,
        specificLanguagesAvailable?: Language[],
        file?: File
    ) => void;
    canAddNewLanguages: boolean;
    image?: MediaObject;
    name?: string;
    timezone?: string;
    tradKey?: string;
    nativeLanguage?: Language;
    website?: string;
    pairingMode?: string;
    maxTandemsPerUser?: number;
    notificationEmail?: string;
    specificLanguagesAvailable?: Language[];
}

const styles = { my: 2, width: '100%' };

interface PairingModeOption {
    value: PairingMode;
    label: string;
}

// TODO: refactor this component on back-office refactor
const UniversityForm: React.FC<UniversityFormProps> = ({
    admissionEndDate,
    admissionStartDate,
    canAddNewLanguages,
    openServiceDate,
    closeServiceDate,
    codes,
    country,
    domains,
    handleSubmit,
    image,
    name,
    tradKey = 'create',
    timezone,
    nativeLanguage,
    website,
    pairingMode,
    maxTandemsPerUser,
    notificationEmail,
    specificLanguagesAvailable,
}) => {
    const translate = useTranslate();
    const notify = useNotify();

    const [newName, setNewName] = useState<string>(name || '');
    const [newCountry, setNewCountry] = useState<Country | undefined>(country || undefined);
    const [newTimezone, setNewTimezone] = useState<string | undefined>(timezone || '');
    const [newAdmissionStartDate, setNewAdmissionStartDate] = useState<Date | null>(
        !admissionStartDate ? new Date() : new Date(admissionStartDate)
    );
    const [newAdmissionEndDate, setNewAdmissionEndDate] = useState<Date | null>(
        !admissionEndDate ? new Date() : new Date(admissionEndDate)
    );
    const [newOpenServiceDate, setNewOpenServiceDate] = useState<Date | null>(
        !openServiceDate ? new Date() : new Date(openServiceDate)
    );
    const [newCloseServiceDate, setNewCloseServiceDate] = useState<Date | null>(
        !closeServiceDate ? new Date() : new Date(closeServiceDate)
    );
    const [newWebsite, setNewWebsite] = useState<string>(website || '');
    const [newCode, setNewCode] = useState<string>('');
    const [newCodes, setNewCodes] = useState<string[]>(codes || []);
    const [newDomain, setNewDomain] = useState<string>('');
    const [newDomains, setNewDomains] = useState<string[]>(domains || []);
    const [newPairingMode, setNewPairingMode] = useState<string>(pairingMode || 'MANUAL');
    const [newMaxTandemsPerUser, setNewMaxTandemsPerUser] = useState<number>(maxTandemsPerUser || 1);
    const [newNotificationEmail, setNewNotificationEmail] = useState<string>(notificationEmail || '');
    const [newNativeLanguage, setNewNativeLanguage] = useState<Language | undefined>(nativeLanguage);
    const [newLanguages, setNewLanguages] = useState<Language[]>(specificLanguagesAvailable || []);
    const [file, setFile] = useState<File>();

    const addLanguage = (language: Language) => setNewLanguages([...newLanguages, language]);

    const removeLanguage = (languageToRemove: Language) => {
        setNewLanguages(newLanguages.filter((language) => language.code !== languageToRemove.code));
    };

    const addCode = (code: string) => {
        if (!isCodeValid(code)) {
            return notify(`universities.${tradKey}.codes_error`);
        }
        setNewCode('');

        return setNewCodes([...newCodes, code]);
    };

    const removeCode = (codeToRemove: string) => {
        setNewCodes(newCodes.filter((code) => code !== codeToRemove));
    };

    const addDomain = (domain: string) => {
        if (domain[0] !== '@') {
            return notify(`universities.${tradKey}.domains_error`);
        }

        setNewDomain('');

        return setNewDomains([...newDomains, domain]);
    };

    const removeDomain = (domainToRemove: string) => {
        setNewDomains(newDomains.filter((domain) => domain !== domainToRemove));
    };

    const onSendUniversity = () => {
        const admissionStart = newAdmissionStartDate || (admissionStartDate ? new Date(admissionStartDate) : undefined);
        const admissionEnd = newAdmissionEndDate || (admissionEndDate ? new Date(admissionEndDate) : undefined);
        const openService = newOpenServiceDate || (openServiceDate ? new Date(openServiceDate) : undefined);
        const closeService = newCloseServiceDate || (closeServiceDate ? new Date(closeServiceDate) : undefined);

        if (
            !newCountry ||
            !newTimezone ||
            !newName ||
            !admissionStart ||
            !admissionEnd ||
            !openService ||
            !closeService ||
            !newWebsite ||
            !newNativeLanguage
        ) {
            return undefined;
        }

        if (admissionEnd <= admissionStart) {
            return notify(`universities.${tradKey}.admission_error`);
        }

        if (closeService <= openService) {
            return notify(`universities.${tradKey}.open_service_error`);
        }

        if (openService > admissionStart || closeService < admissionEnd) {
            return notify(`universities.${tradKey}.service_dont_include_admission_date`);
        }

        if (newMaxTandemsPerUser < 1 || newMaxTandemsPerUser > 3) {
            return notify(`universities.${tradKey}.max_tandems_per_user_error`);
        }

        if (!isUrlValid(newWebsite)) {
            return notify(`universities.${tradKey}.url_error`);
        }

        return handleSubmit(
            newName,
            newCountry,
            newTimezone,
            admissionStart,
            admissionEnd,
            openService,
            closeService,
            newCodes,
            newDomains,
            newPairingMode,
            newMaxTandemsPerUser,
            newNativeLanguage,
            newWebsite,
            newNotificationEmail,
            newLanguages,
            file
        );
    };

    const pairingModeOptions: PairingModeOption[] = [
        {
            value: PairingMode.MANUAL,
            label: translate(`universities.pairing_mode.manual`),
        },
        {
            value: PairingMode.SEMI_AUTOMATIC,
            label: translate(`universities.pairing_mode.semi_automatic`),
        },
        {
            value: PairingMode.AUTOMATIC,
            label: translate(`universities.pairing_mode.automatic`),
        },
    ];

    const locale = i18nProvider.getLocale();

    return (
        <LocalizationProvider adapterLocale={locale} dateAdapter={AdapterDayjs}>
            <Form>
                <Box display="flex" flexDirection="column" sx={{ m: 4 }}>
                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.logo`)}</Typography>
                    <ImageUploader image={image} onImageSelect={setFile} />
                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.name`)}</Typography>

                    <Box alignItems="center" display="flex" flexDirection="row" sx={{ mb: 2 }}>
                        <Input
                            name="Name"
                            onChange={(e) => setNewName(e.target.value)}
                            sx={inputStyle}
                            value={newName}
                            disableUnderline
                            required
                        />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.country`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <CountriesPicker onChange={setNewCountry} value={newCountry} />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.language`)}</Typography>
                    <Typography>
                        {newNativeLanguage && translate(`languages_code.${newNativeLanguage.code}`)}
                    </Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <LanguagePicker onChange={setNewNativeLanguage} />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.timezone`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <TimezonePicker onChange={setNewTimezone} value={newTimezone} />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.admission_start`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <DateTimePicker
                            ampm={false}
                            // @ts-ignore
                            defaultValue={daysjs(admissionStartDate)}
                            onChange={setNewAdmissionStartDate}
                            sx={{ my: 2, width: '100%' }}
                            disableUnderline
                        />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.admission_end`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <DateTimePicker
                            ampm={false}
                            // @ts-ignore
                            defaultValue={daysjs(admissionEndDate)}
                            onChange={setNewAdmissionEndDate}
                            sx={{ my: 2, width: '100%' }}
                        />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.open_service`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <DateTimePicker
                            ampm={false}
                            // @ts-ignore
                            defaultValue={daysjs(openServiceDate)}
                            onChange={setNewOpenServiceDate}
                            sx={{ my: 2, width: '100%' }}
                            disableUnderline
                        />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.close_service`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <DateTimePicker
                            ampm={false}
                            // @ts-ignore
                            defaultValue={daysjs(closeServiceDate)}
                            onChange={setNewCloseServiceDate}
                            sx={{ my: 2, width: '100%' }}
                        />
                    </Box>

                    <Typography variant="subtitle1">
                        {translate(`universities.${tradKey}.max_tandems_per_user`)}
                    </Typography>
                    <Box alignItems="center" display="flex" flexDirection="row" sx={{ mb: 2 }}>
                        <Input
                            name="maxTandemsPerUser"
                            onChange={(e) => setNewMaxTandemsPerUser(parseInt(e.target.value, 10))}
                            sx={inputStyle}
                            type="number"
                            value={newMaxTandemsPerUser}
                            disableUnderline
                            required
                        />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.codes`)}</Typography>
                    <Table>
                        <TableBody>
                            {newCodes.map((code) => (
                                <TableRow key={code}>
                                    <TableCell sx={{ width: 10 }}>
                                        <Button onClick={() => removeCode(code)}>
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                    <TableCell>{code}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box alignItems="center" display="flex" flexDirection="column">
                        <Input
                            onChange={(e) => setNewCode(e.target.value)}
                            placeholder="Ajouter un nouveau code"
                            sx={styles}
                            value={newCode}
                        />
                        <Button
                            color="primary"
                            disabled={!newCode}
                            onClick={() => addCode(newCode)}
                            sx={{ ...styles, height: 30 }}
                            variant="contained"
                        >
                            {translate('universities.code_button')}
                        </Button>
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.domains`)}</Typography>
                    <Table>
                        <TableBody>
                            {newDomains.map((domain) => (
                                <TableRow key={domain}>
                                    <TableCell sx={{ width: 10 }}>
                                        <Button onClick={() => removeDomain(domain)}>
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                    <TableCell>{domain}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Box alignItems="center" display="flex" flexDirection="column">
                        <Input
                            onChange={(e) => setNewDomain(e.target.value)}
                            placeholder="Ajouter un nouveau domaine"
                            sx={styles}
                            value={newDomain}
                        />
                        <Button
                            color="primary"
                            disabled={!newDomain}
                            onClick={() => addDomain(newDomain)}
                            sx={{ ...styles, height: 30 }}
                            variant="contained"
                        >
                            {translate('universities.domain_button')}
                        </Button>
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.website`)}</Typography>

                    <Box alignItems="center" display="flex" flexDirection="row">
                        <Input
                            name="Website"
                            onChange={(e) => setNewWebsite(e.target.value)}
                            sx={inputStyle}
                            value={newWebsite}
                            disableUnderline
                            required
                        />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.pairingMode`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <FormControl>
                            <Select
                                id="pairingMode-picker"
                                onChange={(event) => {
                                    setNewPairingMode(event.target.value);
                                }}
                                sx={{ mb: 2, width: '100%' }}
                                value={newPairingMode}
                                variant="standard"
                                disableUnderline
                            >
                                {pairingModeOptions.map((pairingModeOption: PairingModeOption) => (
                                    <MenuItem key={pairingModeOption.value} value={pairingModeOption.value}>
                                        {pairingModeOption.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Typography variant="subtitle1">
                        {translate(`universities.${tradKey}.notificationEmail`)}
                    </Typography>
                    <Box alignItems="center" display="flex" flexDirection="row" sx={{ mb: 2 }}>
                        <Input
                            name="notificationEmail"
                            onChange={(e) => setNewNotificationEmail(e.target.value)}
                            sx={inputStyle}
                            value={newNotificationEmail}
                            disableUnderline
                            required
                        />
                    </Box>

                    {newLanguages.length > 0 && (
                        <Typography variant="subtitle1">{translate('universities.specific_language')}</Typography>
                    )}
                    {canAddNewLanguages && (
                        <>
                            <Table>
                                <TableBody>
                                    {newLanguages.map((language) => (
                                        <TableRow key={language.code}>
                                            <TableCell sx={{ width: 10 }}>
                                                <Button onClick={() => removeLanguage(language)}>
                                                    <DeleteIcon />
                                                </Button>
                                            </TableCell>
                                            <TableCell>{translate(`languages_code.${language.code}`)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box alignItems="center" display="flex" flexDirection="row">
                                <LanguagesPicker onChange={addLanguage} value={newLanguages} hideGlobalLanguages />
                            </Box>
                        </>
                    )}
                    <Button
                        color="primary"
                        disabled={
                            !newNativeLanguage ||
                            !newCountry ||
                            !newTimezone ||
                            !newName ||
                            (!newAdmissionStartDate && !admissionStartDate) ||
                            (!newAdmissionEndDate && !admissionEndDate) ||
                            !newWebsite
                        }
                        onClick={onSendUniversity}
                        sx={styles}
                        variant="contained"
                    >
                        {translate('global.save')}
                    </Button>
                </Box>
            </Form>
        </LocalizationProvider>
    );
};

export default UniversityForm;
