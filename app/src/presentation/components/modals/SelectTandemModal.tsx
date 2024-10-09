import { IonIcon } from '@ionic/react';
import Tandem from '../../../domain/entities/Tandem';
import TandemBubble from '../tandems/TandemBubble';
import styles from './SelectTandemModal.module.css';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';
import { CloseWhiteSvg } from '../../../assets';

interface SelectTandemModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectTandem: (tandem: Tandem) => void;
    tandems: Tandem[];
}

const SelectTandemModal: React.FC<SelectTandemModalProps> = ({ isVisible, onClose, onSelectTandem, tandems }) => {
    const { t } = useTranslation();
    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div className={styles.container}>
                <div className={styles.close} onClick={onClose} aria-hidden={true}>
                    <IonIcon icon={CloseWhiteSvg} />
                </div>
                <h2 className={styles.title}>{t('session.select_partner_title')}</h2>
                <div className={styles.list} role="list">
                    {tandems.map((tandem) => (
                        <div role="listitem" key={tandem.id}>
                            <TandemBubble
                                language={tandem.learningLanguage}
                                profile={tandem.partner}
                                onTandemPressed={() => onSelectTandem(tandem)} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default SelectTandemModal;

