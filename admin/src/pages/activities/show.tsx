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

import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Typography } from '@mui/material';
import React from 'react';
import {
    useTranslate,
    Show,
    TabbedShowLayout,
    TextField,
    ImageField,
    FunctionField,
    ArrayField,
    Datagrid,
    TopToolbar,
    EditButton,
    DeleteButton,
    Button,
    useRecordContext,
    useUpdate,
    useNotify,
    useRefresh,
    useRedirect,
} from 'react-admin';
import ActivityStatusChips from '../../components/ActivityStatusChipsProps';
import AudioLine from '../../components/chat/AudioLine';
import PageTitle from '../../components/PageTitle';
import { Activity, ActivityExercise, ActivityStatus, ActivityVocabulary } from '../../entities/Activity';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';

const ActivityShowAction = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton mutationMode="pessimistic" redirect="/activities" />
    </TopToolbar>
);

const ActivityStatusComponent = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleChangeStatus = async (status: ActivityStatus) => {
        await update(
            'activities/status',
            { id: record?.id, data: { status } },
            {
                onSettled: (_, error: unknown) => {
                    if (!error) {
                        return refresh();
                    }

                    return notify('activities.error.update', {
                        type: 'error',
                    });
                },
            }
        );
    };

    return (
        <Box display="flex" flexDirection="row" gap="50px">
            <ActivityStatusChips status={record?.status} />

            {record?.status === ActivityStatus.REJECTED && (
                <Box display="flex" flexDirection="row" gap="10px">
                    <Button
                        color="success"
                        label={translate('activities.show.actions.publish')}
                        onClick={() => handleChangeStatus(ActivityStatus.PUBLISHED)}
                        variant="contained"
                    />
                </Box>
            )}

            {record?.status === ActivityStatus.IN_VALIDATION && (
                <Box display="flex" flexDirection="row" gap="10px">
                    <Button
                        color="success"
                        label={translate('activities.show.actions.publish')}
                        onClick={() => handleChangeStatus(ActivityStatus.PUBLISHED)}
                        variant="contained"
                    />
                    <Button
                        color="error"
                        label={translate('activities.show.actions.refuse')}
                        onClick={() => handleChangeStatus(ActivityStatus.REJECTED)}
                        variant="contained"
                    />
                </Box>
            )}
            {record?.status === ActivityStatus.PUBLISHED && (
                <Box display="flex" flexDirection="row" gap="10px">
                    <Button
                        color="info"
                        label={translate('activities.show.actions.unpublish')}
                        onClick={() => handleChangeStatus(ActivityStatus.DRAFT)}
                        variant="contained"
                    />
                </Box>
            )}
            {record?.status === ActivityStatus.DRAFT && !record?.creator && (
                <Box display="flex" flexDirection="row" gap="10px">
                    <Button
                        color="success"
                        label={translate('activities.show.actions.publish')}
                        onClick={() => handleChangeStatus(ActivityStatus.PUBLISHED)}
                        variant="contained"
                    />
                </Box>
            )}
        </Box>
    );
};

const ActivityShow = () => {
    const translate = useTranslate();
    const redirect = useRedirect();

    return (
        <>
            <PageTitle>{translate('activities.label')}</PageTitle>
            <Show actions={<ActivityShowAction />}>
                <TabbedShowLayout>
                    <TabbedShowLayout.Tab label={translate('activities.show.mainInfos.label')}>
                        <FunctionField
                            label={translate('activities.list.status')}
                            render={() => <ActivityStatusComponent />}
                            sortable={false}
                            source="language"
                        />
                        <FunctionField
                            label={translate('activities.list.creator')}
                            render={(record: Activity) => {
                                if (!record.creator) {
                                    return translate('activities.show.mainInfos.admin');
                                }

                                return (
                                    <Typography
                                        onClick={() => {
                                            if (record.creator) {
                                                redirect('show', 'profiles', record.creator.id);
                                            }
                                        }}
                                        sx={{ cursor: 'pointer', color: '#3737d5' }}
                                    >
                                        {record.creator.user.lastname} {record.creator.user.firstname}
                                    </Typography>
                                );
                            }}
                            sortable={false}
                        />
                        <TextField
                            label={translate('activities.list.university')}
                            sortable={false}
                            source="university.name"
                        />
                        <TextField label={translate('activities.show.mainInfos.title')} source="title" />
                        <ImageField label={translate('activities.show.mainInfos.image')} source="imageUrl" />
                        <TextField label={translate('activities.show.mainInfos.credit')} source="creditImage" />
                        <TextField
                            component="pre"
                            label={translate('activities.show.mainInfos.description')}
                            source="description"
                            sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        />
                        <TextField label={translate('activities.show.mainInfos.level')} source="languageLevel" />
                        <FunctionField
                            label={translate('activities.show.mainInfos.language')}
                            render={(record: Activity) => <span>{codeLanguageToFlag(record.language.code)}</span>}
                        />
                        <TextField
                            label={translate('activities.show.mainInfos.category')}
                            source="theme.category.content"
                        />
                        <TextField label={translate('activities.show.mainInfos.theme')} source="theme.content" />
                        <FunctionField
                            label={translate('activities.show.mainInfos.resource')}
                            render={(record: Activity) => {
                                if (record.ressourceFileUrl) {
                                    return (
                                        <a href={record.ressourceFileUrl} rel="noreferrer" target="_blank">
                                            <UploadFileIcon />
                                        </a>
                                    );
                                }

                                if (record.ressourceUrl) {
                                    return (
                                        <a href={record.ressourceUrl} rel="noreferrer" target="_blank">
                                            {record.ressourceUrl}
                                        </a>
                                    );
                                }

                                return null;
                            }}
                        />
                    </TabbedShowLayout.Tab>

                    <TabbedShowLayout.Tab label={translate(`activities.show.exercices.label`)}>
                        <ArrayField sort={{ field: 'order', order: 'ASC' }} source="exercises">
                            <Datagrid bulkActionButtons={false}>
                                <FunctionField
                                    label={translate('activities.show.exercices.order')}
                                    render={(record: ActivityExercise) => record.order + 1}
                                    sortable={false}
                                    source="order"
                                />
                                <TextField sortable={false} source="content" />
                            </Datagrid>
                        </ArrayField>
                    </TabbedShowLayout.Tab>

                    <TabbedShowLayout.Tab label={translate(`activities.show.vocabulary.label`)}>
                        <ArrayField source="vocabularies">
                            <Datagrid bulkActionButtons={false}>
                                <TextField sortable={false} source="content" />
                                <FunctionField
                                    label={translate('activities.show.vocabulary.pronunciation')}
                                    render={(record: ActivityVocabulary) => {
                                        if (record.pronunciationActivityVocabularyUrl) {
                                            return (
                                                <AudioLine
                                                    audioFile={record.pronunciationActivityVocabularyUrl}
                                                    hideProgressBar
                                                />
                                            );
                                        }

                                        return null;
                                    }}
                                    sortable={false}
                                    source="pronunciationActivityVocabularyUrl"
                                />
                            </Datagrid>
                        </ArrayField>
                    </TabbedShowLayout.Tab>
                </TabbedShowLayout>
            </Show>
        </>
    );
};

export default ActivityShow;
