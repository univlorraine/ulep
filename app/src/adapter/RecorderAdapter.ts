import { VoiceRecorder } from 'capacitor-voice-recorder';
import RecorderAdapterInterface from './interfaces/RecorderAdapter.interface';

export class RecorderAdapter implements RecorderAdapterInterface {
    private recordingTimeout: NodeJS.Timeout | null = null;
    private startTime: number | null = null;

    async requestPermission() {
        await VoiceRecorder.requestAudioRecordingPermission();
    }

    async startRecording(onStop: (audio?: File, error?: Error) => void) {
        try {
            const requestPermission = await VoiceRecorder.requestAudioRecordingPermission();

            if (!requestPermission.value) {
                return onStop(undefined, new Error('record.error.permission'));
            }
            await VoiceRecorder.startRecording();
            this.startTime = Date.now();

            this.recordingTimeout = setTimeout(() => {
                this.stopRecording(onStop);
            }, 60000);
        } catch (error) {
            console.error(error);
            onStop(undefined, new Error('record.error.unexpected'));
        }
    }

    stopRecording(onStop: (audio?: File, error?: Error) => void) {
        if (this.recordingTimeout) {
            clearTimeout(this.recordingTimeout);
            this.recordingTimeout = null;
        }

        VoiceRecorder.stopRecording()
            .then((result) => {
                if (result.value && result.value.recordDataBase64) {
                    const endTime = Date.now();
                    const duration = (endTime - (this.startTime || 0)) / 1000; // Durée en secondes

                    if (duration < 1) {
                        this.startTime = null;
                        return;
                    }

                    const audioBlob = this.base64ToBlob(result.value.recordDataBase64, 'audio/wav');
                    const audioFile = new File([audioBlob], `${Date.now()}.wav`, { type: 'audio/wav' });
                    this.startTime = null;
                    onStop(audioFile);
                }
            })
            .catch((error) => {
                console.error(error);
                onStop(undefined, new Error('record.error.unexpected'));
            });
    }

    private base64ToBlob(base64: string, type: string): Blob {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type });
    }
}
