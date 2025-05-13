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

import { TabContext, TabList } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import React from 'react';
import { FunctionField, Show, SimpleShowLayout, useRecordContext, useTranslate } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { ProfileWithTandemsProfiles } from '../../../entities/ProfileWithTandemsProfiles';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';
import LearningLanguageTabContent from './LearningLanguageTabContent';

import './show.css';

const TabsComponent = () => {
    const translate = useTranslate();
    const record: ProfileWithTandemsProfiles | undefined = useRecordContext();

    const { state: learningLanguageCode } = useLocation();
    const [value, setValue] = React.useState(
        learningLanguageCode?.learningLanguageCode || record?.learningLanguages[0].code
    );
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <TabContext value={value}>
            <Box sx={{ width: '100%' }}>
                <TabList onChange={handleChange}>
                    {record?.learningLanguages.map((learningLanguage) => {
                        const label = learningLanguage.tandem
                            ? `${learningLanguage.name} (${translate(
                                  `learning_languages.status.${learningLanguage.tandem.status}`
                              )})`
                            : learningLanguage.name;

                        return <Tab key={learningLanguage.code} label={label} value={learningLanguage.code} />;
                    })}
                </TabList>
            </Box>
            {record?.learningLanguages.map((learningLanguage) => (
                <LearningLanguageTabContent key={learningLanguage.code} learningLanguage={learningLanguage} />
            ))}
        </TabContext>
    );
};

const LearningLanguageShow = () => (
    <Box className="profiles-with-tandem--show">
        <Show>
            <FunctionField
                render={(profile: ProfileWithTandemsProfiles) => (
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="h2">
                            {profile.user.lastname} {profile.user.firstname} (
                            {codeLanguageToFlag(profile.nativeLanguage.code)})
                        </Typography>
                    </Box>
                )}
            />
            <SimpleShowLayout sx={{ '& .RaSimpleShowLayout-row': { flexDirection: 'column', gap: '0' } }}>
                <TabsComponent />
            </SimpleShowLayout>
        </Show>
    </Box>
);

export default LearningLanguageShow;
