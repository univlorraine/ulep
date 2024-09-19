import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useNotify, useRecordContext, useRefresh, useTranslate, useUpdate } from 'react-admin';
import CertificateForm from '../../../components/form/CertificateForm';
import { CertificateFormPayload, LearningLanguage } from '../../../entities/LearningLanguage';
import { Profile } from '../../../entities/Profile';

const CertifcateModal = ({ profile }: { profile: Profile }) => {
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
                `learning-languages/${record.id}/generate-certificate`,
                { data: payload },
                {
                    onSettled: (_, error: unknown) => {
                        if (!error) {
                            refresh();

                            return notify('ra.notification.updated', { messageArgs: { smart_count: 1 } });
                        }

                        return notify('administrators.update.error');
                    },
                }
            );
        } catch (err) {
            console.error(err);

            return notify('administrators.update.error');
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

export default CertifcateModal;
