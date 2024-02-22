import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';
import { useTranslate } from 'react-admin';

interface TandemFiltersParams {
    firstname?: string;
    setFirstname: (value: string) => void;
    lastname?: string;
    setLastname: (value: string) => void;
    role?: UserRole;
    setRole: (value?: UserRole) => void;
}

const ROLE_ALL_VALUE = 'ALL';

const TandemFilters = ({ firstname, setFirstname, lastname, setLastname, role, setRole }: TandemFiltersParams) => {
    const translate = useTranslate();

    return (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
            <TextField
                id="firstname-filter"
                label={translate('learning_languages.show.tandems.filters.firstname')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFirstname(event.target.value);
                }}
                value={firstname}
            />
            <TextField
                id="lastname-filter"
                label={translate('learning_languages.show.tandems.filters.lastname')}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setLastname(event.target.value);
                }}
                value={lastname}
            />
            <FormControl sx={{ minWidth: '100px' }}>
                <InputLabel id="role-filter-label">
                    {translate('learning_languages.show.tandems.filters.role')}
                </InputLabel>
                <Select
                    id="role-filter"
                    label={translate('learning_languages.show.tandems.filters.role')}
                    labelId="role-filter-label"
                    onChange={(event: SelectChangeEvent) => {
                        if (event.target.value === ROLE_ALL_VALUE) {
                            setRole(undefined);
                        } else {
                            setRole(event.target.value as UserRole);
                        }
                    }}
                    value={role || ROLE_ALL_VALUE}
                >
                    <MenuItem value={ROLE_ALL_VALUE}>{translate('global.all')}</MenuItem>
                    <MenuItem value="STUDENT">{translate('global.student')}</MenuItem>
                    <MenuItem value="STAFF">{translate('global.staff')}</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default TandemFilters;
