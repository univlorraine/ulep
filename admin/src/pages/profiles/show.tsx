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

import { format } from 'date-fns/format';
import {
    ArrayField,
    BooleanField,
    usePermissions,
    useGetIdentity,
    ChipField,
    Datagrid,
    EditButton,
    FunctionField,
    Show,
    SingleFieldList,
    TabbedShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import ReferenceUploadFileField from '../../components/field/ReferenceUploadFileField';
import PageTitle from '../../components/PageTitle';
import { Role } from '../../entities/Administrator';
import Availabilites from '../../entities/Availabilities';
import Language from '../../entities/Language';
import { LearningLanguage } from '../../entities/LearningLanguage';
import { Profile } from '../../entities/Profile';
import User from '../../entities/User';
import useLimitedFeatures from '../../utils/useLimitedFeatures';
import CertificateModal from './CertificateModal';
import LogExportButton from './Export/LogExportButton';
import ProfileExportButton from './Export/ProfileExportButton';

const Title = () => {
    const record = useRecordContext();

    if (!record?.user) {
        return null;
    }

    return (
        <span>
            {record.user.firstname} {record.user.lastname}
        </span>
    );
};

export const ShowActions = () => {
    const recordContext = useRecordContext();

    const { permissions } = usePermissions();
    const identity = useGetIdentity();

    const adminUniversityId = identity.identity?.universityId;
    const adminUniversityIsCentral = identity.identity?.isCentralUniversity;
    const profileUniversityId = recordContext?.user?.university?.id;

    const actionsRestricted = !adminUniversityIsCentral && adminUniversityId !== profileUniversityId;
    const readOnly: boolean = permissions.checkRole(Role.ANIMATOR);

    return (
        <TopToolbar>
            {!actionsRestricted && (
                <>
                    <ProfileExportButton />
                    {!readOnly && <EditButton />}
                </>
            )}
        </TopToolbar>
    );
};

const ProfileTab = () => {
    const translate = useTranslate();
    const recordContext = useRecordContext();
    const limitedFeatures = useLimitedFeatures();

    return (
        <TabbedShowLayout syncWithLocation={false}>
            <TabbedShowLayout.Tab
                contentClassName="tab"
                label={translate('profiles.summary')}
                sx={{
                    '& .RaTabbedShowLayout-content': {
                        margin: 3,
                    },
                }}
            >
                <TextField label={translate('global.email')} source="user.email" />
                <TextField label={translate('global.firstname')} source="user.firstname" />
                <TextField label={translate('global.lastname')} source="user.lastname" />
                <TextField label={translate('global.age')} source="user.age" />
                <FunctionField
                    label={translate('global.gender')}
                    render={(record: Profile) => translate(`global.genderValues.${record.user.gender.toLowerCase()}`)}
                />
                <TextField label={translate('global.university')} source="user.university.name" />
                <FunctionField
                    label={translate('profiles.contact')}
                    render={(record: Profile) =>
                        record.user.contact
                            ? `${record.user.contact.firstname} ${record.user.contact.lastname}`
                            : translate('profiles.noContact')
                    }
                />
                <FunctionField
                    label={translate('learning_languages.show.fields.status')}
                    render={(record: { user: User }) =>
                        translate(`global.userStatus.${record.user.status?.toLowerCase()}`)
                    }
                />
                <FunctionField
                    label={translate('global.role')}
                    render={(record: { user: User }) => translate(`global.${record.user.role.toLowerCase()}`)}
                    source="user.role"
                />
                {recordContext?.user?.division && (
                    <TextField label={translate('profiles.division')} source="user.division" />
                )}
                {recordContext?.user?.role === 'STUDENT' && recordContext?.user?.diploma && (
                    <TextField label={translate('profiles.diploma')} source="user.diploma" />
                )}
                {recordContext?.user?.role === 'STAFF' && recordContext?.user?.staffFunction && (
                    <TextField label={translate('profiles.staffFunction')} source="user.staffFunction" />
                )}
                <TextField label={translate('global.university')} source="user.university.name" />
                <ArrayField label={translate('profiles.objectives')} source="objectives">
                    <SingleFieldList linkType={false}>
                        <ChipField clickable={false} source="name" />
                    </SingleFieldList>
                </ArrayField>
                <FunctionField
                    label={translate('profiles.frequency')}
                    render={(record: { meetingFrequency: MeetFrequency }) =>
                        translate(`profiles.frequencies.${record.meetingFrequency}`)
                    }
                    source="meetingFrequency"
                />
                <ArrayField label={translate('profiles.interests')} sortable={false} source="interests">
                    <SingleFieldList linkType={false}>
                        <ChipField clickable={false} source="name" />
                    </SingleFieldList>
                </ArrayField>
            </TabbedShowLayout.Tab>

            <TabbedShowLayout.Tab contentClassName="tab" label={translate('profiles.language_title')}>
                <FunctionField
                    label={translate('profiles.native_language')}
                    render={(record: Profile) => translate(`languages_code.${record.nativeLanguage.code}`)}
                />
                <ArrayField
                    label={translate('profiles.mastered_languages')}
                    sortable={false}
                    source="masteredLanguages"
                >
                    <SingleFieldList>
                        <FunctionField
                            render={(record: Language) => (
                                <ChipField
                                    record={{ name: translate(`languages_code.${record.code}`) }}
                                    source="name"
                                />
                            )}
                        />
                    </SingleFieldList>
                </ArrayField>
                <ArrayField source="learningLanguages">
                    <Datagrid
                        bulkActionButtons={false}
                        rowClick={() => `/profiles/with-tandems-profiles/${recordContext?.id}/show`}
                    >
                        <FunctionField
                            render={(record: Pick<LearningLanguage, 'name' | 'code'>) =>
                                translate(`languages_code.${record.code}`)
                            }
                            sortable={false}
                            source="name"
                        />
                        <TextField sortable={false} source="level" />
                        <BooleanField
                            label={translate('learning_languages.show.fields.hasPriority')}
                            sortable={false}
                            source="hasPriority"
                        />
                        <BooleanField
                            label={translate('learning_languages.show.fields.learningJournal')}
                            sortable={false}
                            source="learningJournal"
                        />
                        <BooleanField
                            label={translate('learning_languages.show.fields.consultingInterview')}
                            sortable={false}
                            source="consultingInterview"
                        />
                        <BooleanField
                            label={translate('learning_languages.show.fields.sharedCertificate')}
                            sortable={false}
                            source="sharedCertificate"
                        />
                        <FunctionField
                            render={(record: Pick<LearningLanguage, 'id' | 'code' | 'sharedLogsDate'>) =>
                                record.sharedLogsDate ? (
                                    <>
                                        {format(record.sharedLogsDate, 'dd/MM/yyyy')}
                                        <LogExportButton languageCode={record.code} learningLanguageId={record.id} />
                                    </>
                                ) : (
                                    ''
                                )
                            }
                            sortable={false}
                            source="sharedLogsDate"
                        />
                        <FunctionField
                            render={(record: Pick<LearningLanguage, 'id' | 'code' | 'sharedLogsForResearchDate'>) =>
                                record.sharedLogsForResearchDate ? (
                                    <>
                                        {format(record.sharedLogsForResearchDate, 'dd/MM/yyyy')}
                                        <LogExportButton languageCode={record.code} learningLanguageId={record.id} />
                                    </>
                                ) : (
                                    ''
                                )
                            }
                            sortable={false}
                            source="sharedLogsForResearchDate"
                        />
                        {!limitedFeatures && (
                            <>
                                <ReferenceUploadFileField
                                    label={translate('learning_languages.show.fields.certificateFile')}
                                    sortable={false}
                                    source="certificateFile.id"
                                />

                                <CertificateModal profile={recordContext as Profile} />
                            </>
                        )}
                    </Datagrid>
                </ArrayField>
            </TabbedShowLayout.Tab>

            <TabbedShowLayout.Tab contentClassName="tab" label={translate('profiles.biography.title')}>
                <TextField label={translate('profiles.biography.superpower')} source="biography.superpower" />
                <TextField label={translate('profiles.biography.favorite_place')} source="biography.favoritePlace" />
                <TextField label={translate('profiles.biography.experience')} source="biography.experience" />
                <TextField label={translate('profiles.biography.anecdote')} source="biography.anecdote" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab contentClassName="tab" label={translate('profiles.availabilities')}>
                <FunctionField
                    label={translate('days.monday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.monday}`)
                    }
                    source="availabilities.monday"
                />
                <FunctionField
                    label={translate('days.tuesday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.tuesday}`)
                    }
                    source="availabilities.tuesday"
                />
                <FunctionField
                    label={translate('days.wednesday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.wednesday}`)
                    }
                    source="availabilities.wednesday"
                />
                <FunctionField
                    label={translate('days.thursday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.thursday}`)
                    }
                    source="availabilities.thursday"
                />
                <FunctionField
                    label={translate('days.friday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.friday}`)
                    }
                    source="availabilities.friday"
                />
                <FunctionField
                    label={translate('days.saturday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.saturday}`)
                    }
                    source="availabilities.saturday"
                />
                <FunctionField
                    label={translate('days.sunday')}
                    render={(record: { availabilities: Availabilites }) =>
                        translate(`profiles.availabilities_occurence.${record.availabilities.sunday}`)
                    }
                    source="availabilities.sunday"
                />
                <TextField label={translate('profiles.availabilities_note')} source="availabilitiesNote" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
};

const ProfileShow = (props: any) => {
    const translate = useTranslate();

    return (
        <>
            <PageTitle>{translate('profiles.title')}</PageTitle>

            <Show actions={<ShowActions />} title={<Title />} {...props}>
                <ProfileTab />
            </Show>
        </>
    );
};

export default ProfileShow;
