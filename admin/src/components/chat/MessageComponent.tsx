import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button, colors, Link, Modal, Typography } from '@mui/material';
import { useId, useState } from 'react';
import { RaRecord, useLocaleState, useTranslate } from 'react-admin';
import User from '../../entities/User';
import handleDownloadFile from '../../utils/downloadFile';
import getLocaleCode from '../../utils/getLocaleCode';
import AudioLine from './AudioLine';
import OGCard from './OGCard';

interface MessageComponentProps {
    userId: string;
    message:
        | RaRecord
        | {
              id: string;
              content: string;
              createdAt: string;
              user: User;
              senderId?: string;
              type: 'text' | 'image' | 'audio' | 'link' | 'file';
              metadata: unknown;
          };
}

interface MessagePropsWithoutUserId {
    message: MessageComponentProps['message'];
}

function replaceURLs(content: string) {
    const words = content.split(/(https?:\/\/\S*)/);

    return (
        <>
            {words.map((word) =>
                word.match(/(http:|https:)+[^\s]+[\w]/) ? (
                    <span key={useId()}>
                        <a href={word} rel="noopener noreferrer" target="_blank">
                            {word}
                        </a>{' '}
                    </span>
                ) : (
                    <span key={useId()}>{word} </span>
                )
            )}
        </>
    );
}

const MessageText = ({ message }: MessagePropsWithoutUserId) => (
    <Typography sx={{ textWrap: 'wrap', overflow: 'hidden' }}>{message.content}</Typography>
);

const MessageImage = ({ message }: MessagePropsWithoutUserId) => {
    const [open, setOpen] = useState(false);
    const thumbnail = message.metadata?.thumbnail ?? message.content;
    const translate = useTranslate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button onClick={handleOpen}>
                <img alt="message" src={thumbnail} style={{ width: '100%', height: '100%' }} />
            </Button>
            <Modal onClose={handleClose} open={open}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    }}
                >
                    <img alt="message" src={message.content} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    <Button
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: 'white',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        {translate('chat.show.close')}
                    </Button>
                </Box>
            </Modal>
        </>
    );
};
const MessageAudio = ({ message }: MessagePropsWithoutUserId) => <AudioLine audioFile={message.content} />;

const MessageLink = ({ message }: MessagePropsWithoutUserId) => (
    <Box>
        <Box sx={{ backgroundColor: 'white', padding: 1, borderRadius: 1, marginBottom: 1 }}>
            <Link
                aria-label={message.metadata?.openGraphResult?.ogTitle || 'Lien externe'}
                href={message.metadata?.openGraphResult?.ogUrl}
                rel="noopener noreferrer"
                target="_blank"
                title={message.metadata?.openGraphResult?.ogTitle}
            >
                <OGCard
                    description={message.metadata?.openGraphResult?.ogDescription}
                    imageUrl={message.metadata?.openGraphResult?.ogImage?.[0]?.url}
                    title={message.metadata?.openGraphResult?.ogTitle}
                />
            </Link>
        </Box>
        <Typography sx={{ textWrap: 'wrap', overflow: 'hidden' }}>{replaceURLs(message.content)}</Typography>
    </Box>
);

const MessageFile = ({ message }: MessagePropsWithoutUserId) => {
    const fileName = message.metadata?.originalFilename;

    if (!message.content) {
        return null;
    }

    const onDownload = () => {
        handleDownloadFile(message.content, fileName);
    };

    return (
        <Box>
            <Button onClick={onDownload} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none' }}>
                {decodeURI(fileName) || 'Fichier sans nom'}
            </Button>
        </Box>
    );
};

const MessageComponent = ({ message, userId, ...props }: MessageComponentProps) => {
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const isCurrentUser = message.senderId ? message.senderId : message.user.id === userId;

    const renderMessage = () => {
        switch (message.type) {
            case 'image':
                return <MessageImage message={message} />;
            case 'audio':
                return <MessageAudio message={message} />;
            case 'link':
                return <MessageLink message={message} />;
            case 'file':
                return <MessageFile message={message} />;
            default:
                return <MessageText message={message} />;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 1,
                padding: 1,
                borderRadius: 2,
                borderRadiusBottomRight: 0,
                width: '80%',
                ...(isCurrentUser
                    ? {
                          marginLeft: '20%',
                          backgroundColor: colors.yellow[100],
                      }
                    : {
                          marginRight: '20%',
                          backgroundColor: colors.blue[100],
                      }),
            }}
            {...props}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 1,
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid black',
                }}
            >
                <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                    {isCurrentUser ? translate('chat.show.you') : `${message.user.firstname} ${message.user.lastname}`}
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                    {new Date(message.createdAt).toLocaleString(getLocaleCode(locale), {
                        dateStyle: 'long',
                        timeStyle: 'short',
                    })}
                </Typography>
            </Box>
            {renderMessage()}
        </Box>
    );
};

export default MessageComponent;
