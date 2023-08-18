import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
    image?: string;
    onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onImageSelect }) => {
    const [isDragOver, setDragOver] = useState<boolean>(false);
    const [currentFile, setCurrentFile] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setCurrentFile(file);
            onImageSelect(file);
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
        const file = event.dataTransfer.files?.[0];
        if (file) onImageSelect(file);
        setDragOver(false);
    };

    return (
        <Box
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
                border: isDragOver ? '2px dashed grey' : '2px solid lightgrey',
                borderRadius: 2,
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 150,
            }}
        >
            <input
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                type="file"
            />

            {image && !currentFile && <img alt="preview" src={image} style={{ height: 150, width: 150 }} />}

            {!currentFile &&
                (isDragOver ? (
                    <Typography variant="body1">Lâchez l&aposimage ici</Typography>
                ) : (
                    <>
                        <Typography variant="body1">Glissez et déposez une image ou</Typography>
                        <Button onClick={() => fileInputRef.current?.click()}>
                            <span>Choisissez une image</span>
                        </Button>
                    </>
                ))}

            {currentFile && (
                <Button onClick={() => fileInputRef.current?.click()}>
                    <img alt="preview" src={URL.createObjectURL(currentFile)} style={{ height: 150, width: 150 }} />
                </Button>
            )}
        </Box>
    );
};

export default ImageUploader;
