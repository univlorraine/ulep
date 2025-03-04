import DeleteIcon from '@mui/icons-material/Delete';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Box, CircularProgress, Modal, Switch, SwitchProps, Typography } from '@mui/material';
import { useState } from 'react';
import {
    Button,
    EditButton,
    EmailField,
    FunctionField,
    NumberField,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    UrlField,
    useNotify,
    useRefresh,
    useTranslate,
    useUpdate,
} from 'react-admin';
import { ColorField } from 'react-admin-color-picker';
import ReferenceUploadFileField from '../../components/field/ReferenceUploadFileField';
import useGenerateConversation from '../../components/menu/useGenerateConversation';
import useGenerateEditos from '../../components/menu/useGenerateEditos';
import usePurge from '../../components/menu/usePurge';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import Instance from '../../entities/Instance';

const InstanceShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const InstanceShow = () => {
    const translate = useTranslate();
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();
    const { mutate: purge } = usePurge();
    const { mutate: generateConversations, isLoading: isGeneratingConversations } = useGenerateConversation();
    const { mutate: generateEditos, isLoading: isGeneratingEditos } = useGenerateEditos();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleMaintenanceToggle: SwitchProps['onChange'] = async (event) => {
        try {
            const isOn = event.target.checked;
            await update('instance', { data: { isInMaintenance: isOn } });
            notify(translate('instance.mainteance_update'));
        } catch (error) {
            notify(translate('instance.update_error'));
        }
    };

    const handlePurge = async () => {
        await purge();
        setIsModalOpen(false);
        refresh();
    };

    const handleGenerateConversations = async () => {
        await generateConversations();
        setIsModalOpen(false);
        refresh();
    };

    const handleGenerateEditos = async () => {
        await generateEditos();
        setIsModalOpen(false);
        refresh();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <ConfigPagesHeader />
            <Show actions={<InstanceShowAction />} title={translate('instance.label')}>
                <Box sx={{ display: 'flex', gap: '30px' }}>
                    <SimpleShowLayout sx={{ m: 3, flex: '1' }}>
                        <TextField label={translate('instance.name')} source="name" />
                        <EmailField label={translate('instance.email')} source="email" />
                        <UrlField label={translate('instance.cgu')} source="cguUrl" />
                        <UrlField label={translate('instance.confidentiality')} source="confidentialityUrl" />
                        <UrlField label={translate('instance.ressource')} source="ressourceUrl" />
                        <NumberField
                            label={translate('instance.daysBeforeClosureNotification')}
                            source="daysBeforeClosureNotification"
                        />
                        <ReferenceUploadFileField
                            label={translate('instance.defaultCertificateFile')}
                            source="defaultCertificateFile.id"
                        />
                        <FunctionField
                            label={translate('instance.edito.mandatoryTranslations')}
                            render={(record: Instance) => {
                                if (record.editoMandatoryTranslations.length > 0) {
                                    return record.editoMandatoryTranslations.map((translation) => (
                                        <div key={translation}>{translate(`editos.languages.${translation}`)}</div>
                                    ));
                                }

                                return <div>{translate('instance.edito.noMandatoryTranslations')}</div>;
                            }}
                            source="editoMandatoryTranslations"
                        />
                        <FunctionField
                            label={translate('instance.maintenance')}
                            render={(record: Instance) => (
                                <Switch
                                    color="secondary"
                                    defaultChecked={record?.isInMaintenance}
                                    onChange={handleMaintenanceToggle}
                                    value={record?.isInMaintenance}
                                />
                            )}
                        />
                        <FunctionField
                            label={translate('instance.actions')}
                            render={() => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        alignItems: 'flex-start',
                                        gap: '20px',
                                    }}
                                >
                                    <Button color="secondary" onClick={() => setIsModalOpen(true)} variant="contained">
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <DeleteIcon />
                                            <Typography style={{ marginLeft: 12 }}>
                                                {translate('purge.title')}
                                            </Typography>
                                        </div>
                                    </Button>
                                    <Button color="secondary" onClick={handleGenerateConversations} variant="contained">
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <QuestionAnswerIcon />
                                            {isGeneratingConversations ? (
                                                <CircularProgress size={25} />
                                            ) : (
                                                <Typography style={{ marginLeft: 12 }}>
                                                    {translate('generateConversation.title')}
                                                </Typography>
                                            )}
                                        </div>
                                    </Button>
                                    <Button color="secondary" onClick={handleGenerateEditos} variant="contained">
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <FormatQuoteIcon />
                                            {isGeneratingEditos ? (
                                                <CircularProgress size={25} />
                                            ) : (
                                                <Typography style={{ marginLeft: 12 }}>
                                                    {translate('generateEditos.title')}
                                                </Typography>
                                            )}
                                        </div>
                                    </Button>
                                </Box>
                            )}
                        />
                    </SimpleShowLayout>
                    <SimpleShowLayout sx={{ m: 3, flex: '1' }}>
                        <ColorField label={translate('instance.primaryColor')} source="primaryColor" />
                        <ColorField
                            label={translate('instance.primaryBackgroundColor')}
                            source="primaryBackgroundColor"
                        />
                        <ColorField label={translate('instance.primaryDarkColor')} source="primaryDarkColor" />
                        <ColorField label={translate('instance.secondaryColor')} source="secondaryColor" />
                        <ColorField
                            label={translate('instance.secondaryBackgroundColor')}
                            source="secondaryBackgroundColor"
                        />
                        <ColorField label={translate('instance.secondaryDarkColor')} source="secondaryDarkColor" />
                    </SimpleShowLayout>
                </Box>
                <Modal
                    aria-describedby="confirm-modal"
                    aria-labelledby="confirm-modal"
                    onClose={handleCloseModal}
                    open={isModalOpen}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            p: 4,
                        }}
                    >
                        <>
                            <p>{translate('instance.purge_modal.message')}</p>
                            <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-around' }}>
                                <Button
                                    label={translate('learning_languages.show.tandems.actions.ctaLabels.cancel')}
                                    onClick={handleCloseModal}
                                    variant="text"
                                />
                                <Button
                                    color="error"
                                    label={translate('learning_languages.show.tandems.actions.ctaLabels.confirm')}
                                    onClick={handlePurge}
                                    variant="outlined"
                                />
                            </Box>
                        </>
                    </Box>
                </Modal>
            </Show>
        </>
    );
};

export default InstanceShow;
