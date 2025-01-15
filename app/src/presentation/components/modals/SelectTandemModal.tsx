import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseWhiteSvg } from '../../../assets';
import Tandem from '../../../domain/entities/Tandem';
import TandemBubble from '../tandems/TandemBubble';
import styles from './SelectTandemModal.module.css';

interface SelectTandemModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectTandem: (tandem: Tandem[]) => void;
    tandems: Tandem[];
    title: string;
    multiple?: boolean;
    selectedProfilesIds?: string[];
}

const SelectTandemModal: React.FC<SelectTandemModalProps> = ({
    isVisible,
    onClose,
    onSelectTandem,
    tandems,
    title,
    selectedProfilesIds,
    multiple = false,
}) => {
    const { t } = useTranslation();
    const [selectedTandems, setSelectedTandems] = useState<Tandem[]>([]);

    useEffect(() => {
        if (selectedProfilesIds) {
            setSelectedTandems(
                tandems.filter((tandem) => tandem.partner && selectedProfilesIds.includes(tandem.partner.id))
            );
        }
    }, [selectedProfilesIds, tandems]);

    const onTandemPressed = (tandem: Tandem) => {
        if (multiple) {
            if (selectedTandems.some((t) => t.id === tandem.id)) {
                setSelectedTandems([...selectedTandems.filter((t) => t.id !== tandem.id)]);
            } else {
                setSelectedTandems([...selectedTandems, tandem]);
            }
        } else {
            onSelectTandem([tandem]);
        }
    };

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.container}>
                {!multiple && (
                    <div className={styles.close} onClick={onClose} aria-hidden={true}>
                        <IonIcon icon={CloseWhiteSvg} />
                    </div>
                )}
                <h2 className={styles.title}>{t(title)}</h2>
                <div className={styles.list} role="list">
                    {tandems
                        .filter((tandem) => tandem.status === 'ACTIVE')
                        .map((tandem) => (
                            <div
                                role="listitem"
                                key={tandem.id}
                                className={`${styles.bubble} ${
                                    selectedTandems.some((t) => t.id === tandem.id) ? styles.selected : ''
                                }`}
                            >
                                <TandemBubble
                                    language={tandem.learningLanguage}
                                    profile={tandem.partner}
                                    onTandemPressed={() => onTandemPressed(tandem)}
                                />
                            </div>
                        ))}
                </div>
                {multiple && (
                    <div className={styles['button-container']}>
                        <IonButton
                            className="primary-button no-padding"
                            fill="clear"
                            onClick={() => onSelectTandem(selectedTandems)}
                        >
                            {t('vocabulary.list.share.create')}
                        </IonButton>
                        <IonButton className="secondary-button no-padding" fill="clear" onClick={onClose}>
                            {t('vocabulary.list.share.cancel')}
                        </IonButton>
                    </div>
                )}
            </div>
        </IonModal>
    );
};

export default SelectTandemModal;
