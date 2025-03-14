import CloseIcon from '@mui/icons-material/Close';
import { Box, Chip, Typography } from '@mui/material';
import { useMemo } from 'react';
import {
    Button,
    Datagrid,
    ReferenceInput,
    SelectInput,
    TextField,
    TextInput,
    useDataProvider,
    useTranslate,
    FunctionField,
    useRefresh,
    useUnselectAll,
    useGetIdentity,
    ResourceContextProvider,
    List,
    useGetList,
} from 'react-admin';
import { Profile } from '../../../entities/Profile';
import { UserRole } from '../../../entities/User';

interface BulkActionButtonProps {
    eventId: string;
    setIsModalOpen: (isModalOpen: boolean) => void;
    selectedIds?: string[];
    resource?: string;
}

const BulkActionButton = ({ eventId, setIsModalOpen, resource, selectedIds }: BulkActionButtonProps) => {
    const translate = useTranslate();
    const { subscribeToEvent } = useDataProvider();
    const refresh = useRefresh();
    const unselectAll = useUnselectAll(resource ?? 'profiles');

    const subscribe = async () => {
        await subscribeToEvent(eventId, selectedIds);
        setIsModalOpen(false);
        unselectAll();
        refresh();
    };

    return (
        <Button onClick={subscribe}>
            <span>{translate('events.subscriptions.search.subscribe')}</span>
        </Button>
    );
};

type SearchProfileProps = {
    eventId: string;
    setIsModalOpen: (isModalOpen: boolean) => void;
};

const SearchProfile = ({ eventId, setIsModalOpen }: SearchProfileProps) => {
    const translate = useTranslate();
    const { data: identity } = useGetIdentity();

    const { data: languages } = useGetList('languages', {
        pagination: { page: 1, perPage: 250 },
        sort: { field: 'name', order: 'ASC' },
    });

    const sortedLanguages = useMemo(() => {
        if (!languages) return [];

        return languages.sort((a, b) => {
            const nameA = translate(`languages_code.${a.code}`);
            const nameB = translate(`languages_code.${b.code}`);

            return nameA.localeCompare(nameB);
        });
    }, [languages]);

    const filters = [
        <SelectInput
            key="role"
            choices={Object.values(UserRole).map((role) => ({
                id: role,
                name: translate(`global.${role.toLowerCase()}`),
            }))}
            label={translate('global.role')}
            source="user.role"
            alwaysOn
        />,
        <TextInput key="firstname" label={translate('global.firstname')} source="user.firstname" alwaysOn />,
        <TextInput key="lastname" label={translate('global.lastname')} source="user.lastname" alwaysOn />,
        <TextInput key="email" label={translate('global.email')} source="user.email" alwaysOn />,
    ];

    if (identity?.isCentralUniversity) {
        filters.push(
            <ReferenceInput
                key="university"
                label={translate('global.university')}
                reference="universities"
                sort={{ field: 'name', order: 'ASC' }}
                source="user.university"
                alwaysOn
            >
                <SelectInput label={translate('global.university')} optionText="name" optionValue="id" />
            </ReferenceInput>
        );
    }

    if (sortedLanguages) {
        filters.push(
            <SelectInput
                choices={sortedLanguages}
                label={translate('profiles.native_language')}
                optionText={(option) => translate(`languages_code.${option.code}`)}
                optionValue="code"
                source="nativeLanguageCode"
                alwaysOn
            />
        );

        filters.push(
            <SelectInput
                choices={sortedLanguages}
                label={translate('profiles.mastered_languages')}
                optionText={(option) => translate(`languages_code.${option.code}`)}
                optionValue="code"
                source="masteredLanguageCode"
                alwaysOn
            />
        );

        filters.push(
            <SelectInput
                choices={sortedLanguages}
                label={translate('profiles.learning_languages')}
                optionText={(option) => translate(`languages_code.${option.code}`)}
                optionValue="code"
                source="learningLanguageCode"
                alwaysOn
            />
        );
    }

    return (
        <Box sx={{ backgroundColor: 'white', padding: 5, margin: 10, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h3">{translate('events.subscriptions.searchProfile')}</Typography>
                <Button onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                </Button>
            </Box>

            <ResourceContextProvider value="profiles">
                <List
                    exporter={false}
                    filter={{
                        notSubscribedToEvent: eventId,
                        university: !identity?.isCentralUniversity ? identity?.universityId : undefined,
                    }}
                    filters={filters}
                    disableSyncWithLocation
                >
                    <Datagrid
                        bulkActionButtons={<BulkActionButton eventId={eventId} setIsModalOpen={setIsModalOpen} />}
                        rowClick={(_, __, record) => {
                            window.open(`/#/profiles/${record.id}/show`, '_blank');

                            return false;
                        }}
                    >
                        <FunctionField
                            label={translate('global.role')}
                            render={(record: Profile) => translate(`global.${record.user.role.toLowerCase()}`)}
                            source="user.role"
                        />
                        <TextField label="events.subscriptions.list.firstname" source="user.firstname" />
                        <TextField label="events.subscriptions.list.firstname" source="user.lastname" />
                        <TextField label="events.subscriptions.list.firstname" source="user.email" />
                        <TextField label="events.subscriptions.list.firstname" source="user.university.name" />
                        <FunctionField
                            label="events.subscriptions.list.learningLanguage"
                            render={(record: Profile) => (
                                <div style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                                    {record.learningLanguages.map((language) => (
                                        <Chip
                                            key={language.code}
                                            label={translate(`languages_code.${language.code}`)}
                                        />
                                    ))}
                                </div>
                            )}
                        />
                    </Datagrid>
                </List>
            </ResourceContextProvider>
        </Box>
    );
};

export default SearchProfile;
