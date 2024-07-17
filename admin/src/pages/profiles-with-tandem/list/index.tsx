import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, Typography } from '@mui/material';
import {
    Datagrid,
    FilterButton,
    FunctionField,
    List,
    Loading,
    SelectInput,
    TextInput,
    TopToolbar,
    useGetIdentity,
    useGetList,
    useRefresh,
    useTranslate,
} from 'react-admin';
import ColoredChips, { ChipsColors } from '../../../components/ColoredChips';
import PageTitle from '../../../components/PageTitle';
import { LearningLanguage } from '../../../entities/LearningLanguage';
import { ProfileWithTandems, getProfileDisplayName } from '../../../entities/Profile';
import codeLanguageToFlag from '../../../utils/codeLanguageToFlag';
import isAgeCriterionMet from '../../../utils/isAgeCriterionMet';
import TandemActions from '../show/Actions/TandemActions';
import ProfileTandemDetailLink from '../ui/ProfileTandemDetailLink';
import ProfileWithTandemLink from '../ui/ProfileTandemLink';
import useLearningLanguagesStore from '../useLearningLanguagesStore';
import PairingActions from './PairingActions';

import './list.css';

const TandemStatus = ({ status }: { status: string }) => {
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
    const { selectedUniversityIds, setSelectedUniversityIds } = useLearningLanguagesStore();

    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    const { data: universities } = useGetList('universities');

    const adaptedFilters = identity?.isCentralUniversity
        ? [
              <SelectInput
                  key="universityFilter"
                  choices={universities}
                  label={translate('learning_languages.list.filters.university.label')}
                  source="user.university"
                  alwaysOn
              />,
              <TextInput
                  key="userLastname"
                  label={translate('learning_languages.list.filters.user_lastname.label')}
                  source="user.lastname"
                  alwaysOn
              />,
          ]
        : [
              <TextInput
                  key="userLastname"
                  label={translate('learning_languages.list.filters.user_lastname.label')}
                  source="user.lastname"
                  alwaysOn
              />,
          ];

    const filters = universities ? adaptedFilters : [];

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <Box className="profiles-with-tandem-list">
            <PageTitle>{translate('learning_languages.title')}</PageTitle>
            {identity.isCentralUniversity && (
                <PairingActions
                    onGlobalRoutineEnded={refresh}
                    selectedUniversityIds={selectedUniversityIds}
                    setSelectedUniversityIds={setSelectedUniversityIds}
                    universityIds={[...selectedUniversityIds, identity.universityId]}
                />
            )}
            <List<ProfileWithTandems>
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
                        render={(record: ProfileWithTandems) => (
                            <>
                                <Box className="line profile">
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <ProfileWithTandemLink profile={record} variant="subtitle1" />
                                        <Typography sx={{ color: '#767676' }}>{record.user.university.name}</Typography>
                                    </Box>
                                </Box>
                                {record.learningLanguages.map((learningLanguage) => {
                                    if (learningLanguage.tandem) {
                                        return (
                                            <Box key={learningLanguage.code} className="line tandem profile">
                                                <PeopleAltIcon color="disabled" fontSize="small" />
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    {getProfileDisplayName(
                                                        learningLanguage.tandem.learningLanguages[0].profile
                                                    )}{' '}
                                                    (
                                                    {codeLanguageToFlag(
                                                        learningLanguage.tandem.learningLanguages[0].profile
                                                            .nativeLanguage.code
                                                    )}
                                                    )
                                                    <Typography sx={{ color: '#767676' }}>
                                                        {
                                                            learningLanguage.tandem.learningLanguages[0].profile.user
                                                                .university.name
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    }

                                    return (
                                        <Box key={learningLanguage.code} className="line tandem profile">
                                            <PeopleAltIcon color="disabled" fontSize="small" />
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
                        render={(record: ProfileWithTandems) => (
                            <>
                                <Box className="line">
                                    {record.learningLanguages.map((learningLanguage: LearningLanguage) => (
                                        <ColoredChips
                                            key={learningLanguage.code}
                                            color="default"
                                            label={codeLanguageToFlag(learningLanguage.code)}
                                        />
                                    ))}
                                </Box>
                                {record.learningLanguages.map((learningLanguage: LearningLanguage) => {
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
                                })}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.age')}
                        render={(record: ProfileWithTandems) => (
                            <>
                                <Box className="line">
                                    <ColoredChips color="default" label={record.user.age} variant="outlined" />
                                </Box>
                                {record.learningLanguages.map((learningLanguage: LearningLanguage) => {
                                    if (learningLanguage.tandem) {
                                        const criterionColor = isAgeCriterionMet(
                                            record.user.age,
                                            learningLanguage.tandem.learningLanguages[0].profile.user.age
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
                                                        learningLanguage.tandem.learningLanguages[0].profile.user.age
                                                    }
                                                    variant="outlined"
                                                />
                                            </Box>
                                        );
                                    }

                                    return <Box key={learningLanguage.code} className="line tandem" />;
                                })}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.role')}
                        render={(record: ProfileWithTandems) => (
                            <>
                                <Box className="line">
                                    <ColoredChips
                                        color="default"
                                        label={translate(`learning_languages.roles.${record.user.role}`)}
                                        variant="outlined"
                                    />
                                </Box>
                                {record.learningLanguages.map((learningLanguage: LearningLanguage) => {
                                    if (learningLanguage.tandem) {
                                        return (
                                            <Box key={learningLanguage.code} className="line tandem">
                                                <ColoredChips
                                                    key={learningLanguage.code}
                                                    color={
                                                        record.user.role ===
                                                        learningLanguage.tandem.learningLanguages[0].profile.user.role
                                                            ? 'success'
                                                            : 'error'
                                                    }
                                                    label={translate(
                                                        `learning_languages.roles.${learningLanguage.tandem.learningLanguages[0].profile.user.role}`
                                                    )}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        );
                                    }

                                    return <Box key={learningLanguage.code} className="line tandem" />;
                                })}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.score')}
                        render={(record: ProfileWithTandems) => (
                            <>
                                <Box className="line" />
                                {record.learningLanguages.map((learningLanguage: LearningLanguage) => {
                                    if (learningLanguage.tandem) {
                                        return (
                                            <Box key={learningLanguage.code} className="line tandem">
                                                {(learningLanguage.tandem.compatibilityScore * 100).toFixed(0)}%
                                            </Box>
                                        );
                                    }

                                    return <Box key={learningLanguage.code} className="line tandem" />;
                                })}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.type')}
                        render={(record: ProfileWithTandems) => (
                            <>
                                <Box className="line" />
                                {record.learningLanguages.map((learningLanguage: LearningLanguage) => {
                                    if (learningLanguage.tandem) {
                                        return (
                                            <Box key={learningLanguage.code} className="line tandem">
                                                {translate(
                                                    `learning_languages.types.${learningLanguage.tandem.learningLanguages[0].learningType}`
                                                )}
                                            </Box>
                                        );
                                    }

                                    return <Box key={learningLanguage.code} className="line tandem" />;
                                })}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.pairing')}
                        render={(record: ProfileWithTandems) => (
                            <>
                                <Box className="line" />
                                {record.learningLanguages.map((learningLanguage: LearningLanguage) => {
                                    if (learningLanguage.tandem) {
                                        return (
                                            <Box key={learningLanguage.code} className="line tandem">
                                                <TandemStatus status={learningLanguage.tandem.status} />
                                            </Box>
                                        );
                                    }

                                    return <Box key={learningLanguage.code} className="line tandem" />;
                                })}
                            </>
                        )}
                    />
                    <FunctionField
                        label={translate('learning_languages.list.tableColumns.actions')}
                        render={(record: ProfileWithTandems) => (
                            <>
                                <Box className="line" />
                                {record.learningLanguages.map((learningLanguage: LearningLanguage) => {
                                    if (
                                        learningLanguage.tandem &&
                                        learningLanguage.tandem.status !== 'ACTIVE' &&
                                        learningLanguage.tandem.status !== 'PAUSED'
                                    ) {
                                        return (
                                            <Box key={learningLanguage.code} className="line">
                                                <TandemActions
                                                    learningLanguageIds={[
                                                        learningLanguage.id,
                                                        learningLanguage.tandem.learningLanguages[0].id,
                                                    ]}
                                                    onTandemAction={refresh}
                                                    relaunchGlobalRoutineOnAccept={
                                                        !learningLanguage.tandem ||
                                                        learningLanguage?.id !==
                                                            learningLanguage.tandem.learningLanguages[0].id
                                                    }
                                                    relaunchGlobalRoutineOnRefuse={
                                                        learningLanguage?.id ===
                                                        learningLanguage.tandem.learningLanguages[0].id
                                                    }
                                                />
                                            </Box>
                                        );
                                    }

                                    if (
                                        learningLanguage.tandem &&
                                        (learningLanguage.tandem.status === 'ACTIVE' ||
                                            learningLanguage.tandem.status === 'PAUSED')
                                    ) {
                                        return (
                                            <Box key={learningLanguage.code} className="line">
                                                <TandemActions
                                                    learningLanguageIds={[
                                                        learningLanguage.id,
                                                        learningLanguage.tandem.learningLanguages[0].id,
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
                                })}
                            </>
                        )}
                    />
                    <FunctionField
                        render={(record: ProfileWithTandems) => (
                            <>
                                <Box className="line" />
                                {record.learningLanguages.map((learningLanguage: LearningLanguage) => (
                                    <Box key={learningLanguage.code} className="line">
                                        <ProfileTandemDetailLink
                                            learningLanguageCode={learningLanguage.code}
                                            profile={record}
                                        />
                                    </Box>
                                ))}
                            </>
                        )}
                    />
                </Datagrid>
            </List>
        </Box>
    );
};

export default LearningLanguageList;
