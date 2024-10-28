import { IonButton, IonModal } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { codeLanguageToFlag } from '../../utils';
import styles from './ChangeLanguageModal.module.css';

interface ChangeLanguageModalProps {
    isVisible: boolean;
    onClose: () => void;
    onLanguageCodeChange: (languageCode: string) => void;
    currentLanguageCode: string;
    allLanguagesCodes: string[];
}

const ChangeLanguageModal: React.FC<ChangeLanguageModalProps> = ({
    isVisible,
    onClose,
    onLanguageCodeChange,
    currentLanguageCode,
    allLanguagesCodes,
}) => {
    const { t } = useTranslation();
    const [currentLanguageCodeSelected, setCurrentLanguageCodeSelected] = useState(currentLanguageCode);

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.filterContainer}>
                    <h1>{t('news.show.change_language_modal.title')}</h1>

                    {allLanguagesCodes.map((languageCode) => (
                        <IonButton
                            fill="clear"
                            className={`${styles.languages} ${
                                languageCode === currentLanguageCodeSelected ? styles.selected : ''
                            }`}
                            onClick={() => setCurrentLanguageCodeSelected(languageCode)}
                        >
                            <span>{`${t(`languages_code.${languageCode}`)} ${codeLanguageToFlag(languageCode)}`}</span>
                        </IonButton>
                    ))}
                </div>
                <IonButton
                    fill="clear"
                    className="primary-button no-padding"
                    onClick={() => onLanguageCodeChange(currentLanguageCodeSelected)}
                >
                    {t('filter.apply')}
                </IonButton>
                <IonButton fill="clear" className="secondary-button" onClick={onClose}>
                    {t('filter.cancel')}
                </IonButton>
            </div>
        </IonModal>
    );
};

export default ChangeLanguageModal;
