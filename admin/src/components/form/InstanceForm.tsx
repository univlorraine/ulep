import { Box, Typography, OutlinedInput } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import Instance from '../../entities/Instance';

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
    const [newDaysBeforeClosureNotification, setNewDaysBeforeClosureNotification] = useState<number>(
        instance.daysBeforeClosureNotification
    );

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
            isInMaintenance: instance.isInMaintenance,
            daysBeforeClosureNotification: newDaysBeforeClosureNotification,
        };

        return handleSubmit(newInstance);
    };

    return (
        <>
            <Box sx={{ m: 4, display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.name`)}</Typography>
                        <Box alignItems="center" display="flex" flexDirection="row">
                            <OutlinedInput onChange={(e) => setNewName(e.target.value)} value={newName} required />
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.email`)}</Typography>
                        <Box alignItems="center" display="flex" flexDirection="row">
                            <OutlinedInput
                                name="Email"
                                onChange={(e) => setNewEmail(e.target.value)}
                                type="email"
                                value={newEmail}
                                required
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.cgu`)}</Typography>
                        <Box alignItems="center" display="flex" flexDirection="row">
                            <OutlinedInput
                                name="Cgu"
                                onChange={(e) => setNewCgu(e.target.value)}
                                type="url"
                                value={newCgu}
                                required
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.confidentiality`)}</Typography>
                        <Box alignItems="center" display="flex" flexDirection="row">
                            <OutlinedInput
                                name="Confidentiality"
                                onChange={(e) => setNewConfidentiality(e.target.value)}
                                type="url"
                                value={newConfidentiality}
                                required
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.ressource`)}</Typography>
                        <Box alignItems="center" display="flex" flexDirection="row">
                            <OutlinedInput
                                name="Ressource"
                                onChange={(e) => setNewRessource(e.target.value)}
                                type="url"
                                value={newRessource}
                                required
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">
                            {translate(`instance.edit.daysBeforeClosureNotification`)}
                        </Typography>
                        <Box alignItems="center" display="flex" flexDirection="row">
                            <OutlinedInput
                                name="DaysBeforeClosureNotification"
                                onChange={(e) => setNewDaysBeforeClosureNotification(Number(e.target.value))}
                                type="number"
                                value={newDaysBeforeClosureNotification}
                                required
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.primaryColor`)}</Typography>
                        <MuiColorInput
                            format="hex"
                            onChange={(_, colors) => setNewPrimaryColor(colors.hex)}
                            value={newPrimaryColor}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.primaryBackgroundColor`)}</Typography>
                        <MuiColorInput
                            format="hex"
                            onChange={(_, colors) => setNewPrimaryBackgroundColor(colors.hex)}
                            value={newPrimaryBackgroundColor}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.primaryDarkColor`)}</Typography>
                        <MuiColorInput
                            format="hex"
                            onChange={(_, colors) => setNewPrimaryDarkColor(colors.hex)}
                            value={newPrimaryDarkColor}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.secondaryColor`)}</Typography>
                        <MuiColorInput
                            format="hex"
                            onChange={(_, colors) => setNewSecondaryColor(colors.hex)}
                            value={newSecondaryColor}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">
                            {translate(`instance.edit.secondaryBackgroundColor`)}
                        </Typography>
                        <MuiColorInput
                            format="hex"
                            onChange={(_, colors) => setNewSecondaryBackgroundColor(colors.hex)}
                            value={newSecondaryBackgroundColor}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.secondaryDarkColor`)}</Typography>
                        <MuiColorInput
                            format="hex"
                            onChange={(_, colors) => setNewSecondaryDarkColor(colors.hex)}
                            value={newSecondaryDarkColor}
                        />
                    </Box>
                </Box>
            </Box>
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
        </>
    );
};

export default InstanceForm;
