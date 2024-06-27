import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import FileAdapterInterface from './interfaces/FileAdapter.interface';

class FileAdapter implements FileAdapterInterface {
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
        });

        if (pickedFiles.files.length > 0) {
            const pickedFile = pickedFiles.files[0];
            return this.createFileFromPickedFile(pickedFile);
        }

        return undefined;
    }

    private async createFileFromPickedFile(pickedFile: PickedFile): Promise<File | undefined> {
        if (pickedFile.blob) {
            // For web use the blob directly
            return new File([pickedFile.blob], pickedFile.name, { type: pickedFile.mimeType });
        } else if (pickedFile.path) {
            // For mobile, get the file from the path
            const response = await fetch(pickedFile.path);
            const fileBlob = await response.blob();
            return new File([fileBlob], pickedFile.name, { type: pickedFile.mimeType });
        } else if (pickedFile.data) {
            // If the base64 data is available, convert it to a Blob
            const byteString = atob(pickedFile.data.split(',')[1]);
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
