import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AvailabilityModal.module.css';
import Modal from './Modal';

interface AvailabilityModalProps {
    isVisible: boolean;
    onClose: () => void;
    onValidate: (site: string) => void;
    sites: string[] | undefined;
}

const SitesModal: React.FC<AvailabilityModalProps> = ({ isVisible, onClose, onValidate, sites }) => {
    const { t } = useTranslation();
    const [currentSite, setCurrentSite] = useState<string>('');
    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div>
                <div className={styles.container}>
                    {sites &&
                        sites.map((site) => {
                            return (
                                <button
                                    key={site}
                                    style={{ backgroundColor: currentSite === site ? '#FDEE66' : '#F2F4F7' }}
                                    className={styles['occurence-container']}
                                    onClick={() => setCurrentSite(site)}
                                >
                                    <p className={styles['occurence-text']}>{site}</p>
                                </button>
                            );
                        })}

                    <button className="primary-button margin-top" onClick={() => onValidate(currentSite)}>
                        {t('signup_availabilities_page.modal.validate_button')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SitesModal;
