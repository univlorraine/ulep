/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
