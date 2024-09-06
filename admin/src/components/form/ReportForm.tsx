import { Box, Typography, OutlinedInput } from '@mui/material';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import { ReportStatus } from '../../entities/Report';
import User from '../../entities/User';
import ReportStatusPicker from '../ReportStatusPicker';

interface ReportProps {
    handleSubmit: (status: ReportStatus, comment?: string) => void;
    category: string;
    content: string;
    status: ReportStatus;
    user: User;
    comment?: string;
}

const ReportForm: React.FC<ReportProps> = ({ handleSubmit, category, content, status, user, comment }) => {
    const translate = useTranslate();
    const [newStatus, setNewStatus] = useState<ReportStatus>(status);
    const [newComment, setNewComment] = useState<string | undefined>(comment);

    return (
        <Box sx={{ margin: '32px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
                <Typography variant="subtitle1">{translate(`global.firstname`)}</Typography>
                <Typography variant="subtitle2">
                    {user?.firstname ? user.firstname : translate('global.deleted_user')}
                </Typography>
            </Box>
            <Box>
                <Typography variant="subtitle1">{translate(`global.lastname`)}</Typography>
                <Typography variant="subtitle2">
                    {user?.lastname ? user.lastname : translate('global.deleted_user')}
                </Typography>
            </Box>
            <Box>
                <Typography variant="subtitle1">{translate(`global.email`)}</Typography>
                <Typography variant="subtitle2">
                    {user?.email ? user.email : translate('global.deleted_user')}
                </Typography>
            </Box>
            <Box>
                <Typography variant="subtitle1">{translate(`reports.update.status`)}</Typography>
                <ReportStatusPicker onChange={setNewStatus} value={newStatus} />
            </Box>
            <Box>
                <Typography variant="subtitle1">{translate(`reports.category`)}</Typography>
                <Typography variant="subtitle2">{category}</Typography>
            </Box>
            <Box>
                <Typography variant="subtitle1">{translate(`global.content`)}</Typography>
                <Typography variant="subtitle2">{content}</Typography>
            </Box>

            <Box>
                <Typography variant="subtitle1">{translate(`reports.update.comment`)}</Typography>
                <OutlinedInput
                    name="Content"
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={translate('global.content')}
                    value={newComment}
                    multiline
                    required
                />
            </Box>

            <Button
                color="primary"
                onClick={() => handleSubmit(newStatus, newComment)}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default ReportForm;
