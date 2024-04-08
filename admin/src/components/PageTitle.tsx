import { Typography } from '@mui/material';
import React, { ReactNode } from 'react';

interface LanguagesPickerProps {
    children: ReactNode;
}

const PageTitle: React.FC<LanguagesPickerProps> = ({ children }) => (
    <Typography component="h2" variant="h2">
        {children}
    </Typography>
);

export default PageTitle;
