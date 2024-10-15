import { Box, Switch, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import { LearningLanguage } from '../../entities/LearningLanguage';

interface CertificateFormProps {
    record: LearningLanguage;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ record }) => {
    const translate = useTranslate();
    const [learningJournal, setLearningJournal] = useState<boolean>(record.learningJournal || false);
    const [consultingInterview, setConsultingInterview] = useState<boolean>(record.consultingInterview || false);
    const [sharedCertificate, setSharedCertificate] = useState<boolean>(record.sharedCertificate || false);

    return (
        <Box display="flex" flexDirection="column" gap="30px">
            <Box>
                <Typography variant="subtitle1">
                    {translate('learning_languages.show.fields.learningJournal')}
                </Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <Switch
                        checked={learningJournal}
                        color="secondary"
                        name="learningJournal"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setLearningJournal(event.target.checked)
                        }
                        value={learningJournal}
                    />
                </Box>
            </Box>
            <Box>
                <Typography variant="subtitle1">
                    {translate('learning_languages.show.fields.consultingInterview')}
                </Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <Switch
                        checked={consultingInterview}
                        color="secondary"
                        name="consultingInterview"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setConsultingInterview(event.target.checked)
                        }
                        value={consultingInterview}
                    />
                </Box>
            </Box>
            <Box>
                <Typography variant="subtitle1">
                    {translate('learning_languages.show.fields.sharedCertificate')}
                </Typography>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <Switch
                        checked={sharedCertificate}
                        color="secondary"
                        name="sharedCertificate"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setSharedCertificate(event.target.checked)
                        }
                        value={sharedCertificate}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default CertificateForm;
