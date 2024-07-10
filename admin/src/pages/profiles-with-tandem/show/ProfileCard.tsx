import { Box, Typography } from '@mui/material';
import React from 'react';
import { BooleanField, useTranslate } from 'react-admin';
import CustomAvatar from '../../../components/CustomAvatar';
import { DisplaySameTandem } from '../../../components/translated';
import UserStatusChips from '../../../components/UserStatusChips';
import WarningCircle from '../../../components/WarningCircle';
import { LearningLanguage } from '../../../entities/LearningLanguage';
import { ProfileWithTandems } from '../../../entities/Profile';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';
import ProfileLink from '../ui/ProfileLink';

type ProfileCardProps = {
    record: ProfileWithTandems;
    learningLanguage: LearningLanguage;
    hasActiveTandem: boolean;
};

const ProfileCard = ({ record, learningLanguage, hasActiveTandem }: ProfileCardProps) => {
    const translate = useTranslate();

    return (
        <Box className="profile">
            <Box className="profile-header">
                <Typography variant="h4">
                    {translate('learning_languages.show.management.applicant_profile')}
                </Typography>
                {record.user.status && <UserStatusChips status={record.user.status} />}
            </Box>
            {!hasActiveTandem && <Typography className="description" />}

            <div className="line profile-name">
                <CustomAvatar
                    avatarId={record.user.avatar?.id}
                    firstName={record.user.firstname}
                    lastName={record.user.lastname}
                    sx={{ width: '35px', height: '35px', fontSize: '1rem' }}
                />
                <ProfileLink profile={record} />
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.createdAt')}</span>
                <span>{new Date(learningLanguage.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.gender')}</span>
                <span>
                    {translate(`global.genderValues.${record.user.gender.toLowerCase()}`)}
                    {learningLanguage.sameGender && <WarningCircle />}
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.age')}</span>
                <span>
                    <Typography>{record.user.age}</Typography>
                    {learningLanguage.sameAge && <WarningCircle />}
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.list.tableColumns.university')}</span>
                <span>{record.user.university.name}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.learnedLanguage')}</span>
                <span>{codeLanguageToFlag(learningLanguage.code)}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.nativeLanguage')}</span>
                <span>{codeLanguageToFlag(record.nativeLanguage.code)}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.level')}</span>
                <span>{learningLanguage.level}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.status')}</span>
                <span>{translate(`global.userStatus.${record.user.status?.toLowerCase()}`)}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.role')}</span>
                <span>{translate(`learning_languages.roles.${record.user.role}`)}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.learningType')}</span>
                <span>{translate(`learning_languages.types.${learningLanguage.learningType}`)}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.sameTandemEmail')}</span>
                <span>
                    <DisplaySameTandem sameTandemEmail={learningLanguage.sameTandemEmail} />
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.sameGender')}</span>
                <span>
                    <BooleanField record={learningLanguage} source="sameGender" />
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.sameAge')}</span>
                <span>
                    <BooleanField record={learningLanguage} source="sameAge" />
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.certificateOption')}</span>
                <span>
                    <BooleanField
                        record={{
                            certificateOption: learningLanguage.certificateOption
                                ? learningLanguage.certificateOption
                                : false,
                        }}
                        source="certificateOption"
                    />
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.specificProgram')}</span>
                <span>
                    <BooleanField
                        record={{
                            specificProgram: learningLanguage.specificProgram
                                ? learningLanguage.specificProgram
                                : false,
                        }}
                        source="specificProgram"
                    />
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.hasPriority')}</span>
                <span>
                    <BooleanField
                        record={{
                            hasPriority: learningLanguage.hasPriority ? learningLanguage.hasPriority : false,
                        }}
                        source="hasPriority"
                    />
                </span>
            </div>
        </Box>
    );
};

export default ProfileCard;
