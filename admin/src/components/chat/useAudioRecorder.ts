import { useEffect, useState } from 'react';
import { useNotify, useTranslate } from 'react-admin';
import AudioRecorderService from '../../service/AudioRecorderService';

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const notify = useNotify();
    const translate = useTranslate();

    const startRecording = async () => {
        if (!hasPermission) {
            notify(translate('chat.audioRecorder.permission'));

            return;
        }

        try {
            await AudioRecorderService.startRecording();

            setIsRecording(true);
        } catch (error) {
            notify(translate('chat.audioRecorder.error'));
        }
    };

    const stopRecording = async (): Promise<File | undefined> => {
        if (!hasPermission) {
            return undefined;
        }

        try {
            const audioFile = await AudioRecorderService.stopRecording();
            setIsRecording(false);

            return audioFile;
        } catch (error) {
            notify(translate('chat.audioRecorder.error'));

            return undefined;
        }
    };

    const requestPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop());
            setHasPermission(true);
        } catch (error) {
            console.warn('Failed to get permission:', error);
            setHasPermission(false);
        }
    };

    useEffect(() => {
        requestPermission();
    }, []);

    return {
        hasPermission,
        isRecording,
        startRecording,
        stopRecording,
    };
};

export default useAudioRecorder;
