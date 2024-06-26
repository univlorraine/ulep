import { VoiceRecorder } from 'capacitor-voice-recorder';
import RecorderAdapterInterface from './interfaces/RecorderAdapter.interface';

export class RecorderAdapter implements RecorderAdapterInterface {
    private recordingTimeout: NodeJS.Timeout | null = null;
    private startTime: number | null = null;

    async startRecording(onStop: (audio: File) => void) {
        try {
            const permissionStatus = await VoiceRecorder.hasAudioRecordingPermission();
            if (!permissionStatus.value) {
                const requestPermission = await VoiceRecorder.requestAudioRecordingPermission();
                if (!requestPermission.value) {
                    console.error("Permission refusée pour l'enregistrement audio");
                    return;
                }
            }

            VoiceRecorder.startRecording();
            this.startTime = Date.now();

            this.recordingTimeout = setTimeout(() => {
                this.stopRecording(onStop);
            }, 60000);
        } catch (error) {
            console.error('Erreur lors de la vérification ou de la demande de permission', error);
        }
    }

    stopRecording(onStop: (audio: File) => void) {
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
                    const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
                    this.startTime = null;
                    onStop(audioFile);
                }
            })
            .catch((error) => {
                console.error("Erreur lors de l'arrêt de l'enregistrement", error);
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
