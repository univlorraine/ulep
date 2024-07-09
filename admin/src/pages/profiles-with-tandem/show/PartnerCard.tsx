import { Box, Chip, Typography } from '@mui/material';
import React from 'react';

import { BooleanField, useRefresh, useTranslate } from 'react-admin';
import CustomAvatar from '../../../components/CustomAvatar';
import { DisplayGender, DisplayLearningType, DisplayRole, DisplaySameTandem } from '../../../components/translated';
import { LearningLanguage } from '../../../entities/LearningLanguage';
import { ProfileWithTandems } from '../../../entities/Profile';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';

import './show.css';
import isAgeCriterionMet from '../../../utils/isAgeCriterionMet';
import ProfileLink from '../../learning-languages/ui/ProfileLink';
import TandemActions from './Actions/TandemActions';

export enum PartnerType {
    BEST_OVERALL = 'bestOverall',
    BEST_MATCH = 'bestMatch',
}

const ChipsElement = ({ isOk }: { isOk: boolean }) => {
    const translate = useTranslate();

    return isOk ? (
        <Chip color="success" label={translate('learning_languages.show.management.ok')} />
    ) : (
        <Chip color="warning" label={translate('learning_languages.show.management.no')} />
    );
};

type ComponentTitleProps = {
    partnerType?: PartnerType;
    hasTandemWaitingForValidation?: boolean;
    hasActiveTandem?: boolean;
};

const ComponentTitle = ({ partnerType, hasTandemWaitingForValidation, hasActiveTandem }: ComponentTitleProps) => {
    const translate = useTranslate();

    if (partnerType === PartnerType.BEST_OVERALL) {
        return (
            <>
                <Typography variant="h4">🏆 {translate('learning_languages.show.management.best_tandem')}</Typography>
                <Typography className="description">
                    {translate('learning_languages.show.management.best_tandem_desc')}
                </Typography>
            </>
        );
    }
    if (partnerType === PartnerType.BEST_MATCH) {
        return (
            <>
                <Typography variant="h4">🪄 {translate('learning_languages.show.management.best_match')}</Typography>
                <Typography className="description">
                    {translate('learning_languages.show.management.best_match_desc')}
                </Typography>
            </>
        );
    }
    if (hasTandemWaitingForValidation) {
        return (
            <Typography variant="h4">{translate('learning_languages.show.tandems.waitingValidation.title')}</Typography>
        );
    }
    if (hasActiveTandem) {
        return <Typography variant="h4">{translate('learning_languages.show.management.current_tandem')}</Typography>;
    }

    return null;
};

type TandemCardProps = {
    partnerType?: PartnerType;
    partnerLearningLanguage: LearningLanguage | undefined;
    userProfile: ProfileWithTandems;
    userLearningLanguage: LearningLanguage;
    compatibilityScore: number | undefined;
    currentTandemLearningLanguage?: LearningLanguage | undefined;
    hasActiveTandem?: boolean;
    isUserValidationNeeded?: boolean;
    hasTandemWaitingForValidation?: boolean;
    tandemId?: string;
};

const TandemCard = ({
    partnerType,
    partnerLearningLanguage,
    userLearningLanguage,
    userProfile,
    compatibilityScore,
    currentTandemLearningLanguage,
    hasActiveTandem = false,
    isUserValidationNeeded = false,
    hasTandemWaitingForValidation = false,
    tandemId,
}: TandemCardProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();

    return (
        <Box>
            <ComponentTitle
                hasActiveTandem={hasActiveTandem}
                hasTandemWaitingForValidation={hasTandemWaitingForValidation}
                partnerType={partnerType}
            />

            {!partnerLearningLanguage && (
                <Box>{translate('learning_languages.show.tandems.globalSuggestions.noResult')}</Box>
            )}

            {partnerLearningLanguage && compatibilityScore && (
                <>
                    <div className="line profile-name">
                        <CustomAvatar
                            avatarId="null"
                            firstName="Pablo"
                            lastName="Costa"
                            sx={{ width: '35px', height: '35px', fontSize: '1rem' }}
                        />
                        <ProfileLink profile={partnerLearningLanguage.profile} />
                    </div>

                    <div className="line">
                        <span className="label">
                            <Typography>{translate('learning_languages.show.fields.score')}</Typography>
                        </span>
                        <span>
                            <Typography>{(compatibilityScore * 100).toFixed(0)}%</Typography>
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.gender')}</span>
                        <span className="value">
                            <DisplayGender gender={partnerLearningLanguage.profile.user.gender} />
                            <ChipsElement
                                isOk={
                                    userLearningLanguage.sameGender
                                        ? partnerLearningLanguage.profile.user.gender === userProfile.user.gender
                                        : true
                                }
                            />
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.age')}</span>
                        <span className="value">
                            {partnerLearningLanguage.profile.user.age}
                            <ChipsElement
                                isOk={
                                    userLearningLanguage.sameAge
                                        ? isAgeCriterionMet(
                                              userProfile.user.age,
                                              partnerLearningLanguage.profile.user.age
                                          )
                                        : true
                                }
                            />
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.list.tableColumns.university')}</span>
                        <span>{partnerLearningLanguage.profile.user.university.name}</span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.learnedLanguage')}</span>
                        <span>{codeLanguageToFlag(partnerLearningLanguage.code)}</span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.nativeLanguage')}</span>
                        <span>{codeLanguageToFlag(partnerLearningLanguage.profile.nativeLanguage.code)}</span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.level')}</span>
                        <span>{partnerLearningLanguage.level}</span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.status')}</span>
                        <span>
                            {translate(
                                `global.userStatus.${partnerLearningLanguage.profile.user.status?.toLowerCase()}`
                            )}
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.role')}</span>
                        <span>
                            <DisplayRole role={partnerLearningLanguage.profile.user.role} />
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.learningType')}</span>
                        <span>
                            <DisplayLearningType learningType={partnerLearningLanguage.learningType} />
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.sameTandemEmail')}</span>
                        <span>
                            <DisplaySameTandem sameTandemEmail={partnerLearningLanguage.sameTandemEmail} />
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.sameGender')}</span>
                        <span>
                            <BooleanField
                                record={{ sameGender: partnerLearningLanguage.sameGender }}
                                source="sameGender"
                            />
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.sameAge')}</span>
                        <span>
                            <BooleanField record={{ sameAge: partnerLearningLanguage.sameAge }} source="sameAge" />
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.certificateOption')}</span>
                        <span>
                            <BooleanField
                                record={{ certificateOption: partnerLearningLanguage.certificateOption }}
                                source="certificateOption"
                            />
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.specificProgram')}</span>
                        <span>
                            <BooleanField
                                record={{ specificProgram: partnerLearningLanguage.specificProgram }}
                                source="specificProgram"
                            />
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.hasPriority')}</span>
                        <span>
                            <BooleanField
                                record={{ hasPriority: partnerLearningLanguage.hasPriority }}
                                source="hasPriority"
                            />
                        </span>
                    </div>

                    {!hasActiveTandem && !hasTandemWaitingForValidation && (
                        <TandemActions
                            learningLanguageIds={[userLearningLanguage.id, partnerLearningLanguage.id]}
                            onTandemAction={() => refresh()}
                            relaunchGlobalRoutineOnAccept={
                                !userLearningLanguage.tandem ||
                                currentTandemLearningLanguage?.id !== partnerLearningLanguage.id
                            }
                            relaunchGlobalRoutineOnRefuse={
                                currentTandemLearningLanguage?.id === partnerLearningLanguage.id
                            }
                        />
                    )}

                    {isUserValidationNeeded && (
                        <TandemActions
                            learningLanguageIds={[userLearningLanguage.id, partnerLearningLanguage.id]}
                            onTandemAction={() => refresh()}
                            tandemId={tandemId}
                            relaunchGlobalRoutineOnRefuse
                        />
                    )}
                </>
            )}
        </Box>
    );
};
export default TandemCard;
