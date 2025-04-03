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

import { Box, Switch, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import { LearningLanguage } from '../../entities/LearningLanguage';

interface CertificateFormProps {
    record: LearningLanguage;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ record }) => {
    const translate = useTranslate();
    const [learningJournal, setLearningJournal] = useState<boolean>(record.learningJournal || false);
    const [consultingInterview, setConsultingInterview] = useState<boolean>(record.consultingInterview || false);
    const [sharedCertificate, setSharedCertificate] = useState<boolean>(record.sharedCertificate || false);

    return (
        <Box display="flex" flexDirection="column" gap="30px">
            <Box>
                <Typography variant="subtitle1">
                    {translate('learning_languages.show.fields.learningJournal')}
                </Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <Switch
                        checked={learningJournal}
                        color="secondary"
                        name="learningJournal"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setLearningJournal(event.target.checked)
                        }
                        value={learningJournal}
                    />
                </Box>
            </Box>
            <Box>
                <Typography variant="subtitle1">
                    {translate('learning_languages.show.fields.consultingInterview')}
                </Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <Switch
                        checked={consultingInterview}
                        color="secondary"
                        name="consultingInterview"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setConsultingInterview(event.target.checked)
                        }
                        value={consultingInterview}
                    />
                </Box>
            </Box>
            <Box>
                <Typography variant="subtitle1">
                    {translate('learning_languages.show.fields.sharedCertificate')}
                </Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <Switch
                        checked={sharedCertificate}
                        color="secondary"
                        name="sharedCertificate"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setSharedCertificate(event.target.checked)
                        }
                        value={sharedCertificate}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default CertificateForm;
