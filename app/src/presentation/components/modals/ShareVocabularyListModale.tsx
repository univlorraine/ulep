import { IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import TandemBubble from '../tandems/TandemBubble';
import Modal from './Modal';
import styles from './ShareVocabularyListModale.module.css';

interface ShareVocabularyListModalProps {
    isVisible: boolean;
    onClose: () => void;
    onShareVocabularyList: (profile: Profile[]) => void;
    tandemsProfiles: Profile[];
    vocabularyList: VocabularyList;
}

const ShareVocabularyListModal: React.FC<ShareVocabularyListModalProps> = ({
    isVisible,
    onClose,
    onShareVocabularyList,
    tandemsProfiles,
    vocabularyList,
}) => {
    const { t } = useTranslation();
    const [profilesToShare, setProfilesToShare] = useState<Profile[]>([]);
    const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);

    const onValidate = () => {
        onShareVocabularyList(selectedProfiles);
        onClose();
    };

    console.log(vocabularyList);
    useEffect(() => {
        setProfilesToShare(tandemsProfiles.filter((profile) => !vocabularyList.editorsIds.includes(profile.id)));
    }, [isVisible, tandemsProfiles, vocabularyList]);

    useEffect(() => {
        setSelectedProfiles([]);
    }, [isVisible]);

    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <div className={styles.container}>
                <span className={styles.title}>{t('vocabulary.list.share.title')}</span>

                <div className={styles.list}>
                    {profilesToShare.map((profile) => (
                        <div
                            className={`${styles.bubble} ${selectedProfiles.includes(profile) ? styles.selected : ''}`}
                        >
                            <TandemBubble
                                key={profile.id}
                                profile={profile}
                                language={profile.nativeLanguage}
                                onTandemPressed={() => {
                                    setSelectedProfiles([...selectedProfiles, profile]);
                                }}
                            />
                        </div>
                    ))}
                </div>
                <IonButton className="primary-button" fill="clear" onClick={onValidate}>
                    {t('vocabulary.list.share.create')}
                </IonButton>
                <IonButton className="secondary-button" fill="clear" onClick={onClose}>
                    {t('vocabulary.list.share.cancel')}
                </IonButton>
            </div>
        </Modal>
    );
};

export default ShareVocabularyListModal;
