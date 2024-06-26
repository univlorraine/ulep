export default interface RecorderAdapterInterface {
    startRecording(onStop: (audio: File) => void): void;
    stopRecording(onStop: (audio: File) => void): void;
}
