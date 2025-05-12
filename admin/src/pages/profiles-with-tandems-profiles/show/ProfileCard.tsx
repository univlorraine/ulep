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

import { Box, Typography } from '@mui/material';
import React from 'react';
import { BooleanField, useTranslate } from 'react-admin';
import CustomAvatar from '../../../components/CustomAvatar';
import { DisplaySameTandem } from '../../../components/translated';
import UserStatusChips from '../../../components/UserStatusChips';
import WarningCircle from '../../../components/WarningCircle';
import { LearningLanguageWithTandemWithPartnerProfile } from '../../../entities/LearningLanguage';
import { ProfileWithTandemsProfiles } from '../../../entities/ProfileWithTandemsProfiles';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';
import ProfileLink from '../ui/ProfileLink';

type ProfileCardProps = {
    record: ProfileWithTandemsProfiles | undefined;
    learningLanguage: LearningLanguageWithTandemWithPartnerProfile;
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
                {record?.user?.status && <UserStatusChips status={record.user.status} />}
            </Box>
            {!hasActiveTandem && <Typography className="description" />}

            <div className="line profile-name">
                <CustomAvatar
                    avatarId={record?.user?.avatar?.id}
                    firstName={record?.user?.firstname}
                    lastName={record?.user?.lastname}
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
                    {translate(`global.genderValues.${record?.user?.gender?.toLowerCase()}`)}
                    {learningLanguage.sameGender && <WarningCircle />}
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.age')}</span>
                <span>
                    <Typography>{record?.user?.age}</Typography>
                    {learningLanguage.sameAge && <WarningCircle />}
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.list.tableColumns.university')}</span>
                <span>{record?.user?.university?.name}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.list.tableColumns.campus')}</span>
                <span>
                    {learningLanguage.campus ? (
                        learningLanguage.campus.name
                    ) : (
                        <BooleanField record={{ campus: learningLanguage.campus !== null }} source="campus" />
                    )}
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.learnedLanguage')}</span>
                <span>{codeLanguageToFlag(learningLanguage.code)}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.masteredLanguages')}</span>
                <span style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
                    <span>{codeLanguageToFlag(record?.nativeLanguage?.code)}</span>
                    {record?.masteredLanguages.map((language) => (
                        <span key={language.code}>{codeLanguageToFlag(language.code)}</span>
                    ))}
                </span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.level')}</span>
                <span>{learningLanguage.level}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.status')}</span>
                <span>{translate(`global.userStatus.${record?.user?.status?.toLowerCase()}`)}</span>
            </div>

            <div className="line">
                <span className="label">{translate('learning_languages.show.fields.role')}</span>
                <span>{translate(`learning_languages.roles.${record?.user?.role}`)}</span>
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
