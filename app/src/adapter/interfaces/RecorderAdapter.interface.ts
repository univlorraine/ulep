export default interface RecorderAdapterInterface {
    startRecording(onStop: (audio?: File, error?: Error) => void): void;
    stopRecording(onStop: (audio?: File, error?: Error) => void): void;
}
