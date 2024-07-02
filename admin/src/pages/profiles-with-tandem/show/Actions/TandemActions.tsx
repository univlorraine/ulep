import { Check, Clear } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Modal } from '@mui/material';
import React, { useState } from 'react';
import { Button, useNotify, useTranslate } from 'react-admin';
import { TandemStatus } from '../../../../entities/Tandem';
import useCreateTandem from './useCreateTandem';
import useRefuseTandem from './useRefuseTandem';
import useUpdateTandem from './useUpdateTandem';
import useValidateTandem from './useValidateTandem';

export enum TandemAction {
    ACCEPT = 'ACCEPT',
    REFUSE = 'REFUSE',
    PAUSE = 'PAUSE',
}

interface TandemActionsProps {
    tandemStatus?: TandemStatus;
    tandemId?: string;
    learningLanguageIds?: string[];
    onTandemAction: (modalAction?: TandemAction) => void;
    relaunchGlobalRoutineOnRefuse?: boolean;
    relaunchGlobalRoutineOnAccept?: boolean;
    disableCreateButton?: boolean;
}

const TandemActions = ({
    tandemStatus,
    tandemId,
    learningLanguageIds,
    onTandemAction,
    relaunchGlobalRoutineOnRefuse,
    relaunchGlobalRoutineOnAccept,
    disableCreateButton,
}: TandemActionsProps) => {
    if (!tandemId && learningLanguageIds?.length !== 2) {
        throw new Error('TandemActions must have a tandemId or 2 learningLanguage Ids');
    }

    const translate = useTranslate();

    const [modalAction, setModalAction] = useState<TandemAction>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalAction(undefined);
    };

    const handleAction = (action: TandemAction) => {
        setModalAction(action);
        setIsModalOpen(true);
    };

    const onSuccess = async () => {
        onTandemAction(modalAction);
        handleCloseModal();
    };

    const notify = useNotify();
    const onError = async () => {
        notify(translate('learning_languages.show.tandems.actions.error'), { type: 'error' });
    };

    const { mutate: validateTandem, isLoading: isLoadingValidateTandem } = useValidateTandem({
        onSuccess,
        onError,
    });
    const { mutate: createTandem, isLoading: isLoadingCreateTandem } = useCreateTandem({
        onSuccess,
        onError,
    });

    const { mutate: refuseTandem, isLoading: isLoadingRefuseTandem } = useRefuseTandem({
        onSuccess,
        onError,
    });

    const { mutate: updateTandem, isLoading: isLoadingUpdateTandem } = useUpdateTandem({
        onSuccess,
        onError,
    });

    const handleConfirm = () => {
        if (modalAction === TandemAction.ACCEPT) {
            if (tandemId) {
                validateTandem(tandemId);
            } else if (learningLanguageIds) {
                createTandem({
                    learningLanguageIds,
                    relaunch: relaunchGlobalRoutineOnAccept,
                });
            }
        } else {
            if (learningLanguageIds?.length !== 2) {
                throw new Error('Must have 2 learning languages to refuse tandem');
            }
            refuseTandem({
                learningLanguageIds,
                relaunch: relaunchGlobalRoutineOnRefuse,
            });
        }
    };

    const message =
        modalAction === TandemAction.ACCEPT
            ? translate('learning_languages.show.tandems.actions.validateMessage')
            : translate('learning_languages.show.tandems.actions.refuseMessage');

    return (
        <>
            <Modal
                aria-describedby="modal-modal-description"
                aria-labelledby="modal-modal-title"
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
                    {isLoadingValidateTandem ||
                    isLoadingCreateTandem ||
                    isLoadingRefuseTandem ||
                    isLoadingUpdateTandem ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <p>{message}</p>
                            <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-around' }}>
                                <Button
                                    label={translate('learning_languages.show.tandems.actions.ctaLabels.cancel')}
                                    onClick={handleCloseModal}
                                    variant="text"
                                />
                                <Button
                                    color="error"
                                    label={translate('learning_languages.show.tandems.actions.ctaLabels.confirm')}
                                    onClick={handleConfirm}
                                    variant="outlined"
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
            {!disableCreateButton && (
                <IconButton aria-label="accept" color="success" onClick={() => handleAction(TandemAction.ACCEPT)}>
                    <Check />
                </IconButton>
            )}
            <IconButton aria-label="reject" color="error" onClick={() => handleAction(TandemAction.REFUSE)}>
                <Clear />
            </IconButton>
            {tandemId && (tandemStatus === TandemStatus.ACTIVE || tandemStatus === TandemStatus.PAUSED) && (
                <Button
                    color="info"
                    label={translate(
                        `learning_languages.show.tandems.actions.ctaLabels.${
                            tandemStatus === TandemStatus.PAUSED ? 'free' : 'pause'
                        }`
                    )}
                    onClick={() =>
                        updateTandem({
                            tandemId,
                            tandemStatus:
                                tandemStatus === TandemStatus.PAUSED ? TandemStatus.ACTIVE : TandemStatus.PAUSED,
                        })
                    }
                    variant="outlined"
                />
            )}
        </>
    );
};

export default TandemActions;
