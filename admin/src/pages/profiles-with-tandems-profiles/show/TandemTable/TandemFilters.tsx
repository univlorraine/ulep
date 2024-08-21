import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';
import { useGetList, useTranslate } from 'react-admin';
import University from '../../../../entities/University';

interface TandemFiltersParams {
    firstname?: string;
    setFirstname: (value: string) => void;
    lastname?: string;
    setLastname: (value: string) => void;
    role?: UserRole;
    setRole: (value?: UserRole) => void;
    universityId?: string;
    setUniversityId: (value?: string) => void;
}

const ROLE_ALL_VALUE = 'ALL';
const UNIVERSITY_ALL_VALUE = 'ALL';

const TandemFilters = ({
    firstname,
    setFirstname,
    lastname,
    setLastname,
    role,
    setRole,
    universityId,
    setUniversityId,
}: TandemFiltersParams) => {
    const translate = useTranslate();
    const { data: universities } = useGetList('universities');

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
            {universities && (
                <FormControl sx={{ minWidth: '300px' }}>
                    <InputLabel id="university-filter-label">
                        {translate('learning_languages.show.tandems.filters.university')}
                    </InputLabel>
                    <Select
                        id="university-filter"
                        label={translate('learning_languages.show.tandems.filters.university')}
                        labelId="university-filter-label"
                        onChange={(event: SelectChangeEvent) => {
                            if (event.target.value === UNIVERSITY_ALL_VALUE) {
                                setUniversityId(undefined);
                            } else {
                                setUniversityId(event.target.value as string);
                            }
                        }}
                        value={universityId || UNIVERSITY_ALL_VALUE}
                    >
                        <MenuItem value={UNIVERSITY_ALL_VALUE}>{translate('global.all')}</MenuItem>
                        {universities.map((university: University) => (
                            <MenuItem key={university.id} value={university.id}>
                                {university.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
};

export default TandemFilters;
