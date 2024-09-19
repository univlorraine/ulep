import { DeleteOutline as DeleteIcon } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslate } from 'react-admin';
import ReferenceUploadFileField from './field/ReferenceUploadFileField';

interface FileUploaderProps {
    onFileSelect: (file: File | undefined) => void;
    source?: string;
    fileType?: string;
    [key: string]: any;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, source, fileType, ...props }) => {
    const translate = useTranslate();
    const [isDragOver, setDragOver] = useState<boolean>(false);
    const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = event.target.files?.[0];
        if (newFile) {
            setCurrentFile(newFile);
            onFileSelect(newFile);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const fileDroped = event.dataTransfer.files?.[0];
        if (fileDroped) onFileSelect(fileDroped);
        setDragOver(false);
    };

    const deleteFile = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onFileSelect(undefined);
        setCurrentFile(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Box
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
                border: isDragOver ? '1px dashed grey' : '1px solid lightgrey',
                borderRadius: 2,
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 50,
                minWidth: 350,
            }}
        >
            <input
                ref={fileInputRef}
                accept="application/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                type="file"
                {...props}
            />

            {!currentFile &&
                (isDragOver ? (
                    <Typography variant="body1">{translate('uploader.drop_file')}</Typography>
                ) : (
                    <>
                        <Typography variant="body1">
                            {translate('uploader.drag_drop_file', { fileType: fileType || translate('uploader.file') })}
                        </Typography>
                        <Button onClick={() => fileInputRef.current?.click()}>
                            <span>
                                {translate('uploader.select_file', {
                                    fileType: fileType || translate('uploader.file'),
                                })}
                            </span>
                        </Button>
                    </>
                ))}

            {currentFile && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button onClick={() => fileInputRef.current?.click()}>{currentFile.name}</Button>
                    <IconButton color="error" onClick={deleteFile}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}
            {source && !currentFile && <ReferenceUploadFileField source={source} />}
        </Box>
    );
};

export default FileUploader;
