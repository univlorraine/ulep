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

import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';
import { useGetList, useTranslate } from 'react-admin';
import University from '../../../../entities/University';
import { UserRole } from '../../../../entities/User';

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
    const { data: universities } = useGetList('universities', {
        sort: {
            field: 'name',
            order: 'ASC',
        },
    });

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
