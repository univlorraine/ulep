import { TabPanel } from '@mui/lab';
import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

import { useGetIdentity, useGetList, useRecordContext, useTranslate } from 'react-admin';

import { isJoker, LearningLanguage } from '../../../entities/LearningLanguage';
import { Match } from '../../../entities/Match';
import { ProfileWithTandems } from '../../../entities/Profile';
import { TandemStatus } from '../../../entities/Tandem';
import { isCentralUniversity } from '../../../entities/University';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import OtherProposals from './OtherProposals';
import PartnerCard, { PartnerType } from './PartnerCard';

import './show.css';
import ProfileCard from './ProfileCard';
import TandemInfo from './TandemInfo';

const LearningLanguageTabContent = ({ learningLanguage }: { learningLanguage: LearningLanguage }) => {
    const translate = useTranslate();
    const record: ProfileWithTandems = useRecordContext();

    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    const isJokerLearningLanguage = isJoker(learningLanguage);
    const userIsFromCentralUniversity = record.user ? isCentralUniversity(record.user.university) : undefined;
    const hasActiveTandem =
        learningLanguage.tandem?.status === TandemStatus.ACTIVE ||
        learningLanguage.tandem?.status === TandemStatus.PAUSED;

    const hasTandemWaitingForValidation = learningLanguage.tandem?.status === TandemStatus.VALIDATED_BY_ONE_UNIVERSITY;

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
            <TabPanel key={learningLanguage.code} value={learningLanguage.code}>
                <Typography sx={{ marginTop: 4 }} variant="h3">
                    {translate('learning_languages.show.management.title')}
                </Typography>

                <Box className="tandem-management">
                    <ProfileCard
                        hasActiveTandem={hasActiveTandem}
                        learningLanguage={learningLanguage}
                        record={record}
                    />

                    <PartnerCard
                        compatibilityScore={learningLanguage.tandem.compatibilityScore}
                        partnerLearningLanguage={learningLanguage.tandem.learningLanguages[0]}
                        userLearningLanguage={learningLanguage}
                        userProfile={record}
                        hasActiveTandem
                    />

                    <TandemInfo
                        hasActiveTandem={hasActiveTandem}
                        partnerLearningLanguage={learningLanguage.tandem.learningLanguages[0]}
                        tandem={learningLanguage.tandem}
                        userLearningLanguage={learningLanguage}
                    />
                </Box>
            </TabPanel>
        );
    }

    if (learningLanguage.tandem && hasTandemWaitingForValidation) {
        const isUserValidationNeeded = !learningLanguage.tandem.universityValidations?.includes(identity?.universityId);

        return (
            <TabPanel key={learningLanguage.code} value={learningLanguage.code}>
                <Typography sx={{ marginTop: 4 }} variant="h3">
                    {translate('learning_languages.show.management.title')}
                </Typography>

                <Box className="tandem-management">
                    <ProfileCard
                        hasActiveTandem={hasActiveTandem}
                        learningLanguage={learningLanguage}
                        record={record}
                    />

                    <PartnerCard
                        compatibilityScore={learningLanguage.tandem.compatibilityScore}
                        hasTandemWaitingForValidation={hasTandemWaitingForValidation}
                        isUserValidationNeeded={isUserValidationNeeded}
                        partnerLearningLanguage={learningLanguage.tandem.learningLanguages[0]}
                        tandemId={learningLanguage.tandem.id}
                        userLearningLanguage={learningLanguage}
                        userProfile={record}
                    />

                    <TandemInfo tandem={learningLanguage.tandem} />
                </Box>
            </TabPanel>
        );
    }

    return (
        <TabPanel key={learningLanguage.code} value={learningLanguage.code}>
            <Typography sx={{ marginTop: 4 }} variant="h3">
                {translate('learning_languages.show.management.title')}
            </Typography>

            <Box className="tandem-management">
                <ProfileCard hasActiveTandem={hasActiveTandem} learningLanguage={learningLanguage} record={record} />

                <PartnerCard
                    compatibilityScore={learningLanguage.tandem?.compatibilityScore}
                    partnerLearningLanguage={learningLanguage.tandem?.learningLanguages[0]}
                    partnerType={PartnerType.BEST_OVERALL}
                    userLearningLanguage={learningLanguage}
                    userProfile={record}
                />

                <PartnerCard
                    compatibilityScore={bestMatch?.score.total}
                    currentTandemLearningLanguage={learningLanguage.tandem?.learningLanguages[0]}
                    partnerLearningLanguage={bestMatch?.target}
                    partnerType={PartnerType.BEST_MATCH}
                    userLearningLanguage={learningLanguage}
                    userProfile={record}
                />
            </Box>

            {!isLoadingMatches && matches && (
                <OtherProposals
                    currentTandemLearningLanguage={learningLanguage.tandem?.learningLanguages[0]}
                    isErrorMatches={isErrorMatches}
                    isJokerLearningLanguage={isJokerLearningLanguage}
                    isLoadingMatches={isLoadingMatches}
                    matches={matches.slice(1)}
                    userLearningLanguage={learningLanguage}
                />
            )}
        </TabPanel>
    );
};

export default LearningLanguageTabContent;
