import { Box, Typography, Input, Button, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import { useTranslate, useNotify } from 'react-admin';
import Country from '../../entities/Country';
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
        website?: string
    ) => void;
    name?: string;
    timezone?: string;
    website?: string;
}

const UniversityForm: React.FC<UniversityFormProps> = ({
    admissionEndDate,
    admissionStartDate,
    codes,
    country,
    domains,
    handleSubmit,
    name,
    timezone,
    website,
}) => {
    const translate = useTranslate();
    const notify = useNotify();

    const [newName, setNewName] = useState<string>(name || '');
    const [newCountry, setNewCountry] = useState<Country | undefined>(country || undefined);
    const [newTimezone, setNewTimezone] = useState<string | undefined>(timezone || '');
    const [newAdmissionStartDate, setNewAdmissionStartDate] = useState<Date | null>(admissionStartDate || null);
    const [newAdmissionEndDate, setNewAdmissionEndDate] = useState<Date | null>(admissionEndDate || null);
    const [newWebsite, setNewWebsite] = useState<string>(website || '');
    const [newCodes, setNewCodes] = useState<string[]>(codes || []);
    const [newDomains, setNewDomains] = useState<string[]>(domains || []);

    const addCode = (newCode: string) => {
        if (!isCodeValid(newCode)) {
            return notify('universities.create.codes_error');
        }

        return setNewCodes([...newCodes, newCode]);
    };
    const addDomain = (newDomain: string) => {
        if (newDomain[0] !== '@') {
            return notify('universities.create.domains_error');
        }

        return setNewDomains([...newDomains, newDomain]);
    };

    const onSendUniversity = () => {
        if (!newCountry || !newTimezone || !newName || !newAdmissionStartDate || !newAdmissionEndDate || !newWebsite) {
            return undefined;
        }

        if (newAdmissionEndDate <= newAdmissionStartDate) {
            return notify('universities.create.admission_error');
        }

        return handleSubmit(
            newName,
            newCountry,
            newTimezone,
            newAdmissionStartDate,
            newAdmissionEndDate,
            newCodes,
            newDomains,
            newWebsite
        );
    };

    useEffect(() => {
        setNewName(name || '');
    }, [name]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ m: 4 }}>
                <Typography variant="subtitle1">{translate('universities.create.name')}</Typography>

                <Box alignItems="center" display="flex" flexDirection="row">
                    <Input name="Name" onChange={(e) => setNewName(e.target.value)} sx={{ my: 2 }} required />
                </Box>

                <Typography variant="subtitle1">{translate('universities.create.country')}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <CountriesPicker onChange={setNewCountry} value={newCountry} />
                </Box>

                <Typography variant="subtitle1">{translate('universities.create.timezone')}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <TimezonePicker onChange={setNewTimezone} value={newTimezone} />
                </Box>

                <Typography variant="subtitle1">{translate('universities.create.admission_start')}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <DatePicker
                        format="DD/MM/YYYY"
                        label="DD/MM/YYYY"
                        onChange={setNewAdmissionStartDate}
                        sx={{ my: 2 }}
                        value={newAdmissionStartDate}
                    />
                </Box>

                <Typography variant="subtitle1">{translate('universities.create.admission_end')}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <DatePicker
                        format="DD/MM/YYYY"
                        label="DD/MM/YYYY"
                        onChange={setNewAdmissionEndDate}
                        sx={{ my: 2 }}
                        value={newAdmissionEndDate}
                    />
                </Box>

                <Typography variant="subtitle1">{translate('universities.create.codes')}</Typography>
                <Table>
                    <TableBody>
                        {newCodes.map((code) => (
                            <TableRow key={code}>
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
                    sx={{ my: 2 }}
                />

                <Typography variant="subtitle1">{translate('universities.create.domains')}</Typography>
                <Table>
                    <TableBody>
                        {newDomains.map((domain) => (
                            <TableRow key={domain}>
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
                    sx={{ my: 2 }}
                />

                <Typography variant="subtitle1">{translate('universities.create.website')}</Typography>

                <Box alignItems="center" display="flex" flexDirection="row">
                    <Input name="Name" onChange={(e) => setNewWebsite(e.target.value)} sx={{ my: 2 }} required />
                </Box>

                <Button
                    color="primary"
                    disabled={
                        !newCountry ||
                        !newTimezone ||
                        !newName ||
                        !newAdmissionStartDate ||
                        !newAdmissionEndDate ||
                        !newWebsite
                    }
                    onClick={onSendUniversity}
                    sx={{ mt: 4 }}
                    variant="contained"
                >
                    {translate('global.save')}
                </Button>
            </Box>
        </LocalizationProvider>
    );
};

export default UniversityForm;
