import { Box, Typography, OutlinedInput } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, useTranslate } from 'react-admin';

interface CampusFormProps {
    handleSubmit: (name: string) => void;
    name?: string;
}

const CampusForm: React.FC<CampusFormProps> = ({ handleSubmit, name }) => {
    const translate = useTranslate();
    const [newName, setNewName] = useState<string>(name || '');

    useEffect(() => {
        setNewName(name || '');
    }, [name]);

    return (
        <Box sx={{ m: 4, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box>
                <Typography variant="subtitle1">{translate(`campus.update.name`)}</Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <OutlinedInput
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={translate('global.content')}
                        value={newName}
                        required
                    />
                </Box>
            </Box>

            <Button
                color="primary"
                onClick={() => handleSubmit(newName)}
                sx={{ mt: 2, p: 1, width: '100%' }}
                variant="contained"
            >
                <>{translate('global.save')}</>
            </Button>
        </Box>
    );
};

export default CampusForm;
