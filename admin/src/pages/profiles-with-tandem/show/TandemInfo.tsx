import { Box, Typography } from '@mui/material';
import { useRefresh, useTranslate } from 'react-admin';
import { LearningLanguage } from '../../../entities/LearningLanguage';
import { Tandem } from '../../../entities/Tandem';
import TandemActions from './Actions/TandemActions';

type TandemInfoProps = {
    tandem: Tandem;
    hasActiveTandem?: boolean;
    userLearningLanguage?: LearningLanguage;
    partnerLearningLanguage?: LearningLanguage;
};

const TandemInfo = ({ tandem, hasActiveTandem, userLearningLanguage, partnerLearningLanguage }: TandemInfoProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();

    return (
        <Box>
            <Typography className="profile-header" variant="h4">
                {translate('learning_languages.show.management.pairing_infos')}
            </Typography>
            <div className="line">
                <span className="label">
                    <Typography>{translate('learning_languages.show.fields.tandemCreatedAt')}</Typography>
                </span>
                <span>{new Date(tandem.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="line">
                <span className="label">
                    <Typography>{translate('learning_languages.show.fields.tandemUpdatedAt')}</Typography>
                </span>
                <span>{new Date(tandem.updatedAt).toLocaleDateString()}</span>
            </div>
            {hasActiveTandem && userLearningLanguage && partnerLearningLanguage && (
                <TandemActions
                    learningLanguageIds={[userLearningLanguage.id, partnerLearningLanguage.id]}
                    onTandemAction={refresh}
                    tandemId={tandem?.id}
                    tandemStatus={tandem?.status}
                    disableCreateButton
                    relaunchGlobalRoutineOnRefuse
                />
            )}
        </Box>
    );
};

export default TandemInfo;
