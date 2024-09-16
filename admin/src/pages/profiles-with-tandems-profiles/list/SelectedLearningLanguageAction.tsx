import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import { useDataProvider, useRefresh, useTranslate } from 'react-admin';

type SelectedLearningLanguageActionProps = {
    selectedLearningLanguages: string[];
    setSelectedLearningLanguages: (learningLanguages: string[]) => void;
};

const SelectedLearningLanguageAction = ({
    selectedLearningLanguages,
    setSelectedLearningLanguages,
}: SelectedLearningLanguageActionProps) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const refresh = useRefresh();

    const [open, setOpen] = useState(false);

    const handleDeleteLearningLanguages = async () => {
        await dataProvider.deleteMany('learning-languages', { ids: selectedLearningLanguages });
        setSelectedLearningLanguages([]);
        refresh();
        setOpen(false);
    };

    return (
        <>
            <Box
                sx={{
                    margin: '10px',
                    backgroundColor: '#fdee66',
                    width: 'fit-content',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <Typography>
                    {selectedLearningLanguages.length} {translate('learning_languages.list.checkboxAction.label')}
                </Typography>
                <Button color="primary" onClick={() => setOpen(true)} variant="contained">
                    {translate('learning_languages.list.checkboxAction.delete')}
                </Button>
            </Box>
            <Dialog open={open}>
                <DialogTitle>{translate('learning_languages.list.checkboxAction.dialog.title')}</DialogTitle>
                <DialogContent>{translate('learning_languages.list.checkboxAction.dialog.message')}</DialogContent>
                <DialogActions>
                    <Button color="success" onClick={handleDeleteLearningLanguages} variant="contained">
                        {translate('learning_languages.list.checkboxAction.dialog.ctaLabels.confirm')}
                    </Button>
                    <Button color="error" onClick={() => setOpen(false)} variant="contained">
                        {translate('learning_languages.list.checkboxAction.dialog.ctaLabels.cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SelectedLearningLanguageAction;
