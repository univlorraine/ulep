import { Box, Typography, Input } from '@mui/material';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import University from '../../entities/University';
import inputStyle from '../../theme/inputStyle';
import isPasswordValid from '../../utils/isPasswordValid';
import UniversityPicker from '../UniversityPicker';

interface AdministratorFormProps {
    email?: string;
    handleSubmit: (email: string, password?: string, university?: University) => void;
    universityId?: string;
}

const AdministratorForm: React.FC<AdministratorFormProps> = ({ email, handleSubmit, universityId }) => {
    const translate = useTranslate();
    const [newEmail, setNewEmail] = useState<string>(email || '');
    const [password, setPassword] = useState<string>('');
    const [university, setUniversity] = useState<University>();

    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate(`administrators.update.email`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Email"
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={translate('global.email')}
                    sx={inputStyle}
                    type="email"
                    value={newEmail}
                    disableUnderline
                    required
                />
            </Box>

            <Typography variant="subtitle1">{translate(`administrators.update.university`)}</Typography>
            <UniversityPicker initialValue={universityId} onChange={setUniversity} value={university} />

            <Typography variant="subtitle1">{translate(`administrators.update.password`)}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={translate('global.password')}
                    sx={inputStyle}
                    value={password}
                    disableUnderline
                    required
                />
            </Box>

            <Button
                color="primary"
                disabled={!university || (email ? false : !password || !isPasswordValid(password)) || !newEmail}
                onClick={() => handleSubmit(newEmail, password, university)}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default AdministratorForm;
