class AudioRecorderService {
    private mediaRecorder: MediaRecorder | null = null;

    private audioChunks: Blob[] = [];

    async startRecording(): Promise<void> {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
        };

        this.mediaRecorder.start();
    }

    stopRecording(): Promise<File | undefined> {
        return new Promise((resolve) => {
            if (!this.mediaRecorder) {
                resolve(undefined);
            } else {
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

                    resolve(audioFile);
                };

                this.mediaRecorder.stop();
            }
        });
    }
}

export default new AudioRecorderService();
