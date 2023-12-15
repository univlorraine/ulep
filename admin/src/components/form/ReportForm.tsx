import { Box, Typography, Input } from '@mui/material';
import React, { useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import { ReportStatus } from '../../entities/Report';
import User from '../../entities/User';
import inputStyle from '../../theme/inputStyle';
import { textStyle, titleStyle } from '../../theme/textStyle';
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
        <Box sx={{ m: 4 }}>
            <Typography sx={titleStyle} variant="subtitle1">
                {translate(`global.firstname`)}
            </Typography>
            <Typography sx={textStyle} variant="subtitle2">
                {user?.firstname ? user.firstname : translate('global.deleted_user')}
            </Typography>
            <Typography sx={titleStyle} variant="subtitle1">
                {translate(`global.lastname`)}
            </Typography>
            <Typography sx={textStyle} variant="subtitle2">
                {user?.lastname ? user.lastname : translate('global.deleted_user')}
            </Typography>
            <Typography sx={titleStyle} variant="subtitle1">
                {translate(`global.email`)}
            </Typography>
            <Typography sx={textStyle} variant="subtitle2">
                {user?.email ? user.email : translate('global.deleted_user')}
            </Typography>
            <Typography sx={titleStyle} variant="subtitle1">
                {translate(`reports.update.status`)}
            </Typography>
            <ReportStatusPicker onChange={setNewStatus} value={newStatus} />
            <Typography sx={titleStyle} variant="subtitle1">
                {translate(`reports.category`)}
            </Typography>
            <Typography sx={textStyle} variant="subtitle2">
                {category}
            </Typography>
            <Typography sx={titleStyle} variant="subtitle1">
                {translate(`global.content`)}
            </Typography>
            <Typography sx={textStyle} variant="subtitle2">
                {content}
            </Typography>

            <Typography sx={titleStyle} variant="subtitle1">
                {translate(`reports.update.comment`)}
            </Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Content"
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={translate('global.content')}
                    sx={inputStyle}
                    value={newComment}
                    disableUnderline
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
