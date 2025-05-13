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

import { TabPanel } from '@mui/lab';
import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

import { useGetIdentity, useGetList, useRecordContext, useTranslate } from 'react-admin';

import { isJoker, LearningLanguageWithTandemWithPartnerProfile } from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import { ProfileWithTandemsProfiles } from '../../../entities/ProfileWithTandemsProfiles';
import { TandemStatus } from '../../../entities/Tandem';
import { isCentralUniversity, PairingMode } from '../../../entities/University';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import OtherProposals from './OtherProposals';
import PartnerCard, { PartnerType } from './PartnerCard';

import ProfileCard from './ProfileCard';
import './show.css';
import TandemInfo from './TandemInfo';

type TabPanelLayoutProps = {
    children: React.ReactNode;
    learningLanguage: LearningLanguageWithTandemWithPartnerProfile;
};

const TabPanelLayout = ({ children, learningLanguage }: TabPanelLayoutProps) => {
    const translate = useTranslate();

    return (
        <TabPanel key={learningLanguage.code} value={learningLanguage.code}>
            <Typography sx={{ marginTop: 4 }} variant="h3">
                {translate('learning_languages.show.management.title')}
            </Typography>

            {children}
        </TabPanel>
    );
};

type LearningLanguageTabContentProps = {
    learningLanguage: LearningLanguageWithTandemWithPartnerProfile;
};

const LearningLanguageTabContent = ({ learningLanguage }: LearningLanguageTabContentProps) => {
    const record: ProfileWithTandemsProfiles | undefined = useRecordContext();

    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    const isJokerLearningLanguage = isJoker(learningLanguage);
    const userIsFromCentralUniversity = record?.user ? isCentralUniversity(record.user.university) : undefined;
    const hasActiveTandem =
        learningLanguage.tandem?.status === TandemStatus.ACTIVE ||
        learningLanguage.tandem?.status === TandemStatus.PAUSED;
    const hasTandemWaitingForValidation = learningLanguage.tandem?.status === TandemStatus.VALIDATED_BY_ONE_UNIVERSITY;
    const isAutomaticPairingMode = record?.user?.university?.pairingMode === PairingMode.AUTOMATIC;

    const { selectedUniversityIds } = useLearningLanguagesStore();

    const {
        isLoading: isLoadingMatches,
        isError: isErrorMatches,
        data: matches,
    } = useGetList<Match>(
        'learning-languages/matches',
        {
            filter: {
                id: learningLanguage?.id,
                universityIds:
                    identity?.universityId && userIsFromCentralUniversity
                        ? [...selectedUniversityIds, identity.universityId]
                        : [],
                count: 0,
            },
        },
        {
            enabled: !!record?.id && !hasActiveTandem && !isLoadingIdentity,
        }
    );

    if (isLoadingIdentity || isLoadingMatches) {
        return <CircularProgress />;
    }

    const bestMatch = matches?.[0];

    if (learningLanguage.tandem && hasActiveTandem) {
        return (
            <TabPanelLayout learningLanguage={learningLanguage}>
                <Box className="tandem-management">
                    <ProfileCard
                        hasActiveTandem={hasActiveTandem}
                        learningLanguage={learningLanguage}
                        record={record}
                    />

                    <PartnerCard
                        compatibilityScoreTotal={learningLanguage.tandem.compatibilityScore}
                        partnerLearningLanguage={learningLanguage.tandem.partnerLearningLanguage}
                        tandem={learningLanguage.tandem}
                        userLearningLanguage={learningLanguage}
                        userProfile={record}
                        hasActiveTandem
                    />

                    <TandemInfo
                        hasActiveTandem={hasActiveTandem}
                        partnerLearningLanguage={learningLanguage.tandem.partnerLearningLanguage}
                        tandem={learningLanguage.tandem}
                        userLearningLanguage={learningLanguage}
                    />
                </Box>
            </TabPanelLayout>
        );
    }

    if (learningLanguage.tandem && hasTandemWaitingForValidation) {
        const isUserValidationNeeded = !learningLanguage.tandem.universityValidations?.includes(identity?.universityId);

        return (
            <TabPanelLayout learningLanguage={learningLanguage}>
                <Box className="tandem-management">
                    <ProfileCard
                        hasActiveTandem={hasActiveTandem}
                        learningLanguage={learningLanguage}
                        record={record}
                    />

                    <PartnerCard
                        compatibilityScoreTotal={learningLanguage.tandem.compatibilityScore}
                        hasTandemWaitingForValidation={hasTandemWaitingForValidation}
                        isUserValidationNeeded={isUserValidationNeeded}
                        partnerLearningLanguage={learningLanguage.tandem.partnerLearningLanguage}
                        tandem={learningLanguage.tandem}
                        userLearningLanguage={learningLanguage}
                        userProfile={record}
                    />

                    <TandemInfo tandem={learningLanguage.tandem} />
                </Box>
            </TabPanelLayout>
        );
    }

    return (
        <TabPanelLayout learningLanguage={learningLanguage}>
            <Box className="tandem-management">
                <ProfileCard hasActiveTandem={hasActiveTandem} learningLanguage={learningLanguage} record={record} />

                <PartnerCard
                    compatibilityScoreTotal={learningLanguage.tandem?.compatibilityScore}
                    partnerLearningLanguage={learningLanguage.tandem?.partnerLearningLanguage}
                    partnerType={PartnerType.BEST_OVERALL}
                    tandem={learningLanguage?.tandem}
                    userLearningLanguage={learningLanguage}
                    userProfile={record}
                />

                {!isAutomaticPairingMode && (
                    <PartnerCard
                        compatibilityScoreTotal={bestMatch?.score.total}
                        compatibilityScores={bestMatch?.score}
                        partnerLearningLanguage={bestMatch?.target}
                        partnerType={PartnerType.BEST_MATCH}
                        tandem={learningLanguage?.tandem}
                        userLearningLanguage={learningLanguage}
                        userProfile={record}
                    />
                )}
            </Box>
            {!isLoadingMatches && matches && !isAutomaticPairingMode && (
                <OtherProposals
                    isErrorMatches={isErrorMatches}
                    isJokerLearningLanguage={isJokerLearningLanguage}
                    isLoadingMatches={isLoadingMatches}
                    matches={matches.slice(1)}
                    tandem={learningLanguage?.tandem}
                    userLearningLanguage={learningLanguage}
                />
            )}
        </TabPanelLayout>
    );
};

export default LearningLanguageTabContent;
