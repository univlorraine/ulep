import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';
import { useTranslate } from 'react-admin';
import { ReportStatus } from '../entities/Report';

interface ReportStatusPickerProps {
    onChange: (value: ReportStatus) => void;
    value?: ReportStatus;
}

const ReportStatusPicker: React.FC<ReportStatusPickerProps> = ({ onChange, value }) => {
    const translation = useTranslate();

    return (
        <FormControl>
            <Select
                id="report-picker"
                onChange={(reportStatus) => onChange(reportStatus.target.value as ReportStatus)}
                sx={{ width: '100%' }}
                value={value}
                disableUnderline
            >
                {Object.values(ReportStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                        <Typography variant="subtitle2">{translation(`reports.${status}`)}</Typography>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ReportStatusPicker;
