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
                            label={translate('instance.edito.centralUniversityTranslations')}
                            render={(record: Instance) => {
                                if (record.editoCentralUniversityTranslations.length > 0) {
                                    return (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                            {record.editoCentralUniversityTranslations.map((translation) => (
                                                <span key={translation.code}>{translation.code}</span>
                                            ))}
                                        </div>
                                    );
                                }

                                return <div>{translate('instance.edito.noCentralUniversityTranslations')}</div>;
                            }}
                            source="editoCentralUniversityTranslations"
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
