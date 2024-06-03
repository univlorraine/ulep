import DeleteIcon from '@mui/icons-material/Delete';
import { Typography, Switch, SwitchProps, Box, Modal } from '@mui/material';
import React, { useState } from 'react';
import {
    TopToolbar,
    EditButton,
    useTranslate,
    Show,
    SimpleShowLayout,
    TextField,
    UrlField,
    EmailField,
    useNotify,
    useUpdate,
    Button,
    useRefresh,
    FunctionField,
    NumberField,
} from 'react-admin';
import { ColorField } from 'react-admin-color-picker';
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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleToggle: SwitchProps['onChange'] = async (event) => {
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <ConfigPagesHeader />
            <Show actions={<InstanceShowAction />} title={translate('instance.label')}>
                <SimpleShowLayout sx={{ m: 3 }}>
                    <TextField label={translate('instance.name')} source="name" />
                    <EmailField label={translate('instance.email')} source="email" />
                    <UrlField label={translate('instance.cgu')} source="cguUrl" />
                    <UrlField label={translate('instance.confidentiality')} source="confidentialityUrl" />
                    <UrlField label={translate('instance.ressource')} source="ressourceUrl" />
                    <ColorField label={translate('instance.primaryColor')} source="primaryColor" />
                    <ColorField label={translate('instance.primaryBackgroundColor')} source="primaryBackgroundColor" />
                    <ColorField label={translate('instance.primaryDarkColor')} source="primaryDarkColor" />
                    <ColorField label={translate('instance.secondaryColor')} source="secondaryColor" />
                    <ColorField
                        label={translate('instance.secondaryBackgroundColor')}
                        source="secondaryBackgroundColor"
                    />
                    <ColorField label={translate('instance.secondaryDarkColor')} source="secondaryDarkColor" />
                    <NumberField
                        label={translate('instance.daysBeforeClosureNotification')}
                        source="daysBeforeClosureNotification"
                    />
                    <FunctionField
                        render={(record: Instance) => (
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                                <Typography color="inherit" variant="subtitle1">
                                    {translate('instance.maintenance')}
                                </Typography>
                                <Switch
                                    color="secondary"
                                    defaultChecked={record?.isInMaintenance}
                                    onChange={handleToggle}
                                    value={record?.isInMaintenance}
                                />
                            </div>
                        )}
                    />
                    <Button color="secondary" onClick={() => setIsModalOpen(true)} variant="contained">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <DeleteIcon />
                            <Typography>{translate('purge.title')}</Typography>
                        </div>
                    </Button>
                </SimpleShowLayout>
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
