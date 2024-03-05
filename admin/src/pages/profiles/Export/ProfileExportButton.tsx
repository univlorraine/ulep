import { Download } from '@mui/icons-material';
import React from 'react';
import { Button, useDataProvider, useRecordContext, useTranslate } from 'react-admin';

const ProfileExportButton = () => {
    const translate = useTranslate();
    const record = useRecordContext();
    const userId = record?.user?.id;

    const dataProvider = useDataProvider();

    const handleDownload = async () => {
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
    };

    if (!userId) return null;

    // TODO(NOW): disable + loading state ( <CircularProgress size={15} />)
    return <Button label={translate('profiles.export')} onClick={handleDownload} startIcon={<Download />} />;
};

export default ProfileExportButton;
