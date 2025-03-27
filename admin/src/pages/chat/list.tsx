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

import { Box, Drawer } from '@mui/material';
import { useState } from 'react';
import {
    DatagridConfigurable,
    FunctionField,
    List,
    Loading,
    TextInput,
    minLength,
    useGetIdentity,
    useLocaleState,
    useTranslate,
} from 'react-admin';
import ChatContent from '../../components/chat/ChatContent';
import CustomAvatar from '../../components/CustomAvatar';
import PageTitle from '../../components/PageTitle';
import { Conversation } from '../../entities/Conversation';
import { MessageType } from '../../entities/Message';
import getLocaleCode from '../../utils/getLocaleCode';

const ChatList = () => {
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

    if (isLoadingIdentity || !identity) return <Loading />;

    const filters = [
        <TextInput
            key="lastname"
            label={translate('chat.list.filters.lastname')}
            source="lastname"
            validate={[minLength(3)]}
        />,
        <TextInput
            key="firstname"
            label={translate('chat.list.filters.firstname')}
            source="firstname"
            validate={[minLength(3)]}
        />,
    ];

    return (
        <Box>
            <Box>
                <PageTitle>{translate('chat.title')}</PageTitle>
                <List
                    exporter={false}
                    filter={{
                        id: identity.id,
                    }}
                    filters={filters}
                    sx={{
                        flexGrow: 1,
                        transition: (theme: any) =>
                            theme.transitions.create(['all'], {
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        marginRight: currentConversation ? '500px' : 0,
                    }}
                >
                    <DatagridConfigurable
                        bulkActionButtons={false}
                        rowClick={(_, __, record) => {
                            setCurrentConversation(record as Conversation);

                            // Disable the default rowClick behavior
                            return false;
                        }}
                    >
                        <FunctionField
                            label=""
                            render={(record: Conversation) => {
                                let lastMessageInfo;

                                switch (record.lastMessage?.type) {
                                    case MessageType.Link:
                                    case MessageType.Text:
                                        lastMessageInfo = record.lastMessage.content;
                                        break;
                                    case MessageType.Image:
                                        lastMessageInfo = translate('chat.messageType.image');
                                        break;
                                    case MessageType.Audio:
                                        lastMessageInfo = translate('chat.messageType.audio');
                                        break;
                                    case MessageType.File:
                                        lastMessageInfo = translate('chat.messageType.file');
                                        break;
                                    default:
                                        lastMessageInfo = '';
                                        break;
                                }

                                return (
                                    <Box
                                        key={record.id}
                                        sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CustomAvatar
                                                avatarId={record.partner.avatar?.id}
                                                firstName={record.partner.firstname}
                                                lastName={record.partner.lastname}
                                            />
                                            <Box>
                                                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '0' }}>
                                                    {record.partner.lastname} {record.partner.firstname}
                                                </p>
                                                <p style={{ color: 'gray', margin: '0' }}>{lastMessageInfo}</p>
                                            </Box>
                                        </Box>
                                        {record.lastMessage && (
                                            <Box>
                                                {new Date(record.lastMessage.createdAt).toLocaleString(
                                                    getLocaleCode(locale),
                                                    {
                                                        dateStyle: 'long',
                                                        timeStyle: 'short',
                                                    }
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                );
                            }}
                            sortable={false}
                            source="code"
                        />
                    </DatagridConfigurable>
                </List>
            </Box>
            <Drawer anchor="right" open={!!currentConversation} sx={{ zIndex: 100 }} variant="persistent">
                {currentConversation && <ChatContent conversation={currentConversation} />}
            </Drawer>
        </Box>
    );
};

export default ChatList;
