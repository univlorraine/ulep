import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    FormControlLabel,
    FormGroup,
    MenuItem,
    OutlinedInput,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import React, { useEffect, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import Instance, { EditoMandatoryTranslations, InstanceFormPayload } from '../../entities/Instance';
import Language from '../../entities/Language';
import { isCentralUniversity } from '../../entities/University';
import FileUploader from '../FileUploader';
import useGetUniversitiesLanguages from './useGetUniversitiesLanguages';

interface InstanceFormProps {
    handleSubmit: (payload: InstanceFormPayload) => void;
    instance: Instance;
}

const InstanceForm: React.FC<InstanceFormProps> = ({ handleSubmit, instance }) => {
    const translate = useTranslate();
    const { universitiesLanguages, universitiesData } = useGetUniversitiesLanguages();

    const [availableLanguages, setAvailableLanguages] = useState<Language[]>(universitiesLanguages);
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
    const [newDefaultCertificateFile, setNewDefaultCertificateFile] = useState<File>();
    const [newEditoMandatoryTranslations, setNewEditoMandatoryTranslations] = useState<EditoMandatoryTranslations[]>(
        instance.editoMandatoryTranslations
    );
    const [newCentralUniversityTranslations, setNewCentralUniversityTranslations] = useState<Language[]>(
        instance.editoCentralUniversityTranslations
    );
    const [selectedLanguage, setSelectedLanguage] = useState<Language>();

    useEffect(() => {
        const centralUniversity = universitiesData?.find(isCentralUniversity);
        const newAvailableLanguages = universitiesLanguages.filter(
            (lang) => lang.code !== 'en' && lang.code !== centralUniversity?.nativeLanguage.code
        );
        setAvailableLanguages(newAvailableLanguages);

        const newSelectedLanguage = newAvailableLanguages?.filter(
            (lang) => !instance.editoCentralUniversityTranslations?.some((l) => l.code === lang.code)
        );
        setSelectedLanguage(newSelectedLanguage?.[0]);
    }, [universitiesLanguages]);

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

    const onSubmit = () =>
        handleSubmit({
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
            defaultCertificateFile: newDefaultCertificateFile,
            editoMandatoryTranslations: newEditoMandatoryTranslations,
            editoCentralUniversityTranslations: newCentralUniversityTranslations,
        });

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

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edit.defaultCertificateFile`)}</Typography>
                        <FileUploader
                            accept="application/pdf"
                            fileType="PDF"
                            onFileSelect={setNewDefaultCertificateFile}
                            source="defaultCertificateFile.id"
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">{translate(`instance.edito.mandatoryTranslations`)}</Typography>
                        <Box alignItems="center" display="flex" flexDirection="row">
                            <FormGroup>
                                {Object.values(EditoMandatoryTranslations).map((translation) => (
                                    <FormControlLabel
                                        key={translation}
                                        checked={newEditoMandatoryTranslations.includes(translation)}
                                        control={<Switch />}
                                        label={translate(`editos.languages.${translation}`)}
                                        onChange={() => {
                                            if (newEditoMandatoryTranslations.includes(translation)) {
                                                setNewEditoMandatoryTranslations(
                                                    newEditoMandatoryTranslations.filter((t) => t !== translation)
                                                );
                                            } else {
                                                setNewEditoMandatoryTranslations([
                                                    ...newEditoMandatoryTranslations,
                                                    translation,
                                                ]);
                                            }
                                        }}
                                        value={translation}
                                    />
                                ))}
                            </FormGroup>
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1">
                            {translate(`instance.edito.centralUniversityTranslations`)}
                        </Typography>
                        {availableLanguages.length > 0 && (
                            <>
                                <Table>
                                    <TableBody>
                                        {newCentralUniversityTranslations?.map((language) => (
                                            <TableRow key={language.code}>
                                                <TableCell sx={{ width: '60px', padding: '0' }}>
                                                    <Button
                                                        onClick={() => {
                                                            const newCentralUniversityTranslationsValue =
                                                                newCentralUniversityTranslations.filter(
                                                                    (lang) => lang.code !== language.code
                                                                );
                                                            setNewCentralUniversityTranslations(
                                                                newCentralUniversityTranslationsValue
                                                            );
                                                            const newSelectedLanguages = availableLanguages?.filter(
                                                                (lang) =>
                                                                    !newCentralUniversityTranslationsValue?.some(
                                                                        (l) => l.code === lang.code
                                                                    )
                                                            );
                                                            if (newSelectedLanguages) {
                                                                setSelectedLanguage(newSelectedLanguages?.[0]);
                                                            }
                                                        }}
                                                        sx={{ '& span': { margin: 0 } }}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </TableCell>
                                                <TableCell sx={{ padding: '10px' }}>{language.code}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {selectedLanguage &&
                                    availableLanguages.filter(
                                        (language) =>
                                            !newCentralUniversityTranslations?.some((l) => l.code === language.code)
                                    ).length > 0 && (
                                        <Box alignItems="center" display="flex" flexDirection="row" gap="10px">
                                            <Select
                                                onChange={(e) => {
                                                    const language = availableLanguages.find(
                                                        (lang) => lang.code === e.target.value
                                                    );
                                                    setSelectedLanguage(language);
                                                }}
                                                value={selectedLanguage?.code}
                                            >
                                                {availableLanguages
                                                    .filter(
                                                        (language) =>
                                                            !newCentralUniversityTranslations?.some(
                                                                (l) => l.code === language.code
                                                            )
                                                    )
                                                    .map((language) => (
                                                        <MenuItem key={language.code} value={language.code}>
                                                            {language.code}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                            <Button
                                                color="primary"
                                                disabled={!selectedLanguage}
                                                onClick={() => {
                                                    const language = availableLanguages?.find(
                                                        (lang) => lang.code === selectedLanguage?.code
                                                    );
                                                    if (language) {
                                                        const newCentralUniversityTranslationsValue =
                                                            newCentralUniversityTranslations
                                                                ? [...newCentralUniversityTranslations, language]
                                                                : [language];
                                                        setNewCentralUniversityTranslations(
                                                            newCentralUniversityTranslationsValue
                                                        );
                                                        const newSelectedLanguages = availableLanguages?.filter(
                                                            (lang) =>
                                                                !newCentralUniversityTranslationsValue?.some(
                                                                    (l) => l.code === lang.code
                                                                )
                                                        );
                                                        if (newSelectedLanguages) {
                                                            setSelectedLanguage(newSelectedLanguages?.[0]);
                                                        }
                                                    }
                                                }}
                                                sx={{ padding: '8px 30px' }}
                                                variant="contained"
                                            >
                                                <span>Ajouter</span>
                                            </Button>
                                        </Box>
                                    )}
                            </>
                        )}
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
