import { Box, Typography } from '@mui/material';
import React from 'react';

import { BooleanField, DateField, FunctionField, Show, TabbedShowLayout, TextField, useTranslate } from 'react-admin';
import CustomAvatar from '../../../components/CustomAvatar';
import { DisplayGender, DisplayLearningType, DisplayRole, DisplaySameTandem } from '../../../components/translated';
import WarningCircle from '../../../components/WarningCircle';
import Language from '../../../entities/Language';
import { LearningLanguage, getLearningLanguageUniversityAndCampusString } from '../../../entities/LearningLanguage';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';
import ProfileLink from '../ui/ProfileTandemLink';
import ShowTandems from './ShowTandems';

import './show.css';
// import TandemCard, { TandemType } from './TandemCard';

const LearningLanguageShow = () => {
    const translate = useTranslate();

    return (
        <Show>
            <FunctionField
                render={(data: LearningLanguage) => (
                    <Box sx={{ marginBottom: 2, '& .MuiTypography-h2': { color: 'black' } }}>
                        <ProfileLink profile={data.profile} variant="h2" />
                    </Box>
                )}
            />
            <TabbedShowLayout>
                <TabbedShowLayout.Tab label="Espagnol (en attente)">
                    <Typography sx={{ marginTop: 4 }} variant="h3">
                        {translate('learning_languages.show.management.title')}
                    </Typography>

                    <Box className="tandem-management">
                        <Box className="profile">
                            <Typography sx={{ marginBottom: 9 }} variant="h4">
                                {translate('learning_languages.show.management.applicant_profile')}
                            </Typography>
                            <FunctionField
                                render={(data: LearningLanguage) => (
                                    <div className="line profile-name">
                                        <CustomAvatar
                                            avatarId={data.profile.user.avatar?.id}
                                            firstName={data.profile.user.firstname}
                                            lastName={data.profile.user.lastname}
                                            sx={{ width: '35px', height: '35px', fontSize: '1rem' }}
                                        />
                                        <ProfileLink profile={data.profile} />
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={() => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.createdAt')}
                                        </span>
                                        <span>
                                            <DateField source="createdAt" />
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={(data: LearningLanguage) => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.gender')}
                                        </span>
                                        <span>
                                            <DisplayGender gender={data.profile?.user.gender} />
                                            {data.sameGender && <WarningCircle />}
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={(data: LearningLanguage) => (
                                    <div className="line">
                                        <span className="label">{translate('learning_languages.show.fields.age')}</span>
                                        <span>
                                            <TextField source="profile.user.age" />
                                            {data.sameGender && <WarningCircle />}
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={(data: LearningLanguage) => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.list.tableColumns.university')}
                                        </span>
                                        <span>{getLearningLanguageUniversityAndCampusString(data)}</span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={(record: Language) => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.list.tableColumns.learnedLanguage')}
                                        </span>
                                        <span>{codeLanguageToFlag(record.code)}</span>
                                    </div>
                                )}
                                source="code"
                            />
                            <FunctionField
                                render={() => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.level')}
                                        </span>
                                        <TextField
                                            label={translate('learning_languages.show.fields.level')}
                                            source="level"
                                        />
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={(data: LearningLanguage) => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.status')}
                                        </span>
                                        <span>
                                            {translate(`global.userStatus.${data.profile.user.status?.toLowerCase()}`)}
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={(data: LearningLanguage) => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.role')}
                                        </span>
                                        <span>
                                            <DisplayRole role={data.profile?.user.role} />
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={(data: LearningLanguage) => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.learningType')}
                                        </span>
                                        <span>
                                            <DisplayLearningType learningType={data.learningType} />
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={(data: LearningLanguage) => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.sameTandemEmail')}
                                        </span>
                                        <span>
                                            <DisplaySameTandem sameTandemEmail={data.sameTandemEmail} />
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={() => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.sameGender')}
                                        </span>
                                        <span>
                                            <BooleanField source="sameGender" />
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={() => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.sameAge')}
                                        </span>
                                        <span>
                                            <BooleanField source="sameAge" />
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={() => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.certificateOption')}
                                        </span>
                                        <span>
                                            <BooleanField source="certificateOption" />
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={() => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.specificProgram')}
                                        </span>
                                        <span>
                                            <BooleanField source="specificProgram" />
                                        </span>
                                    </div>
                                )}
                            />
                            <FunctionField
                                render={() => (
                                    <div className="line">
                                        <span className="label">
                                            {translate('learning_languages.show.fields.hasPriority')}
                                        </span>
                                        <span>
                                            <BooleanField source="hasPriority" />
                                        </span>
                                    </div>
                                )}
                            />
                        </Box>

                        {/*                         <TandemCard tandemType={TandemType.BEST_OVERALL} />
                        <TandemCard tandemType={TandemType.BEST_MATCH} /> */}
                    </Box>

                    <Box sx={{ padding: 2 }}>
                        <Typography sx={{ marginTop: 4 }} variant="h3">
                            {translate('learning_languages.show.other_proposals.title')}
                        </Typography>
                        <ShowTandems />
                    </Box>
                </TabbedShowLayout.Tab>
                <TabbedShowLayout.Tab label="Anglais (apparié)">Lorem ipsum</TabbedShowLayout.Tab>
            </TabbedShowLayout>
        </Show>
    );
};
export default LearningLanguageShow;
