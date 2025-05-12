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
    const { filePath, mediaType } = record?.metadata || {};

    if (!mediaType || !filePath) {
        return <TextField component="pre" label={translate('global.content')} source="content" />;
    }

    const onDownload = () => {
        handleDownloadFile(filePath);
    };

    switch (mediaType) {
        case MessageType.Audio:
            return (
                <>
                    <TextField component="pre" source="content" />
                    <AudioLine audioFile={filePath} />
                </>
            );
        case MessageType.Image:
            return (
                <>
                    <TextField component="pre" source="content" />
                    <ImageField source="metadata.filePath" sx={{ '& img': { minWidth: 200, minHeight: 200 } }} />
                </>
            );
        case MessageType.File:
            return (
                <>
                    <TextField component="pre" source="content" />
                    <Button onClick={onDownload} startIcon={<FileDownloadIcon />} />
                </>
            );
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
