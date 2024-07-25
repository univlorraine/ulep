export default interface RecorderAdapterInterface {
    requestPermission(): Promise<void>;
    startRecording(onStop: (audio?: File, error?: Error) => void): void;
    stopRecording(onStop: (audio?: File, error?: Error) => void): void;
}
