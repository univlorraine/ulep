import { Box, Typography, Input } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import Instance from '../../entities/Instance';
import inputStyle from '../../theme/inputStyle';

interface InstanceFormProps {
    handleSubmit: (instance: Instance) => void;
    instance: Instance;
}

const InstanceForm: React.FC<InstanceFormProps> = ({ handleSubmit, instance }) => {
    const translate = useTranslate();
    const [newName, setNewName] = useState<string>(instance.name);
    const [newEmail, setNewEmail] = useState<string>(instance.email);
    const [newCgu, setNewCgu] = useState<string>(instance.cguUrl);
    const [newConfidentiality, setNewConfidentiality] = useState<string>(instance.confidentialityUrl);
    const [newRessource, setNewRessource] = useState<string>(instance.ressourceUrl);
    const [newPrimaryColor, setNewPrimaryColor] = useState<string>(instance.primaryColor);
    const [newPrimaryBackgroundColor, setNewPrimaryBackgroundColor] = useState<string>(instance.primaryBackgroundColor);
    const [newPrimaryDarkColor, setNewPrimaryDarkColor] = useState<string>(instance.primaryDarkColor);
    const [newSecondaryColor, setNewSecondaryColor] = useState<string>(instance.secondaryColor);
    const [newSecondaryBackgroundColor, setNewSecondaryBackgroundColor] = useState<string>(
        instance.secondaryBackgroundColor
    );
    const [newSecondaryDarkColor, setNewSecondaryDarkColor] = useState<string>(instance.secondaryDarkColor);

    const allFieldsFilled =
        newName &&
        newEmail &&
        newCgu &&
        newConfidentiality &&
        newRessource &&
        newPrimaryColor &&
        newPrimaryBackgroundColor &&
        newPrimaryDarkColor &&
        newSecondaryColor &&
        newSecondaryBackgroundColor &&
        newSecondaryDarkColor;

    const onSubmit = () => {
        const newInstance: Instance = {
            name: newName,
            email: newEmail,
            cguUrl: newCgu,
            confidentialityUrl: newConfidentiality,
            ressourceUrl: newRessource,
            primaryColor: newPrimaryColor,
            primaryBackgroundColor: newPrimaryBackgroundColor,
            primaryDarkColor: newPrimaryDarkColor,
            secondaryColor: newSecondaryColor,
            secondaryBackgroundColor: newSecondaryBackgroundColor,
            secondaryDarkColor: newSecondaryDarkColor,
        };

        return handleSubmit(newInstance);
    };

    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate(`instance.edit.name`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    onChange={(e) => setNewName(e.target.value)}
                    sx={inputStyle}
                    value={newName}
                    disableUnderline
                    required
                />
            </Box>

            <Typography variant="subtitle1">{translate(`instance.edit.email`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Email"
                    onChange={(e) => setNewEmail(e.target.value)}
                    sx={inputStyle}
                    type="email"
                    value={newEmail}
                    disableUnderline
                    required
                />
            </Box>
            <Typography variant="subtitle1">{translate(`instance.edit.cgu`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Cgu"
                    onChange={(e) => setNewCgu(e.target.value)}
                    sx={inputStyle}
                    type="url"
                    value={newCgu}
                    disableUnderline
                    required
                />
            </Box>

            <Typography variant="subtitle1">{translate(`instance.edit.confidentiality`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Confidentiality"
                    onChange={(e) => setNewConfidentiality(e.target.value)}
                    sx={inputStyle}
                    type="url"
                    value={newConfidentiality}
                    disableUnderline
                    required
                />
            </Box>

            <Typography variant="subtitle1">{translate(`instance.edit.ressource`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Ressource"
                    onChange={(e) => setNewRessource(e.target.value)}
                    sx={inputStyle}
                    type="url"
                    value={newRessource}
                    disableUnderline
                    required
                />
            </Box>

            <Typography variant="subtitle1">{translate(`instance.edit.primaryColor`)}</Typography>
            <MuiColorInput onChange={(_, colors) => setNewPrimaryColor(colors.hex)} value={newPrimaryColor} />
            <Typography variant="subtitle1">{translate(`instance.edit.primaryBackgroundColor`)}</Typography>
            <MuiColorInput
                onChange={(_, colors) => setNewPrimaryBackgroundColor(colors.hex)}
                value={newPrimaryBackgroundColor}
            />
            <Typography variant="subtitle1">{translate(`instance.edit.primaryDarkColor`)}</Typography>
            <MuiColorInput onChange={(_, colors) => setNewPrimaryDarkColor(colors.hex)} value={newPrimaryDarkColor} />
            <Typography variant="subtitle1">{translate(`instance.edit.secondaryColor`)}</Typography>
            <MuiColorInput onChange={(_, colors) => setNewSecondaryColor(colors.hex)} value={newSecondaryColor} />
            <Typography variant="subtitle1">{translate(`instance.edit.secondaryBackgroundColor`)}</Typography>
            <MuiColorInput
                onChange={(_, colors) => setNewSecondaryBackgroundColor(colors.hex)}
                value={newSecondaryBackgroundColor}
            />
            <Typography variant="subtitle1">{translate(`instance.edit.secondaryDarkColor`)}</Typography>
            <MuiColorInput
                onChange={(_, colors) => setNewSecondaryDarkColor(colors.hex)}
                value={newSecondaryDarkColor}
            />

            <Button
                color="primary"
                disabled={!allFieldsFilled}
                onClick={onSubmit}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default InstanceForm;
