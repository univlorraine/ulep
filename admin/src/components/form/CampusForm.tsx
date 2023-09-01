import { Box, Typography, Input } from '@mui/material';
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
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate(`campus.update.name`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={translate('global.content')}
                    sx={{ width: '80%' }}
                    value={newName}
                    required
                />
            </Box>

            <Button color="primary" onClick={() => handleSubmit(newName)} sx={{ mt: 4 }} variant="contained">
                <>{translate('global.save')}</>
            </Button>
        </Box>
    );
};

export default CampusForm;
