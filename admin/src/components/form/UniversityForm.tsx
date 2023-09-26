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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import daysjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslate, useNotify, Form } from 'react-admin';
import Country from '../../entities/Country';
import { PairingMode } from '../../entities/University';
import inputStyle from '../../theme/inputStyle';
import isCodeValid from '../../utils/isCodeValid';
import CountriesPicker from '../CountriesPicker';
import TimezonePicker from '../TimezonePicker';

interface UniversityFormProps {
    admissionEndDate?: Date;
    admissionStartDate?: Date;
    codes?: string[];
    country?: Country;
    domains?: string[];
    handleSubmit: (
        name: string,
        country: Country,
        timezone: string,
        admissionStart: Date,
        admissionEnd: Date,
        codes: string[],
        domains: string[],
        pairingMode: string,
        website?: string,
        notificationEmail?: string
    ) => void;
    name?: string;
    timezone?: string;
    tradKey?: string;
    website?: string;
    pairingMode?: string;
    notificationEmail?: string;
}

const styles = { my: 2, width: '100%' };

interface PairingModeOption {
    value: PairingMode;
    label: string;
}

const UniversityForm: React.FC<UniversityFormProps> = ({
    admissionEndDate,
    admissionStartDate,
    codes,
    country,
    domains,
    handleSubmit,
    name,
    tradKey = 'create',
    timezone,
    website,
    pairingMode,
    notificationEmail,
}) => {
    const translate = useTranslate();
    const notify = useNotify();

    const [newName, setNewName] = useState<string>(name || '');
    const [newCountry, setNewCountry] = useState<Country | undefined>(country || undefined);
    const [newTimezone, setNewTimezone] = useState<string | undefined>(timezone || '');
    const [newAdmissionStartDate, setNewAdmissionStartDate] = useState<Date | null>();
    const [newAdmissionEndDate, setNewAdmissionEndDate] = useState<Date | null>();
    const [newWebsite, setNewWebsite] = useState<string>(website || '');
    const [newCodes, setNewCodes] = useState<string[]>(codes || []);
    const [newDomains, setNewDomains] = useState<string[]>(domains || []);
    const [newPairingMode, setNewPairingMode] = useState<string>(pairingMode || 'MANUAL');
    const [newNotificationEmail, setNewNotificationEmail] = useState<string>(notificationEmail || '');

    const addCode = (newCode: string) => {
        if (!isCodeValid(newCode)) {
            return notify(`universities.${tradKey}.codes_error`);
        }

        return setNewCodes([...newCodes, newCode]);
    };

    const removeCode = (codeToRemove: string) => {
        setNewCodes(newCodes.filter((code) => code !== codeToRemove));
    };

    const addDomain = (newDomain: string) => {
        if (newDomain[0] !== '@') {
            return notify(`universities.${tradKey}.domains_error`);
        }

        return setNewDomains([...newDomains, newDomain]);
    };

    const removeDomain = (domainToRemove: string) => {
        setNewDomains(newDomains.filter((domain) => domain !== domainToRemove));
    };

    const onSendUniversity = () => {
        const admissionStart = newAdmissionStartDate || admissionStartDate;
        const admissionEnd = newAdmissionEndDate || admissionEndDate;
        if (!newCountry || !newTimezone || !newName || !admissionStart || !admissionEnd || !newWebsite) {
            return undefined;
        }

        if (admissionEnd <= admissionStart) {
            return notify(`universities.${tradKey}.admission_error`);
        }

        return handleSubmit(
            newName,
            newCountry,
            newTimezone,
            admissionStart,
            admissionEnd,
            newCodes,
            newDomains,
            newPairingMode,
            newWebsite,
            newNotificationEmail
        );
    };

    const pairingModeOptions: PairingModeOption[] = [
        {
            value: PairingMode.MANUAL,
            label: translate(`universities.pairingModes.manual`),
        },
        {
            value: PairingMode.SEMI_AUTOMATIC,
            label: translate(`universities.pairingModes.semi_automatic`),
        },
        {
            value: PairingMode.AUTOMATIC,
            label: translate(`universities.pairingModes.automatic`),
        },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Form>
                <Box display="flex" flexDirection="column" sx={{ m: 4 }}>
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

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.timezone`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <TimezonePicker onChange={setNewTimezone} value={newTimezone} />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.admission_start`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <DatePicker
                            // @ts-ignore
                            defaultValue={daysjs(admissionStartDate)}
                            format="DD/MM/YYYY"
                            label="DD/MM/YYYY"
                            onChange={setNewAdmissionStartDate}
                            sx={{ my: 2, width: '100%' }}
                            value={newAdmissionStartDate}
                            disableUnderline
                        />
                    </Box>

                    <Typography variant="subtitle1">{translate(`universities.${tradKey}.admission_end`)}</Typography>
                    <Box alignItems="center" display="flex" flexDirection="row">
                        <DatePicker
                            // @ts-ignore
                            defaultValue={daysjs(admissionEndDate)}
                            format="DD/MM/YYYY"
                            label="DD/MM/YYYY"
                            onChange={setNewAdmissionEndDate}
                            sx={{ my: 2, width: '100%' }}
                            value={newAdmissionEndDate}
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
                    <Input
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                addCode((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                            }
                        }}
                        placeholder="Ajouter un nouveau code"
                        sx={styles}
                    />

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

                    <Input
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                await addDomain((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                            }
                        }}
                        placeholder="Ajouter un nouveau domaine"
                        sx={styles}
                    />

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

                    <Button
                        color="primary"
                        disabled={
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
