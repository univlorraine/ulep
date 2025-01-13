import { Download } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import React from 'react';
import { Button, useDataProvider, useNotify, useTranslate } from 'react-admin';
import { useMutation } from 'react-query';

interface LogExportButtonProps {
    learningLanguageId: string;
    languageCode: string;
}

const LogExportButton = ({ learningLanguageId, languageCode }: LogExportButtonProps) => {
    const translate = useTranslate();
    const notify = useNotify();

    const dataProvider = useDataProvider();

    const { mutate: handleDownload, isLoading } = useMutation(
        async () => {
            const response = await dataProvider.exportLogEntries(learningLanguageId);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `log_entries_${languageCode}.csv`);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        },
        {
            onError: (err: unknown) => {
                console.error(err);
                notify(translate('profiles.export.error'), { type: 'error' });
            },
        }
    );

    const onDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleDownload();
    };

    return (
        <Button
            disabled={isLoading}
            label={translate('profiles.export.buttonLabel')}
            onClick={onDownload}
            startIcon={isLoading ? <CircularProgress size={15} /> : <Download />}
        />
    );
};

export default LogExportButton;
