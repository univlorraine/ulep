import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';

interface TandemFiltersParams {
    firstname?: string;
    setFirstname: (value: string) => void;
    lastname?: string;
    setLastname: (value: string) => void;
    role?: UserRole;
    setRole: (value?: UserRole) => void;
}

const ROLE_ALL_VALUE = 'ALL';

// TODO(NOW): translate
const TandemFilters = ({ firstname, setFirstname, lastname, setLastname, role, setRole }: TandemFiltersParams) => (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
        <TextField
            id="firstname-filter"
            label="Firstname"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFirstname(event.target.value);
            }}
            value={firstname}
        />
        <TextField
            id="lastname-filter"
            label="Lastname"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLastname(event.target.value);
            }}
            value={lastname}
        />
        <FormControl sx={{ minWidth: '100px' }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
                id="role-filter"
                label="Role"
                labelId="role-filter-label"
                onChange={(event: SelectChangeEvent) => {
                    if (event.target.value === 'ALL') {
                        setRole(undefined);
                    } else {
                        setRole(event.target.value as UserRole);
                    }
                }}
                value={role || ROLE_ALL_VALUE}
            >
                <MenuItem value={ROLE_ALL_VALUE}>All</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="STAFF">Staff</MenuItem>
            </Select>
        </FormControl>
    </Box>
);

export default TandemFilters;
