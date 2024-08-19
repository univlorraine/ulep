import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';
import { Loading, useGetList, useTranslate } from 'react-admin';
import Administrator from '../entities/Administrator';

interface AdministratorPickerProps {
    onChange: (value: Administrator) => void;
    university?: string;
    value?: Administrator;
}

const AdministratorPicker: React.FC<AdministratorPickerProps> = ({ onChange, university, value }) => {
    const { data: dataPicker, isLoading } = useGetList('users/administrators', { filter: { university } });
    const translate = useTranslate();

    if (isLoading || !dataPicker) {
        return <Loading />;
    }

    return (
        <FormControl>
            {dataPicker && dataPicker.length > 0 && (
                <Select
                    id="administrators-picker"
                    onChange={(administrator) =>
                        onChange(dataPicker.find((a: Administrator) => administrator.target.value === a.id))
                    }
                    sx={{ mb: 2, width: '100%' }}
                    value={value ? value.id : ''}
                    disableUnderline
                >
                    {dataPicker.map((administrator: Administrator) => (
                        <MenuItem key={administrator.id} value={administrator.id}>
                            {administrator.firstname} {administrator.lastname}
                        </MenuItem>
                    ))}
                </Select>
            )}
            {!dataPicker ||
                (dataPicker.length === 0 && <Typography>{translate('global.noAdministartorFound')}</Typography>)}
        </FormControl>
    );
};

export default AdministratorPicker;
