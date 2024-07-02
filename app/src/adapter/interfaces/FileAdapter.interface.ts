interface FileAdapterInterface {
    getFile(): Promise<File | undefined>;
    saveFile(file: string, filename: string): Promise<void>;
}

export default FileAdapterInterface;
