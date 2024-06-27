interface FileAdapterInterface {
    getFile(): Promise<File | undefined>;
}

export default FileAdapterInterface;
