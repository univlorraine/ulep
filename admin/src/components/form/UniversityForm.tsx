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
    Button,
    FormControl,
    MenuItem,
    OutlinedInput,
    Select,
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
import React, { useState } from 'react';
import { Form, useNotify, useTranslate } from 'react-admin';
import Administrator from '../../entities/Administrator';
import Country from '../../entities/Country';
import Language from '../../entities/Language';
import { PairingMode } from '../../entities/University';
import i18nProvider from '../../providers/i18nProvider';
import isCodeValid from '../../utils/isCodeValid';
import isUrlValid from '../../utils/isUrlValid';
import AdministratorPicker from '../AdministratorPicker';
import CountriesPicker from '../CountriesPicker';
import ReferenceUploadFileField from '../field/ReferenceUploadFileField';
import FileUploader from '../FileUploader';
import ImageUploader from '../ImageUploader';
import LanguagePicker from '../LanguagePicker';
import LanguagesPicker from '../LanguagesPicker';
import TimezonePicker from '../TimezonePicker';

interface UniversityFormProps {
    admissionEndDate?: string;
    admissionStartDate?: string;
    canAddNewLanguages: boolean;
    closeServiceDate?: string;
    codes?: string[];
    country?: Country;
    defaultContact?: Administrator;
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
        defaultContact?: Administrator,
        file?: File,
        certificateFile?: File
    ) => void;
    maxTandemsPerUser?: number;
    name?: string;
    nativeLanguage?: Language;
    notificationEmail?: string;
    openServiceDate?: string;
    pairingMode?: string;
    specificLanguagesAvailable?: Language[];
    timezone?: string;
    tradKey?: string;
    universityId?: string;
    website?: string;
}

const styles = { my: 2, width: '100%' };

interface PairingModeOption {
    value: PairingMode;
    label: string;
}

const UniversityForm: React.FC<UniversityFormProps> = ({
    admissionEndDate,
    admissionStartDate,
    canAddNewLanguages,
    openServiceDate,
    closeServiceDate,
    codes,
    country,
    defaultContact,
    domains,
    handleSubmit,
    name,
    tradKey = 'create',
    timezone,
    nativeLanguage,
    website,
    pairingMode,
    maxTandemsPerUser,
    notificationEmail,
    specificLanguagesAvailable,
    universityId,
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
    const [newDefaultContact, setNewDefaultContact] = useState<Administrator | undefined>(defaultContact);
    const [file, setFile] = useState<File>();
    const [newCertificateFile, setNewCertificateFile] = useState<File>();
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
            newDefaultContact,
            file,
            newCertificateFile
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
                <Box display="flex" flexDirection="row" gap="50px" sx={{ m: 4 }}>
                    <Box flex="1" sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Box>
                            <Typography variant="subtitle1">{translate(`universities.${tradKey}.logo`)}</Typography>
                            <ImageUploader onImageSelect={setFile} source="logo.id" />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate(`universities.${tradKey}.name`)}</Typography>
                            <OutlinedInput
                                name="Name"
                                onChange={(e) => setNewName(e.target.value)}
                                value={newName}
                                required
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate(`universities.${tradKey}.country`)}</Typography>
                            <CountriesPicker onChange={setNewCountry} value={newCountry} />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate(`universities.${tradKey}.language`)}</Typography>
                            <LanguagePicker onChange={setNewNativeLanguage} value={newNativeLanguage} />
                        </Box>

                        {tradKey === 'update' && (
                            <Box>
                                <Typography variant="subtitle1">
                                    {translate(`universities.${tradKey}.defaultContact`)}
                                </Typography>
                                <AdministratorPicker
                                    onChange={setNewDefaultContact}
                                    universityId={universityId}
                                    value={newDefaultContact}
                                />
                            </Box>
                        )}

                        <Box>
                            <Typography variant="subtitle1">{translate(`universities.${tradKey}.timezone`)}</Typography>
                            <TimezonePicker onChange={setNewTimezone} value={newTimezone} />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`universities.${tradKey}.max_tandems_per_user`)}
                            </Typography>
                            <OutlinedInput
                                name="maxTandemsPerUser"
                                onChange={(e) => setNewMaxTandemsPerUser(parseInt(e.target.value, 10))}
                                type="number"
                                value={newMaxTandemsPerUser}
                                required
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate(`universities.${tradKey}.codes`)}</Typography>
                            <Table>
                                <TableBody>
                                    {newCodes.map((code) => (
                                        <TableRow key={code}>
                                            <TableCell sx={{ width: 10, padding: '0' }}>
                                                <Button onClick={() => removeCode(code)}>
                                                    <DeleteIcon />
                                                </Button>
                                            </TableCell>
                                            <TableCell sx={{ padding: '0' }}>{code}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                <OutlinedInput
                                    onChange={(e) => setNewCode(e.target.value)}
                                    placeholder="Ajouter un nouveau code"
                                    sx={styles}
                                    value={newCode}
                                />
                                <Button
                                    color="primary"
                                    disabled={!newCode}
                                    onClick={() => addCode(newCode)}
                                    sx={{ ...styles, height: '100%', width: '200px' }}
                                    variant="contained"
                                >
                                    {translate('universities.code_button')}
                                </Button>
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate(`universities.${tradKey}.domains`)}</Typography>
                            <Table>
                                <TableBody>
                                    {newDomains.map((domain) => (
                                        <TableRow key={domain}>
                                            <TableCell sx={{ width: 10, padding: '0' }}>
                                                <Button onClick={() => removeDomain(domain)}>
                                                    <DeleteIcon />
                                                </Button>
                                            </TableCell>
                                            <TableCell sx={{ padding: '0' }}>{domain}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                <OutlinedInput
                                    onChange={(e) => setNewDomain(e.target.value)}
                                    placeholder="Ajouter un nouveau domaine"
                                    sx={styles}
                                    value={newDomain}
                                />
                                <Button
                                    color="primary"
                                    disabled={!newDomain}
                                    onClick={() => addDomain(newDomain)}
                                    sx={{ ...styles, height: '100%', width: '200px' }}
                                    variant="contained"
                                >
                                    {translate('universities.domain_button')}
                                </Button>
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">{translate(`universities.${tradKey}.website`)}</Typography>
                            <Box alignItems="center" display="flex" flexDirection="row">
                                <OutlinedInput
                                    name="Website"
                                    onChange={(e) => setNewWebsite(e.target.value)}
                                    value={newWebsite}
                                    required
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`universities.${tradKey}.pairingMode`)}
                            </Typography>
                            <Box alignItems="center" display="flex" flexDirection="row">
                                <FormControl>
                                    <Select
                                        id="pairingMode-picker"
                                        onChange={(event) => {
                                            setNewPairingMode(event.target.value);
                                        }}
                                        sx={{ mb: 2, width: '100%' }}
                                        value={newPairingMode}
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
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`universities.${tradKey}.notificationEmail`)}
                            </Typography>
                            <Box alignItems="center" display="flex" flexDirection="row" sx={{ mb: 2 }}>
                                <OutlinedInput
                                    name="notificationEmail"
                                    onChange={(e) => setNewNotificationEmail(e.target.value)}
                                    value={newNotificationEmail}
                                    required
                                />
                            </Box>
                        </Box>

                        <Box>
                            {(newLanguages.length > 0 || canAddNewLanguages) && (
                                <Typography variant="subtitle1">
                                    {translate('universities.specific_language')}
                                </Typography>
                            )}
                            {canAddNewLanguages && (
                                <>
                                    <Table>
                                        <TableBody>
                                            {newLanguages.map((language) => (
                                                <TableRow key={language.code}>
                                                    <TableCell sx={{ width: 10, padding: '0' }}>
                                                        <Button onClick={() => removeLanguage(language)}>
                                                            <DeleteIcon />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell sx={{ padding: '0' }}>
                                                        {translate(`languages_code.${language.code}`)}
                                                    </TableCell>
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
                                            marginTop: '10px',
                                        }}
                                    >
                                        <LanguagesPicker
                                            onChange={addLanguage}
                                            value={newLanguages}
                                            hideGlobalLanguages
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`universities.create.defaultCertificateFile`)}
                            </Typography>
                            <FileUploader
                                accept="application/pdf"
                                fileType="PDF"
                                onFileSelect={setNewCertificateFile}
                                source="defaultCertificateFile.id"
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`universities.create.exampleDefaultCertificateFile`)}
                            </Typography>
                            <ReferenceUploadFileField source="exampleDefaultCertificateFile.id" />
                        </Box>
                    </Box>

                    <Box flex="1" sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`universities.${tradKey}.admission_start`)}
                            </Typography>
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
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`universities.${tradKey}.admission_end`)}
                            </Typography>
                            <Box alignItems="center" display="flex" flexDirection="row">
                                <DateTimePicker
                                    ampm={false}
                                    // @ts-ignore
                                    defaultValue={daysjs(admissionEndDate)}
                                    onChange={setNewAdmissionEndDate}
                                    sx={{ my: 2, width: '100%' }}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`universities.${tradKey}.open_service`)}
                            </Typography>
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
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">
                                {translate(`universities.${tradKey}.close_service`)}
                            </Typography>
                            <Box alignItems="center" display="flex" flexDirection="row">
                                <DateTimePicker
                                    ampm={false}
                                    // @ts-ignore
                                    defaultValue={daysjs(closeServiceDate)}
                                    onChange={setNewCloseServiceDate}
                                    sx={{ my: 2, width: '100%' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>

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
            </Form>
        </LocalizationProvider>
    );
};

export default UniversityForm;
