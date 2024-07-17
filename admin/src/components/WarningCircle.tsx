import { Box } from '@mui/material';
import React from 'react';

const WarningCircle: React.FC = () => (
    <Box
        sx={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <img alt="" src="/WarningFilled.svg" style={{ width: '15px', height: '15px' }} />
    </Box>
);

export default WarningCircle;
