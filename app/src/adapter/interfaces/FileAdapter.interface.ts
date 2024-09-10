interface FileAdapterInterface {
    getFile(): Promise<File | undefined>;
    saveFile(file: string, filename: string): Promise<void>;
    saveBlob(blob: Blob, filename: string): Promise<void>;
}

export default FileAdapterInterface;
