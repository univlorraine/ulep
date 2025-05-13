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

import { PlayArrow } from '@mui/icons-material';
import { Modal, Box, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { Button, useNotify, useTranslate } from 'react-admin';
import UniversitiesPicker from '../../../components/UniversitiesPicker';
import { RoutineExecutionStatus } from '../../../entities/RoutineExecution';
import University, { isCentralUniversity } from '../../../entities/University';
import useLastGlobalRoutineExecution from './useLastGlobalRoutineExecution';
import useLaunchGlobalRoutine from './useLaunchGlobalRoutine';

interface ActionsProps {
    onGlobalRoutineEnded?: () => void;
    universityIds: string[];
    selectedUniversityIds: string[];
    setSelectedUniversityIds: (ids: string[]) => void;
}

const Actions = ({
    onGlobalRoutineEnded,
    universityIds,
    selectedUniversityIds,
    setSelectedUniversityIds,
}: ActionsProps) => {
    const translate = useTranslate();
    const notify = useNotify();

    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState<boolean>(false);

    const {
        data: lastGlobalRoutineExecution,
        isPending: isLoadingLastGlobalRoutine,
        refetch: refetchGlobalRoutine,
    } = useLastGlobalRoutineExecution(onGlobalRoutineEnded);

    const globalRoutineIsCurrentlyRunning = lastGlobalRoutineExecution?.status === RoutineExecutionStatus.ON_GOING;

    const { mutate, isPending } = useLaunchGlobalRoutine({
        onSuccess: async () => {
            setConfirmModalIsOpen(false);
            await refetchGlobalRoutine();
        },
        onError: (err: unknown) => {
            console.error(err);
            notify(translate('learning_languages.list.globalRoutineModal.error'), { type: 'error' });
        },
    });
    const handleConfirm = () => {
        mutate(universityIds);
    };

    return (
        <Box
            sx={{
                backgroundColor: '#fcfcfc',
                display: 'flex',
                gap: '50px',
                alignItems: 'center',
                padding: '20px',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                marginBottom: '20px',
            }}
        >
            <Box sx={{ flex: '1' }}>
                <UniversitiesPicker
                    filterUniversities={(university: University) => !isCentralUniversity(university)}
                    label={translate('learning_languages.list.universitiesPicker.label')}
                    onSelected={(ids) => setSelectedUniversityIds(ids)}
                    placeholder={translate('learning_languages.list.universitiesPicker.label')}
                    value={selectedUniversityIds}
                />
            </Box>
            <Box sx={{ width: 'fit-content' }}>
                {isLoadingLastGlobalRoutine && <CircularProgress size={15} />}
                {!isLoadingLastGlobalRoutine && globalRoutineIsCurrentlyRunning && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 0.5 }}>
                        <CircularProgress size={15} />
                        <span>{translate('learning_languages.list.actions.globalRoutine.runningLabel')}</span>
                    </Box>
                )}
                {!isLoadingLastGlobalRoutine && !globalRoutineIsCurrentlyRunning && (
                    <Button
                        color="primary"
                        label={translate('learning_languages.list.actions.globalRoutine.ctaLabel')}
                        onClick={() => setConfirmModalIsOpen(true)}
                        startIcon={<PlayArrow />}
                        variant="outlined"
                    />
                )}
            </Box>
            <Modal
                aria-describedby="modal-modal-description"
                aria-labelledby="modal-modal-title"
                onClose={() => setConfirmModalIsOpen(false)}
                open={confirmModalIsOpen}
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
                    {isPending ? (
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                                heigh: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <p>{translate('learning_languages.list.globalRoutineModal.description')}</p>
                            <p>{translate('learning_languages.list.globalRoutineModal.confirmMessage')}</p>
                            <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-around' }}>
                                <Button
                                    label={translate('learning_languages.list.globalRoutineModal.ctaLabels.cancel')}
                                    onClick={() => setConfirmModalIsOpen(false)}
                                    variant="text"
                                />
                                <Button
                                    color="error"
                                    label={translate('learning_languages.list.globalRoutineModal.ctaLabels.confirm')}
                                    onClick={handleConfirm}
                                    variant="outlined"
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Actions;
