import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import { Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNotify, useTranslate } from 'react-admin';

interface RecordingButtonProps {
    mode: 'send' | 'record';
    onSendPressed?: () => void;
    handleStartRecord: () => void;
    handleStopRecord: () => void;
    hasPermission: boolean;
}

const RecordingButton = ({
    mode,
    onSendPressed,
    handleStartRecord,
    handleStopRecord,
    hasPermission,
}: RecordingButtonProps) => {
    const [recording, setRecording] = useState(false);
    const [time, setTime] = useState(0);
    const translate = useTranslate();
    const notify = useNotify();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (recording && mode === 'record') {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (recording && mode === 'send') {
            setRecording(false);
            clearInterval(timer!);
            setTime(0);
        }

        return () => clearInterval(timer);
    }, [recording, mode]);

    const startRecording = () => {
        if (mode === 'send') {
            return;
        }

        if (!hasPermission) {
            notify(translate('chat.audioRecorder.permission'));
        } else {
            setRecording(true);
            handleStartRecord();
        }
    };

    const stopRecording = () => {
        if (mode === 'send') {
            return;
        }
        if (!hasPermission) {
            notify(translate('chat.audioRecorder.permission'));
        } else {
            setRecording(false);
            setTime(0);
            handleStopRecord();
        }
    };

    return (
        <Box sx={{ position: 'relative' }}>
            {recording && (
                <div
                    style={{
                        zIndex: 1000,
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontSize: '12px',
                    }}
                >
                    {time}s
                </div>
            )}
            <IconButton
                onClick={onSendPressed}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchEnd={stopRecording}
                onTouchStart={startRecording}
                style={{ backgroundColor: 'black', borderRadius: '50%', padding: '10px' }}
            >
                {mode === 'send' ? (
                    <SendIcon style={{ color: 'white' }} />
                ) : (
                    <KeyboardVoiceIcon style={{ color: 'white' }} />
                )}
            </IconButton>
        </Box>
    );
};

export default RecordingButton;
