import { IonButton, IonIcon } from '@ionic/react';
import { chevronDownOutline, chevronUpOutline, closeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hashtag from '../../../domain/entities/chat/Hashtag';
import styles from './HashtagsHeader.module.css';

interface HashtagsHeaderProps {
    hashtags: Hashtag[];
    onSearchHashtag: (hashtag?: Hashtag) => void;
}

const HashtagsHeader: React.FC<HashtagsHeaderProps> = ({ hashtags, onSearchHashtag }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [selectedHashtag, setSelectedHashtag] = useState<Hashtag>();

    const handleHashtagSelected = (hashtag: Hashtag) => {
        setSelectedHashtag(hashtag);
        onSearchHashtag(hashtag);
    };

    const handleHashtagUnselected = () => {
        setSelectedHashtag(undefined);
        onSearchHashtag();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>{t('chat.popularHashtags')}</span>
                <IonButton fill="clear" size="small" onClick={() => setIsOpen(!isOpen)}>
                    <IonIcon className={styles.openIcon} icon={isOpen ? chevronUpOutline : chevronDownOutline} />
                </IonButton>
            </div>
            {isOpen && !selectedHashtag && (
                <div className={styles.hashtagsContainer}>
                    {hashtags.map((hashtag) => (
                        <IonButton
                            key={hashtag.name}
                            fill="clear"
                            size="small"
                            className={styles.hashtagContainer}
                            onClick={() => handleHashtagSelected(hashtag)}
                        >
                            <span className={styles.hashtag}>{`#${hashtag.name}`}</span>
                        </IonButton>
                    ))}
                </div>
            )}
            {isOpen && selectedHashtag && (
                <IonButton
                    fill="clear"
                    size="small"
                    className={`${styles.selectedHashtagContainer} ${styles.hashtagContainer}`}
                    onClick={handleHashtagUnselected}
                >
                    <IonIcon icon={closeOutline} className={styles.closeIcon} />
                    <span className={`${styles.hashtag} ${styles.selectedHashtag}`}>{selectedHashtag.name}</span>
                </IonButton>
            )}
        </div>
    );
};

export default HashtagsHeader;
