import { Directory, Filesystem } from '@capacitor/filesystem';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import DeviceAdapterInterface from './interfaces/DeviceAdapter.interface';
import FileAdapterInterface from './interfaces/FileAdapter.interface';

class FileAdapter implements FileAdapterInterface {
    deviceAdapter: DeviceAdapterInterface;

    constructor(deviceAdapter: DeviceAdapterInterface) {
        this.deviceAdapter = deviceAdapter;
    }

    async getFile(): Promise<File | undefined> {
        const pickedFiles = await FilePicker.pickFiles({
            types: [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
                'application/vnd.oasis.opendocument.text', // .odt
                'application/vnd.oasis.opendocument.spreadsheet', // .ods
                'application/vnd.oasis.opendocument.presentation', // .odp
            ],
            readData: true,
        });

        if (pickedFiles.files.length > 0) {
            const pickedFile = pickedFiles.files[0];
            return this.createFileFromPickedFile(pickedFile);
        }

        return undefined;
    }

    async saveFile(file: string, filename: string): Promise<void> {
        const response = await fetch(file);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        if (this.deviceAdapter.isNativePlatform()) {
            const filePath = `${Directory.Documents}/${filename}`;
            const base64Data = await this.convertBlobToBase64(blob);
            await Filesystem.writeFile({
                path: filePath,
                data: base64Data,
                directory: Directory.Documents,
                recursive: true,
            });
        } else {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'true';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    }

    async saveBlob(blob: Blob, filename: string): Promise<void> {
        const url = window.URL.createObjectURL(blob);
        await this.saveFile(url, filename);
    }

    private convertBlobToBase64 = async (blob: Blob): Promise<string> => {
        const arrayBuffer = await blob.arrayBuffer();
        const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return base64String;
    };

    private async createFileFromPickedFile(pickedFile: PickedFile): Promise<File | undefined> {
        if (pickedFile.blob) {
            // For web use the blob directly
            return new File([pickedFile.blob], pickedFile.name, { type: pickedFile.mimeType });
        } else if (pickedFile.data) {
            const byteString = atob(pickedFile.data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: pickedFile.mimeType });
            return new File([blob], pickedFile.name, { type: pickedFile.mimeType });
        }

        return undefined;
    }
}

export default FileAdapter;
