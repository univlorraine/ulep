import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ArrowLeftSvg, CameraSvg, ChatSvg, CloseBlackSvg } from '../../../assets';
import { ReactComponent as Background } from '../../../assets/background.svg';
import { useConfig } from '../../../context/ConfigurationContext';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import { useStoreState } from '../../../store/storeTypes';
import useOnOpenChat from '../../hooks/useOnOpenChat';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import styles from './TandemProfile.module.css';
import TandemProfileContent from './TandemProfileContent';

interface TandemProfileProps {
    id: string;
    language: Language;
    level: CEFR;
    onClose: () => void;
    pedagogy: Pedagogy;
    partnerProfile: Profile;
    partnerLearningLanguage: Language;
}

const TandemProfile: React.FC<TandemProfileProps> = ({
    id,
    language,
    level,
    onClose,
    pedagogy,
    partnerProfile,
    partnerLearningLanguage,
}) => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const meProfile = useStoreState((state) => state.profile);
    const history = useHistory();
    const onOpenChat = useOnOpenChat({ tandemId: id });

    if (!meProfile) {
        return null;
    }

    const onOpenVideoCall = () => {
        history.push({
            pathname: '/jitsi',
            search: `?roomName=${id}`,
            state: { tandem: partnerProfile },
        });
    };

    return (
        <div
            id="modal-content"
            className={`content-wrapper ${styles.container}`}
            style={{ backgroundColor: configuration.secondaryColor }}
        >
            <Background className={styles.image} style={{ color: configuration.secondaryBackgroundImageColor }} />
            <div className={styles.actions}>
                {isHybrid && (
                    <button
                        aria-label={t('global.go_back') as string}
                        className={styles['back-button']}
                        style={{ alignItems: 'center', display: 'flex', flexGrow: 2 }}
                        onClick={onClose}
                    >
                        <img alt={t('global.go_back') as string} src={ArrowLeftSvg} />
                    </button>
                )}
                <button
                    aria-label={t('global.open_chat') as string}
                    className={styles['action-button']}
                    onClick={onOpenChat}
                >
                    <img alt={t('global.open_chat') as string} src={ChatSvg} />
                </button>
                <button
                    aria-label={t('global.start_video_call') as string}
                    className={styles['action-button']}
                    onClick={onOpenVideoCall}
                >
                    <img alt={t('global.start_video_call') as string} src={CameraSvg} />
                </button>
                {!isHybrid && (
                    <button
                        aria-label={t('global.go_back') as string}
                        className={styles['back-button']}
                        style={{ paddingLeft: '20px' }}
                        onClick={onClose}
                    >
                        <img alt={t('global.go_back') as string} src={CloseBlackSvg} />
                    </button>
                )}
            </div>

            <TandemProfileContent
                language={language}
                level={level}
                pedagogy={pedagogy}
                partnerProfile={partnerProfile}
                partnerLearningLanguage={partnerLearningLanguage}
                className={styles.content}
            />
        </div>
    );
};

export default TandemProfile;
