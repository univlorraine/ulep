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
    const record: ProfileWithTandemsProfiles = useRecordContext();

    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    const isJokerLearningLanguage = isJoker(learningLanguage);
    const userIsFromCentralUniversity = record.user ? isCentralUniversity(record.user.university) : undefined;
    const hasActiveTandem =
        learningLanguage.tandem?.status === TandemStatus.ACTIVE ||
        learningLanguage.tandem?.status === TandemStatus.PAUSED;
    const hasTandemWaitingForValidation = learningLanguage.tandem?.status === TandemStatus.VALIDATED_BY_ONE_UNIVERSITY;
    const isAutomaticPairingMode = record.user.university.pairingMode === PairingMode.AUTOMATIC;

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
