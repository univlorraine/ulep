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

import { Box, Button, Chip, Modal, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import {
    List,
    Datagrid,
    useTranslate,
    TextField,
    useGetIdentity,
    Loading,
    useDataProvider,
    useRefresh,
    useUnselectAll,
    SelectInput,
    TextInput,
    ReferenceInput,
    FunctionField,
    useGetList,
    useListContext,
} from 'react-admin';
import PageTitle from '../../../components/PageTitle';
import { EventObject } from '../../../entities/Event';
import { Profile } from '../../../entities/Profile';
import { UserRole } from '../../../entities/User';
import SearchProfile from './SearchProfile';
import SendEmail from './SendEmail';

interface BulkActionButtonProps {
    eventId: string;
}

const BulkActionButton = ({ eventId }: BulkActionButtonProps) => {
    const { selectedIds, resource } = useListContext();
    const translate = useTranslate();
    const { unsubscribeToEvent } = useDataProvider();
    const refresh = useRefresh();
    const unselectAll = useUnselectAll(resource ?? 'events/subscriptions');

    const unsubscribe = async () => {
        await unsubscribeToEvent(eventId, selectedIds);
        unselectAll();
        refresh();
    };

    return <Button onClick={unsubscribe}>{translate('events.subscriptions.unsubscribe')}</Button>;
};

const EventsSubscriptionsList = () => {
    const translate = useTranslate();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const { getOne } = useDataProvider();
    const [currentEvent, setCurrentEvent] = useState<EventObject>();
    const [isSubscriptionsModalOpen, setIsSubscriptionsModalOpen] = useState<boolean>(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

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

    const eventId = window.location.pathname.split('/').slice(-1)[0].split('?')[0];

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
        <TextInput key="departement" label={translate('global.departement')} source="user.division" alwaysOn />,
    ];

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

    useEffect(() => {
        const fetchEvent = async () => {
            const event = await getOne('events', { id: eventId });
            setCurrentEvent(event.data);
        };

        fetchEvent();
    }, []);

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    return (
        <>
            <PageTitle>{translate('events.title')}</PageTitle>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h3">
                    {translate('events.subscriptions.title', { eventTitle: currentEvent?.title })}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <Button
                        onClick={() => setIsSubscriptionsModalOpen(true)}
                        sx={{ width: 'fit-content', alignSelf: 'center' }}
                        variant="contained"
                    >
                        {translate('events.subscriptions.search.button')}
                    </Button>
                    <Button
                        onClick={() => setIsEmailModalOpen(true)}
                        sx={{ width: 'fit-content', alignSelf: 'center' }}
                        variant="contained"
                    >
                        {translate('events.subscriptions.email.button')}
                    </Button>
                </Box>
            </Box>
            <Typography variant="h4">
                {translate('events.subscriptions.author', {
                    universityName: currentEvent?.authorUniversity.name,
                })}
            </Typography>
            {eventId && (
                <List
                    exporter={false}
                    filter={{
                        subscribedToEvent: eventId,
                    }}
                    filters={filters}
                >
                    <Datagrid
                        bulkActionButtons={<BulkActionButton eventId={eventId} />}
                        rowClick={(_, __, record) => {
                            window.open(`/#/profiles/${record.id}/show`, '_blank');

                            // Disable the default rowClick behavior
                            return false;
                        }}
                    >
                        <FunctionField
                            label={translate('global.role')}
                            render={(record: Profile) => translate(`global.${record.user.role.toLowerCase()}`)}
                            source="user.role"
                        />
                        <TextField label="events.subscriptions.list.firstname" source="user.firstname" />
                        <TextField label="events.subscriptions.list.lastname" source="user.lastname" />
                        <TextField label="events.subscriptions.list.university" source="user.university.name" />
                        <TextField label="events.subscriptions.list.departement" source="user.division" />
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
            )}

            <Modal onClose={() => setIsSubscriptionsModalOpen(false)} open={isSubscriptionsModalOpen}>
                <SearchProfile eventId={eventId} setIsModalOpen={setIsSubscriptionsModalOpen} />
            </Modal>

            <Modal onClose={() => setIsEmailModalOpen(false)} open={isEmailModalOpen}>
                <SendEmail eventId={eventId} setIsModalOpen={setIsEmailModalOpen} />
            </Modal>
        </>
    );
};

export default EventsSubscriptionsList;
