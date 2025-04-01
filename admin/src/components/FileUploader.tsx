/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
