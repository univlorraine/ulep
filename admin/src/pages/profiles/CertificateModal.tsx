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

import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useNotify, useRecordContext, useRefresh, useTranslate, useUpdate } from 'react-admin';
import CertificateForm from '../../components/form/CertificateForm';
import { CertificateFormPayload, LearningLanguage } from '../../entities/LearningLanguage';
import { Profile } from '../../entities/Profile';

const CertificateModal = ({ profile }: { profile: Profile }) => {
    const refresh = useRefresh();
    const [open, setOpen] = React.useState(false);
    const translate = useTranslate();
    const [update] = useUpdate();
    const record = useRecordContext<LearningLanguage>();
    const notify = useNotify();

    const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleSubmit = async (payload: CertificateFormPayload) => {
        try {
            return await update(
                `learning-languages/${record?.id}/generate-certificate`,
                { id: '', data: payload },
                {
                    onSuccess: () => refresh(),
                    onError: (error) => {
                        console.error(error);
                        notify('certificates.error', {
                            type: 'error',
                        });
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('certificates.error');
        }
    };

    return (
        <>
            <IconButton
                aria-label={translate('learning_languages.certificateDialog.editCertificateBtn')}
                onClick={handleClickOpen}
                title={translate('learning_languages.certificateDialog.editCertificateBtn')}
            >
                <ContentPasteGoIcon />
            </IconButton>
            <Dialog
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        await handleSubmit({
                            learningJournal: Boolean(formJson.learningJournal),
                            consultingInterview: Boolean(formJson.consultingInterview),
                            sharedCertificate: Boolean(formJson.sharedCertificate),
                        });
                        handleClose();
                    },
                }}
                onClick={stopPropagation}
                onClose={handleClose}
                open={open}
            >
                <DialogTitle>
                    {translate('learning_languages.certificateDialog.title', {
                        name: `${profile.user.firstname} ${profile.user.lastname}`,
                    })}
                </DialogTitle>
                <DialogContent>
                    <CertificateForm record={record as LearningLanguage} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{translate('ra.action.cancel')}</Button>
                    <Button type="submit">
                        {translate('learning_languages.certificateDialog.generateCertificateBtn')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CertificateModal;
