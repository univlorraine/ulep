import CloseIcon from '@mui/icons-material/Close';
import { Box, OutlinedInput, Typography } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';
import { useState } from 'react';
import { Button, SimpleForm, useDataProvider, useNotify, useTranslate } from 'react-admin';

type SendEmailProps = {
    setIsModalOpen: (value: boolean) => void;
    eventId: string;
};

const SendEmail = ({ setIsModalOpen, eventId }: SendEmailProps) => {
    const translate = useTranslate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const dataProvider = useDataProvider();
    const notify = useNotify();

    const handleSubmit = async () => {
        try {
            await dataProvider.sendEventUsersEmail(eventId, title, content);
            notify(translate('events.subscriptions.email.success'), { type: 'success' });
            setIsModalOpen(false);
        } catch (error) {
            notify(translate('events.subscriptions.email.error'), { type: 'error' });
        }
    };

    return (
        <Box sx={{ backgroundColor: 'white', padding: 5, margin: 10, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h3">{translate('events.subscriptions.email.title')}</Typography>
                <Button onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1">{translate('events.subscriptions.email.form.title')}</Typography>
                    <OutlinedInput
                        name="Title"
                        onChange={(e: any) => setTitle(e.target.value)}
                        type="text"
                        value={title}
                        fullWidth
                        required
                    />
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        '& .RaLabeled-label': { display: 'none' },
                        '& .MuiToolbar-root': { display: 'none' },
                    }}
                >
                    <Typography variant="subtitle1">{translate('events.subscriptions.email.form.content')}</Typography>
                    <SimpleForm sx={{ padding: 0 }}>
                        <RichTextInput
                            defaultValue={content}
                            onChange={(e: any) => setContent(e)}
                            source=""
                            fullWidth
                        />
                    </SimpleForm>
                </Box>
                <Button onClick={handleSubmit} variant="contained">
                    <span>{translate('events.subscriptions.email.send')}</span>
                </Button>
            </Box>
        </Box>
    );
};

export default SendEmail;
