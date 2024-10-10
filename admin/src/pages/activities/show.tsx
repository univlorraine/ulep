import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box } from '@mui/material';
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

    const handlePublish = async () => {
        try {
            return await update('activities', { id: record.id, data: { status: ActivityStatus.PUBLISHED } });
        } catch (err) {
            console.error(err);

            return notify('activities.error.update');
        }
    };

    const handleRefuse = async () => {
        try {
            return await update('activities', { id: record.id, data: { status: ActivityStatus.REJECTED } });
        } catch (err) {
            console.error(err);

            return notify('activities.error.update');
        }
    };

    const handleUnpublish = async () => {
        try {
            return await update('activities', { id: record.id, data: { status: ActivityStatus.DRAFT } });
        } catch (err) {
            console.error(err);

            return notify('activities.error.update');
        }
    };

    return (
        <Box display="flex" flexDirection="row" gap="50px">
            <ActivityStatusChips status={record.status} />
            {record?.status === ActivityStatus.IN_VALIDATION && (
                <Box display="flex" flexDirection="row" gap="10px">
                    <Button
                        color="success"
                        label={translate('activities.show.actions.publish')}
                        onClick={handlePublish}
                        variant="contained"
                    />
                    <Button
                        color="error"
                        label={translate('activities.show.actions.refuse')}
                        onClick={handleRefuse}
                        variant="contained"
                    />
                </Box>
            )}
            {record?.status === ActivityStatus.PUBLISHED && (
                <Box display="flex" flexDirection="row" gap="10px">
                    <Button
                        color="info"
                        label={translate('activities.show.actions.unpublish')}
                        onClick={handleUnpublish}
                        variant="contained"
                    />
                </Box>
            )}
            {record?.status === ActivityStatus.DRAFT && (
                <Box display="flex" flexDirection="row" gap="10px">
                    <Button
                        color="success"
                        label={translate('activities.show.actions.publish')}
                        onClick={handlePublish}
                        variant="contained"
                    />
                </Box>
            )}
        </Box>
    );
};

const ActivityShow = () => {
    const translate = useTranslate();

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

                                return `${record.creator.user.firstname} ${record.creator.user.lastname}`;
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
                            label={translate('activities.show.mainInfos.description')}
                            source="description"
                            multiline
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
                                if (record.ressourceUrl) {
                                    return (
                                        <a href={record.ressourceUrl} rel="noreferrer" target="_blank">
                                            {record.ressourceUrl}
                                        </a>
                                    );
                                }
                                if (record.ressourceFileUrl) {
                                    return (
                                        <a href={record.ressourceFileUrl} rel="noreferrer" target="_blank">
                                            <UploadFileIcon />
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
