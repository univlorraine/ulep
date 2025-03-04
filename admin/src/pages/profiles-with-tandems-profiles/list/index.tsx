import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import {
    AutocompleteInput,
    Datagrid,
    FilterButton,
    FunctionField,
    List,
    Loading,
    SelectInput,
    TextInput,
    TopToolbar,
    useDataProvider,
    useGetIdentity,
    useGetList,
    useNotify,
    usePermissions,
    useRefresh,
    useTranslate,
} from 'react-admin';
import ColoredChips, { ChipsColors } from '../../../components/ColoredChips';
import PageTitle from '../../../components/PageTitle';
import UserStatusChips from '../../../components/UserStatusChips';
import { Role } from '../../../entities/Administrator';
import { LearningLanguageWithTandemWithPartnerProfile, LearningType } from '../../../entities/LearningLanguage';
import { getProfileDisplayName } from '../../../entities/Profile';
import { ProfileWithTandemsProfiles } from '../../../entities/ProfileWithTandemsProfiles';
import { TandemStatus, WithoutTandem } from '../../../entities/Tandem';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';
import isAgeCriterionMet from '../../../utils/isAgeCriterionMet';
import hasTandemManagementPermission from '../hasTandemManagementPermission';
import TandemActions from '../show/Actions/TandemActions';
import ProfileTandemDetailLink from '../ui/ProfileTandemDetailLink';
import ProfileTandemLink from '../ui/ProfileTandemLink';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import PairingActions from './PairingActions';
import SelectedLearningLanguageAction from './SelectedLearningLanguageAction';

import './list.css';

const TandemStatusComponent = ({ status }: { status: string }) => {
    const translate = useTranslate();

    const colors: Record<string, ChipsColors> = {
        INACTIVE: 'default',
        DRAFT: 'warning',
        VALIDATED_BY_ONE_UNIVERSITY: 'secondary',
        PAUSED: 'info',
        ACTIVE: 'success',
    };

    return <ColoredChips color={colors[status]} label={translate(`learning_languages.status.${status}`)} />;
};

const LearningLanguageList = () => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const { selectedUniversityIds, setSelectedUniversityIds } = useLearningLanguagesStore();
    const { permissions } = usePermissions();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { data: languages } = useGetList('languages', {
        pagination: {
            page: 1,
            perPage: 9999,
        },
    });
    const { data: universities } = useGetList('universities', {
        sort: {
            field: 'name',
            order: 'ASC',
        },
    });
    const [selectedLearningLanguages, setSelectedLearningLanguages] = useState<string[]>([]);
    const [universityDivisions, setUniversityDivisions] = useState<string[]>([]);

    const fetchUniversityDivisions = async (universityId: string) => {
        const response = await dataProvider.getUniversityDivisions(universityId);

        if (response instanceof Error) {
            notify(translate('learning_languages.filters.division.fetchError'));
        }

        return setUniversityDivisions(response);
    };

    useEffect(() => {
        if (identity && identity.isCentralUniversity) {
            fetchUniversityDivisions(identity.universityId);
        }
    }, [identity]);

    const filters = [
        <TextInput
            key="userLastname"
            label={translate('learning_languages.list.filters.user_lastname.label')}
            source="user.lastname"
            alwaysOn
        />,
        <AutocompleteInput
            key="learningLanguage"
            choices={languages?.map((language) => ({
                id: language.id,
                name: `${codeLanguageToFlag(language.code)}`,
            }))}
            label={translate('learning_languages.list.filters.learningLanguage.label')}
            source="learningLanguage"
            alwaysOn
        />,
        <SelectInput
            key="learningTypeFilter"
            choices={[
                ...Object.values(TandemStatus).map((tandemStatus) => ({
                    id: tandemStatus,
                    name: translate(`learning_languages.status.${tandemStatus}`),
                })),
                ...Object.values(WithoutTandem).map((value) => ({
                    id: value,
                    name: translate(`learning_languages.status.${value}`),
                })),
            ]}
            label={translate('learning_languages.list.filters.tandem.label')}
            source="tandemStatus"
            alwaysOn
        />,
    ];

    if (identity?.isCentralUniversity && universities && universityDivisions) {
        filters.unshift(
            <SelectInput
                key="universityFilter"
                choices={universities}
                label={translate('learning_languages.list.filters.university.label')}
                source="user.university"
                alwaysOn
            />,
            <SelectInput
                key="learningTypeFilter"
                choices={Object.values(LearningType).map((learningType) => ({
                    id: learningType,
                    name: translate(`learning_languages.types.${learningType}`),
                }))}
                label={translate('learning_languages.list.filters.learningType.label')}
                source="learningType"
                alwaysOn
            />,
            <AutocompleteInput
                key="division"
                choices={universityDivisions?.map((division) => ({
                    id: division,
                    name: division,
                }))}
                label={translate('learning_languages.list.filters.division.label')}
                source="user.division"
                sx={{ width: '250px' }}
                alwaysOn
            />
        );
    }

    const handleLearningLanguageSelection = (learningLanguageId: string) => {
        if (selectedLearningLanguages.includes(learningLanguageId)) {
            setSelectedLearningLanguages(selectedLearningLanguages.filter((id) => id !== learningLanguageId));
        } else {
            setSelectedLearningLanguages([...selectedLearningLanguages, learningLanguageId]);
        }
    };

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <Box className="profiles-with-tandem-list">
            <PageTitle>{translate('learning_languages.title')}</PageTitle>
            {identity.isCentralUniversity && permissions.checkRole(Role.SUPER_ADMIN) && (
                <PairingActions
                    onGlobalRoutineEnded={refresh}
                    selectedUniversityIds={selectedUniversityIds}
                    setSelectedUniversityIds={setSelectedUniversityIds}
                    universityIds={[...selectedUniversityIds, identity.universityId]}
                />
            )}
            <List<ProfileWithTandemsProfiles>
                actions={
                    <TopToolbar>
                        <FilterButton disableSaveQuery />
                    </TopToolbar>
                }
                exporter={false}
                filter={{
                    university: identity?.isCentralUniversity ? undefined : identity.universityId,
                }}
                filters={filters}
            >
                <Datagrid bulkActionButtons={false}>
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.name')}
                        render={(record: ProfileWithTandemsProfiles) => (
                            <>
                                <Box className="line profile">
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <ProfileTandemLink profile={record} variant="subtitle1" />
                                        <Typography sx={{ color: '#767676' }}>{record.user.university.name}</Typography>
                                    </Box>
                                </Box>
                                {record.learningLanguages.map((learningLanguage) => {
                                    if (learningLanguage.tandem) {
                                        return (
                                            <Box key={learningLanguage.code} className="line tandem profile">
                                                {learningLanguage.tandem.status !== TandemStatus.ACTIVE && (
                                                    <Checkbox
                                                        checked={selectedLearningLanguages.includes(
                                                            learningLanguage.id
                                                        )}
                                                        onChange={() =>
                                                            handleLearningLanguageSelection(learningLanguage.id)
                                                        }
                                                    />
                                                )}
                                                {learningLanguage.tandem.status === TandemStatus.ACTIVE && (
                                                    <PeopleAltIcon
                                                        color="disabled"
                                                        fontSize="small"
                                                        sx={{ margin: '10px' }}
                                                    />
                                                )}
                                                <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                        {getProfileDisplayName(
                                                            learningLanguage.tandem.partnerLearningLanguage.profile
                                                        )}{' '}
                                                        (
                                                        {codeLanguageToFlag(
                                                            learningLanguage.tandem.partnerLearningLanguage.profile
                                                                .nativeLanguage.code
                                                        )}
                                                        )
                                                        <Typography sx={{ color: '#767676' }}>
                                                            {
                                                                learningLanguage.tandem.partnerLearningLanguage.profile
                                                                    .user.university.name
                                                            }
                                                        </Typography>
                                                    </Box>
                                                    <UserStatusChips
                                                        status={
                                                            learningLanguage.tandem.partnerLearningLanguage.profile.user
                                                                .status
                                                        }
                                                    />
                                                </Box>
                                            </Box>
                                        );
                                    }

                                    return (
                                        <Box key={learningLanguage.code} className="line tandem profile">
                                            <Checkbox
                                                checked={selectedLearningLanguages.includes(learningLanguage.id)}
                                                onChange={() => handleLearningLanguageSelection(learningLanguage.id)}
                                            />
                                            {translate('learning_languages.list.noTandem')}{' '}
                                            {codeLanguageToFlag(learningLanguage.code)}
                                        </Box>
                                    );
                                })}
                            </>
                        )}
                        sortable={false}
                        source="profile.user.university"
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.learnedLanguage')}
                        render={(record: ProfileWithTandemsProfiles) => (
                            <>
                                <Box className="line">
                                    {record.learningLanguages.map(
                                        (learningLanguage: LearningLanguageWithTandemWithPartnerProfile) => (
                                            <ColoredChips
                                                key={learningLanguage.code}
                                                color="default"
                                                label={codeLanguageToFlag(learningLanguage.code)}
                                            />
                                        )
                                    )}
                                </Box>
                                {record.learningLanguages.map(
                                    (learningLanguage: LearningLanguageWithTandemWithPartnerProfile) => {
                                        if (learningLanguage.tandem) {
                                            return (
                                                <Box key={learningLanguage.code} className="line tandem">
                                                    <ColoredChips
                                                        key={learningLanguage.code}
                                                        color="default"
                                                        label={codeLanguageToFlag(learningLanguage.code)}
                                                    />
                                                </Box>
                                            );
                                        }

                                        return <Box key={learningLanguage.code} className="line tandem" />;
                                    }
                                )}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.age')}
                        render={(record: ProfileWithTandemsProfiles) => (
                            <>
                                <Box className="line">
                                    <ColoredChips color="default" label={record.user.age} variant="outlined" />
                                </Box>
                                {record.learningLanguages.map(
                                    (learningLanguage: LearningLanguageWithTandemWithPartnerProfile) => {
                                        if (learningLanguage.tandem) {
                                            const criterionColor = isAgeCriterionMet(
                                                record.user.age,
                                                learningLanguage.tandem.partnerLearningLanguage.profile.user.age
                                            )
                                                ? 'success'
                                                : 'error';
                                            const isAgeCritetionNeeded = learningLanguage.sameAge
                                                ? criterionColor
                                                : 'success';

                                            return (
                                                <Box key={learningLanguage.code} className="line tandem">
                                                    <ColoredChips
                                                        key={learningLanguage.code}
                                                        color={isAgeCritetionNeeded}
                                                        label={
                                                            learningLanguage.tandem.partnerLearningLanguage.profile.user
                                                                .age
                                                        }
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            );
                                        }

                                        return <Box key={learningLanguage.code} className="line tandem" />;
                                    }
                                )}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.role')}
                        render={(record: ProfileWithTandemsProfiles) => (
                            <>
                                <Box className="line">
                                    <ColoredChips
                                        color="default"
                                        label={translate(`learning_languages.roles.${record.user.role}`)}
                                        variant="outlined"
                                    />
                                </Box>
                                {record.learningLanguages.map(
                                    (learningLanguage: LearningLanguageWithTandemWithPartnerProfile) => {
                                        if (learningLanguage.tandem) {
                                            return (
                                                <Box key={learningLanguage.code} className="line tandem">
                                                    <ColoredChips
                                                        key={learningLanguage.code}
                                                        color={
                                                            record.user.role ===
                                                            learningLanguage.tandem.partnerLearningLanguage.profile.user
                                                                .role
                                                                ? 'success'
                                                                : 'error'
                                                        }
                                                        label={translate(
                                                            `learning_languages.roles.${learningLanguage.tandem.partnerLearningLanguage.profile.user.role}`
                                                        )}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            );
                                        }

                                        return <Box key={learningLanguage.code} className="line tandem" />;
                                    }
                                )}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.score')}
                        render={(record: ProfileWithTandemsProfiles) => (
                            <>
                                <Box className="line" />
                                {record.learningLanguages.map(
                                    (learningLanguage: LearningLanguageWithTandemWithPartnerProfile) => {
                                        if (learningLanguage.tandem) {
                                            return (
                                                <Box key={learningLanguage.code} className="line tandem">
                                                    {(learningLanguage.tandem.compatibilityScore * 100).toFixed(0)}%
                                                </Box>
                                            );
                                        }

                                        return <Box key={learningLanguage.code} className="line tandem" />;
                                    }
                                )}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.type')}
                        render={(record: ProfileWithTandemsProfiles) => (
                            <>
                                <Box className="line" />
                                {record.learningLanguages.map(
                                    (learningLanguage: LearningLanguageWithTandemWithPartnerProfile) => {
                                        if (learningLanguage.tandem) {
                                            return (
                                                <Box key={learningLanguage.code} className="line tandem">
                                                    {translate(
                                                        `learning_languages.types.${learningLanguage.tandem.learningType}`
                                                    )}
                                                </Box>
                                            );
                                        }

                                        return (
                                            <Box key={learningLanguage.code} className="line tandem">
                                                {translate(`learning_languages.types.${learningLanguage.learningType}`)}
                                            </Box>
                                        );
                                    }
                                )}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.pairing')}
                        render={(record: ProfileWithTandemsProfiles) => (
                            <>
                                <Box className="line" />
                                {record.learningLanguages.map(
                                    (learningLanguage: LearningLanguageWithTandemWithPartnerProfile) => {
                                        if (learningLanguage.tandem) {
                                            return (
                                                <Box key={learningLanguage.code} className="line tandem">
                                                    <TandemStatusComponent status={learningLanguage.tandem.status} />
                                                </Box>
                                            );
                                        }

                                        return <Box key={learningLanguage.code} className="line tandem" />;
                                    }
                                )}
                            </>
                        )}
                    />
                    {hasTandemManagementPermission(permissions) && (
                        <FunctionField
                            label={translate('learning_languages.list.tableColumns.actions')}
                            render={(record: ProfileWithTandemsProfiles) => (
                                <>
                                    <Box className="line" />
                                    {record.learningLanguages.map(
                                        (learningLanguage: LearningLanguageWithTandemWithPartnerProfile) => {
                                            if (
                                                learningLanguage.tandem &&
                                                learningLanguage.tandem.status !== TandemStatus.ACTIVE &&
                                                learningLanguage.tandem.status !== TandemStatus.PAUSED
                                            ) {
                                                return (
                                                    <Box key={learningLanguage.code} className="line">
                                                        <TandemActions
                                                            disableCreateButton={
                                                                learningLanguage.tandem.status ===
                                                                    TandemStatus.VALIDATED_BY_ONE_UNIVERSITY &&
                                                                learningLanguage.tandem.universityValidations?.includes(
                                                                    identity.universityId
                                                                )
                                                            }
                                                            learningLanguageIds={[
                                                                learningLanguage.id,
                                                                learningLanguage.tandem.partnerLearningLanguage.id,
                                                            ]}
                                                            onTandemAction={refresh}
                                                            relaunchGlobalRoutineOnAccept={
                                                                !learningLanguage.tandem ||
                                                                learningLanguage?.id !==
                                                                    learningLanguage.tandem.partnerLearningLanguage.id
                                                            }
                                                            relaunchGlobalRoutineOnRefuse={
                                                                learningLanguage?.id ===
                                                                learningLanguage.tandem.partnerLearningLanguage.id
                                                            }
                                                            tandemId={
                                                                learningLanguage.tandem.status ===
                                                                TandemStatus.VALIDATED_BY_ONE_UNIVERSITY
                                                                    ? learningLanguage.tandem?.id
                                                                    : undefined
                                                            }
                                                            tandemStatus={learningLanguage.tandem?.status}
                                                        />
                                                    </Box>
                                                );
                                            }

                                            if (
                                                learningLanguage.tandem &&
                                                (learningLanguage.tandem.status === TandemStatus.ACTIVE ||
                                                    learningLanguage.tandem.status === TandemStatus.PAUSED)
                                            ) {
                                                return (
                                                    <Box key={learningLanguage.code} className="line">
                                                        <TandemActions
                                                            learningLanguageIds={[
                                                                learningLanguage.id,
                                                                learningLanguage.tandem.partnerLearningLanguage.id,
                                                            ]}
                                                            onTandemAction={refresh}
                                                            tandemId={learningLanguage.tandem?.id}
                                                            tandemStatus={learningLanguage.tandem?.status}
                                                            disableCreateButton
                                                            relaunchGlobalRoutineOnRefuse
                                                        />
                                                    </Box>
                                                );
                                            }

                                            return <Box key={learningLanguage.code} className="line tandem" />;
                                        }
                                    )}
                                </>
                            )}
                        />
                    )}
                    <FunctionField
                        render={(record: ProfileWithTandemsProfiles) => (
                            <>
                                <Box className="line" />
                                {record.learningLanguages.map(
                                    (learningLanguage: LearningLanguageWithTandemWithPartnerProfile) => (
                                        <Box key={learningLanguage.code} className="line">
                                            <ProfileTandemDetailLink
                                                learningLanguageCode={learningLanguage.code}
                                                profile={record}
                                            />
                                        </Box>
                                    )
                                )}
                            </>
                        )}
                    />
                </Datagrid>
            </List>
            {selectedLearningLanguages.length > 0 && (
                <SelectedLearningLanguageAction
                    selectedLearningLanguages={selectedLearningLanguages}
                    setSelectedLearningLanguages={setSelectedLearningLanguages}
                />
            )}
        </Box>
    );
};

export default LearningLanguageList;
