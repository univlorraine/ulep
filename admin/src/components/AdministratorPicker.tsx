import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';
import { Loading, useGetList, useTranslate } from 'react-admin';
import Administrator from '../entities/Administrator';

interface AdministratorPickerProps {
    onChange: (value: Administrator) => void;
    universityId?: string;
    value?: Administrator;
}

const AdministratorPicker: React.FC<AdministratorPickerProps> = ({ onChange, universityId, value }) => {
    const { data: dataPicker, isLoading } = useGetList('users/administrators', { filter: { universityId } });
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
                    {dataPicker.map((administrator: Administrator) => {
                        const language = administrator.language
                            ? `(${translate(`languages_code.${administrator.language.code}`)})`
                            : '';

                        return (
                            <MenuItem key={administrator.id} value={administrator.id}>
                                {administrator.firstname} {administrator.lastname} {language}
                            </MenuItem>
                        );
                    })}
                </Select>
            )}
            {!dataPicker ||
                (dataPicker.length === 0 && <Typography>{translate('global.noAdministartorFound')}</Typography>)}
        </FormControl>
    );
};

export default AdministratorPicker;
