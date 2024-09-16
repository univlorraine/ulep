import { Box, Typography } from '@mui/material';
import { usePermissions, useRefresh, useTranslate } from 'react-admin';
import { LearningLanguage, LearningLanguageWithTandemWithPartnerProfile } from '../../../entities/LearningLanguage';
import { TandemWithPartnerLearningLanguage } from '../../../entities/Tandem';
import hasTandemManagementPermission from '../hasTandemManagementPermission';
import TandemActions from './Actions/TandemActions';

type TandemInfoProps = {
    tandem: TandemWithPartnerLearningLanguage;
    hasActiveTandem?: boolean;
    userLearningLanguage?: LearningLanguageWithTandemWithPartnerProfile;
    partnerLearningLanguage?: LearningLanguage;
};

const TandemInfo = ({ tandem, hasActiveTandem, userLearningLanguage, partnerLearningLanguage }: TandemInfoProps) => {
    const translate = useTranslate();
    const refresh = useRefresh();
    const { permissions } = usePermissions();

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
            {hasTandemManagementPermission(permissions) &&
                hasActiveTandem &&
                userLearningLanguage &&
                partnerLearningLanguage && (
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
