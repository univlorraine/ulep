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

import { Box, CircularProgress, Modal } from '@mui/material';
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

    const { mutate: validateTandem, isPending: isLoadingValidateTandem } = useValidateTandem({
        onSuccess,
        onError,
    });
    const { mutate: createTandem, isPending: isLoadingCreateTandem } = useCreateTandem({
        onSuccess,
        onError,
    });

    const { mutate: refuseTandem, isPending: isLoadingRefuseTandem } = useRefuseTandem({
        onSuccess,
        onError,
    });

    const { mutate: updateTandem, isPending: isLoadingUpdateTandem } = useUpdateTandem({
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
            <Box className="tandem-actions">
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
                {!disableCreateButton && (
                    <Button
                        aria-label="accept"
                        color="success"
                        label={translate('learning_languages.show.management.validate')}
                        onClick={() => handleAction(TandemAction.ACCEPT)}
                        variant="contained"
                    />
                )}
                <Button
                    aria-label="reject"
                    color="error"
                    label={translate('learning_languages.show.management.refuse')}
                    onClick={() => handleAction(TandemAction.REFUSE)}
                    variant="contained"
                />
            </Box>
        </>
    );
};

export default TandemActions;
