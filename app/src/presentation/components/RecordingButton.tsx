import { IonButton, IonIcon } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RecordSvg, SenderSvg } from '../../assets';
import styles from './RecordingButton.module.css';

interface RecordingButtonProps {
    mode: 'send' | 'record';
    onSendPressed: () => void;
    handleStartRecord: () => void;
    handleStopRecord: () => void;
    isBlocked: boolean;
}

const RecordingButton = ({
    mode,
    onSendPressed,
    handleStartRecord,
    handleStopRecord,
    isBlocked,
}: RecordingButtonProps) => {
    const { t } = useTranslation();
    const [recording, setRecording] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (isBlocked) {
            return;
        }
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
    }, [recording, mode, isBlocked]);

    const startRecording = () => {
        if (mode === 'send' || isBlocked) {
            return;
        }
        setRecording(true);
        handleStartRecord();
    };

    const stopRecording = () => {
        if (mode === 'send' || isBlocked) {
            return;
        }
        setRecording(false);
        setTime(0);
        handleStopRecord();
    };

    return (
        <div className={styles['container']}>
            {recording && <div className={styles['timer']}>{time}s</div>}
            <IonButton
                aria-label={t('chat.send_button.aria_label') as string}
                fill="clear"
                className={styles['sender-button']}
                disabled={isBlocked}
                onClick={onSendPressed}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
            >
                <IonIcon
                    className={styles[mode === 'send' ? 'sender' : 'recorder']}
                    icon={mode === 'send' ? SenderSvg : RecordSvg}
                />
            </IonButton>
        </div>
    );
};

export default RecordingButton;
