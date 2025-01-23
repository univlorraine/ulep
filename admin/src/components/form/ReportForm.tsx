import { Box, Typography, OutlinedInput, FormControlLabel, FormGroup, Switch } from '@mui/material';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import { ReportStatus } from '../../entities/Report';
import User from '../../entities/User';
import ReportStatusPicker from '../ReportStatusPicker';

interface ReportProps {
    handleSubmit: (status: ReportStatus, comment?: string, shouldDeleteMessage?: boolean) => void;
    category: string;
    content: string;
    status: ReportStatus;
    user: User;
    comment?: string;
    messageId?: string;
    isMessageDeleted?: boolean;
}

const ReportForm: React.FC<ReportProps> = ({
    handleSubmit,
    category,
    content,
    status,
    user,
    comment,
    messageId,
    isMessageDeleted,
}) => {
    const translate = useTranslate();
    const [newStatus, setNewStatus] = useState<ReportStatus>(status);
    const [newComment, setNewComment] = useState<string | undefined>(comment);
    const [shouldDeleteMessage, setShouldDeleteMessage] = useState<boolean>(Boolean(isMessageDeleted));

    return (
        <Box sx={{ margin: '32px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messageId && (
                <Box>
                    <Typography variant="subtitle1">{translate('reports.update.deletion_status')}</Typography>
                    <FormGroup>
                        <FormControlLabel
                            checked={shouldDeleteMessage}
                            control={<Switch onChange={(event: any) => setShouldDeleteMessage(event.target.checked)} />}
                            label={translate(`reports.delete_message`)}
                            value={shouldDeleteMessage}
                        />
                    </FormGroup>
                </Box>
            )}
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
                onClick={() => handleSubmit(newStatus, newComment, shouldDeleteMessage)}
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
