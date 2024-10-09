import UploadFileIcon from '@mui/icons-material/UploadFile';
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
} from 'react-admin';
import AudioLine from '../../components/chat/AudioLine';
import PageTitle from '../../components/PageTitle';
import { Activity, ActivityExercise, ActivityVocabulary } from '../../entities/Activity';
import codeLanguageToFlag from '../../utils/codeLanguageToFlag';

const ActivityShowAction = () => {
    const record = useRecordContext();

    const isFromStudent = record.creator;

    return (
        <TopToolbar>
            <EditButton />
            <DeleteButton mutationMode="pessimistic" redirect="/activities" />
            {isFromStudent && (
                <>
                    <Button color="success" label="Validate" onClick={() => {}} variant="contained" />
                    <Button color="error" label="Refuse" onClick={() => {}} variant="contained" />
                </>
            )}
        </TopToolbar>
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
                                    return <a href={record.ressourceUrl}>{record.ressourceUrl}</a>;
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
