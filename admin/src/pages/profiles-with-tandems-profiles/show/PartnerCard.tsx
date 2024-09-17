import { Box, Chip, Typography } from '@mui/material';
import { BooleanField, usePermissions, useRefresh, useTranslate } from 'react-admin';
import CustomAvatar from '../../../components/CustomAvatar';
import { DisplayLearningType, DisplaySameTandem } from '../../../components/translated';
import UserStatusChips from '../../../components/UserStatusChips';
import { LearningLanguage, LearningLanguageWithTandemWithPartnerProfile } from '../../../entities/LearningLanguage';
import { ProfileWithTandemsProfiles } from '../../../entities/ProfileWithTandemsProfiles';
import { TandemStatus, TandemWithPartnerLearningLanguage } from '../../../entities/Tandem';
import { UserStatus } from '../../../entities/User';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';
import isAgeCriterionMet from '../../../utils/isAgeCriterionMet';
import hasTandemManagementPermission from '../hasTandemManagementPermission';
import ProfileLink from '../ui/ProfileLink';
import TandemActions from './Actions/TandemActions';
import './show.css';

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
    partenerStatus?: UserStatus;
};

const ComponentTitle = ({ title, status }: { title: string; status: UserStatus | undefined }) => (
    <Box className="profile-header">
        <Typography variant="h4">{title}</Typography>
        {status && <UserStatusChips status={status} />}
    </Box>
);

const ComponentHeader = ({
    partnerType,
    hasTandemWaitingForValidation,
    hasActiveTandem,
    partenerStatus,
}: ComponentTitleProps) => {
    const translate = useTranslate();

    if (partnerType === PartnerType.BEST_OVERALL) {
        return (
            <>
                <ComponentTitle
                    status={partenerStatus}
                    title={`🏆 ${translate('learning_languages.show.management.best_tandem')}`}
                />
                <Typography className="description">
                    {translate('learning_languages.show.management.best_tandem_desc')}
                </Typography>
            </>
        );
    }
    if (partnerType === PartnerType.BEST_MATCH) {
        return (
            <>
                <ComponentTitle
                    status={partenerStatus}
                    title={`🪄 ${translate('learning_languages.show.management.best_match')}`}
                />
                <Typography className="description">
                    {translate('learning_languages.show.management.best_match_desc')}
                </Typography>
            </>
        );
    }
    if (hasTandemWaitingForValidation) {
        return (
            <ComponentTitle
                status={partenerStatus}
                title={translate('learning_languages.show.tandems.waitingValidation.title')}
            />
        );
    }
    if (hasActiveTandem) {
        return (
            <ComponentTitle
                status={partenerStatus}
                title={translate('learning_languages.show.management.current_tandem')}
            />
        );
    }

    return null;
};

type TandemCardProps = {
    partnerType?: PartnerType;
    partnerLearningLanguage: LearningLanguage | undefined;
    userProfile: ProfileWithTandemsProfiles;
    userLearningLanguage: LearningLanguageWithTandemWithPartnerProfile;
    compatibilityScore: number | undefined;
    hasActiveTandem?: boolean;
    isUserValidationNeeded?: boolean;
    hasTandemWaitingForValidation?: boolean;
    tandem?: TandemWithPartnerLearningLanguage;
};

const TandemCard = ({
    partnerType,
    partnerLearningLanguage,
    userLearningLanguage,
    userProfile,
    compatibilityScore,
    hasActiveTandem = false,
    isUserValidationNeeded = false,
    hasTandemWaitingForValidation = false,
    tandem,
}: TandemCardProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const { permissions } = usePermissions();

    return (
        <Box>
            <ComponentHeader
                hasActiveTandem={hasActiveTandem}
                hasTandemWaitingForValidation={hasTandemWaitingForValidation}
                partenerStatus={partnerLearningLanguage?.profile.user.status}
                partnerType={partnerType}
            />

            {(!partnerLearningLanguage ||
                (partnerType === PartnerType.BEST_OVERALL &&
                    tandem?.status === TandemStatus.INACTIVE &&
                    partnerLearningLanguage.profile.user.status !== UserStatus.BANNED)) && (
                <Box>{translate('learning_languages.show.tandems.globalSuggestions.noResult')}</Box>
            )}

            {partnerLearningLanguage && compatibilityScore && (
                <>
                    <div className="line profile-name">
                        <CustomAvatar
                            avatarId={partnerLearningLanguage.profile.user.avatar?.id}
                            firstName={partnerLearningLanguage.profile.user.firstname}
                            lastName={partnerLearningLanguage.profile.user.lastname}
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
                            {translate(
                                `global.genderValues.${partnerLearningLanguage.profile.user.gender.toLowerCase()}`
                            )}
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
                        <span className="label">{translate('learning_languages.list.tableColumns.campus')}</span>
                        <span>
                            {partnerLearningLanguage.campus ? (
                                partnerLearningLanguage.campus.name
                            ) : (
                                <BooleanField
                                    record={{ campus: partnerLearningLanguage.campus !== null }}
                                    source="campus"
                                />
                            )}
                        </span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.learnedLanguage')}</span>
                        <span>{codeLanguageToFlag(partnerLearningLanguage.code)}</span>
                    </div>

                    <div className="line">
                        <span className="label">{translate('learning_languages.show.fields.masteredLanguages')}</span>
                        <span style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
                            <span>{codeLanguageToFlag(partnerLearningLanguage.profile.nativeLanguage.code)}</span>
                            {partnerLearningLanguage.profile.masteredLanguages.map((language) => (
                                <span key={language.code}>{codeLanguageToFlag(language.code)}</span>
                            ))}
                        </span>
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
                            {translate(`learning_languages.roles.${partnerLearningLanguage.profile.user.role}`)}
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

                    {hasTandemManagementPermission(permissions) &&
                        !hasActiveTandem &&
                        !hasTandemWaitingForValidation && (
                            <TandemActions
                                learningLanguageIds={[userLearningLanguage.id, partnerLearningLanguage.id]}
                                onTandemAction={refresh}
                                relaunchGlobalRoutineOnAccept={
                                    !userLearningLanguage.tandem ||
                                    tandem?.partnerLearningLanguage.id !== partnerLearningLanguage.id
                                }
                                relaunchGlobalRoutineOnRefuse={
                                    tandem?.partnerLearningLanguage.id === partnerLearningLanguage.id
                                }
                            />
                        )}

                    {hasTandemManagementPermission(permissions) && isUserValidationNeeded && (
                        <TandemActions
                            learningLanguageIds={[userLearningLanguage.id, partnerLearningLanguage.id]}
                            onTandemAction={refresh}
                            tandemId={tandem?.id}
                            relaunchGlobalRoutineOnRefuse
                        />
                    )}
                </>
            )}
        </Box>
    );
};
export default TandemCard;
