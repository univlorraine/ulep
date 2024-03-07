import { Download } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import React from 'react';
import { Button, useDataProvider, useRecordContext, useTranslate } from 'react-admin';
import { useMutation } from 'react-query';

const ProfileExportButton = () => {
    const translate = useTranslate();
    const record = useRecordContext();
    const userId = record?.user?.id;

    const dataProvider = useDataProvider();

    const { mutate: handleDownload, isLoading } = useMutation(async () => {
        const response = await dataProvider.exportUserPersonalData(userId);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `user_${userId}.csv`);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    });

    if (!userId) return null;

    return (
        <Button
            disabled={isLoading}
            label={translate('profiles.export')}
            onClick={() => handleDownload()}
            startIcon={isLoading ? <CircularProgress size={15} /> : <Download />}
        />
    );
};

export default ProfileExportButton;
