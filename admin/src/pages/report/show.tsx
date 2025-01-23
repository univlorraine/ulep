import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
    BooleanField,
    Button,
    EditButton,
    FunctionField,
    ImageField,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    usePermissions,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import AudioLine from '../../components/chat/AudioLine';
import ReportsPagesHeader from '../../components/tabs/ReportsPagesHeader';
import { Role } from '../../entities/Administrator';
import { MessageType } from '../../entities/Message';
import Report from '../../entities/Report';
import handleDownloadFile from '../../utils/downloadFile';

const ReportShowAction = () => {
    const { permissions } = usePermissions();
    const canEdit = permissions.checkRoles([Role.MANAGER, Role.SUPER_ADMIN]);

    return <TopToolbar>{canEdit && <EditButton />}</TopToolbar>;
};

const ReportMedia = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const { filePath, mediaType } = record.metadata || {};

    if (!mediaType || !filePath) {
        return <TextField component="pre" label={translate('global.content')} source="content" />;
    }

    const onDownload = () => {
        handleDownloadFile(filePath);
    };

    switch (mediaType) {
        case MessageType.Audio:
            return <AudioLine audioFile={filePath} />;
        case MessageType.Image:
            return <ImageField source="metadata.filePath" sx={{ '& img': { minWidth: 200, minHeight: 200 } }} />;
        case MessageType.File:
            return <Button onClick={onDownload} startIcon={<FileDownloadIcon />} />;
        default:
            return <TextField component="pre" source="content" />;
    }
};

const ReportData = () => {
    const translate = useTranslate();
    const recordContext = useRecordContext<Report>();

    return (
        <SimpleShowLayout sx={{ m: 3 }}>
            <TextField
                emptyText={translate('global.deleted_user')}
                label={translate('global.firstname')}
                source="user.firstname"
            />
            <TextField
                emptyText={translate('global.deleted_user')}
                label={translate('global.lastname')}
                source="user.lastname"
            />
            <TextField
                emptyText={translate('global.deleted_user')}
                label={translate('global.email')}
                source="user.email"
            />
            <FunctionField
                label={translate('reports.status')}
                render={(record: Report) => translate(`reports.${record.status}`)}
                source="status"
            />
            <TextField label={translate('reports.category')} source="category.name" />
            <FunctionField label={translate('global.content')} render={() => <ReportMedia />} />
            <TextField component="pre" label={translate('reports.comment')} source="comment" />
            {recordContext && recordContext.metadata && recordContext.metadata.messageId && (
                <BooleanField label={translate('reports.isMessageDeleted')} source="metadata.isMessageDeleted" />
            )}
        </SimpleShowLayout>
    );
};

const ReportShow = () => {
    const translate = useTranslate();

    return (
        <>
            <ReportsPagesHeader />
            <Show actions={<ReportShowAction />} title={translate('reports.label')}>
                <ReportData />
            </Show>
        </>
    );
};

export default ReportShow;
