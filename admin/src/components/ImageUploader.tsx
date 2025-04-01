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

import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useRef, useState } from 'react';
import { ImageField, useNotify, useTranslate } from 'react-admin';
import ReferenceUploadImageField from './field/ReferenceUploadImageField';

interface ImageUploaderProps {
    source?: string;
    imageUrl?: string;
    maxSize?: number;
    onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    source,
    imageUrl = 'imageURL',
    maxSize = 1000000,
    onImageSelect,
}) => {
    const translate = useTranslate();
    const notify = useNotify();
    const [isDragOver, setDragOver] = useState<boolean>(false);
    const [currentFile, setCurrentFile] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            if (file.size > maxSize) {
                notify('uploader.maxSizeError', { messageArgs: { maxSize: maxSize / 1000000 }, type: 'error' });
            } else {
                setCurrentFile(file);
                onImageSelect(file);
            }
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
                border: isDragOver ? '1px dashed grey' : '1px solid lightgrey',
                borderRadius: 2,
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 150,
                width: 300,
            }}
        >
            <input
                ref={fileInputRef}
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                type="file"
            />

            {!source && !currentFile && (
                <Button onClick={() => fileInputRef.current?.click()}>
                    <ImageField source={imageUrl} />
                </Button>
            )}

            {source && !currentFile && (
                <Button onClick={() => fileInputRef.current?.click()}>
                    <ReferenceUploadImageField source={source} />
                </Button>
            )}

            {!currentFile &&
                (isDragOver ? (
                    <Typography variant="body1">{translate('uploader.drop_image')}</Typography>
                ) : (
                    <>
                        <Typography variant="body1">{translate('uploader.drag_drop')}</Typography>
                        <Button onClick={() => fileInputRef.current?.click()}>
                            <span>{translate('uploader.select_image')}</span>
                        </Button>
                    </>
                ))}

            {currentFile && (
                <Button onClick={() => fileInputRef.current?.click()}>
                    <img alt="preview" src={URL.createObjectURL(currentFile)} style={{ height: 150, width: 150 }} />
                </Button>
            )}

            <Typography variant="body1">{translate('uploader.maxSize', { maxSize: maxSize / 1000000 })}</Typography>
        </Box>
    );
};

export default ImageUploader;
