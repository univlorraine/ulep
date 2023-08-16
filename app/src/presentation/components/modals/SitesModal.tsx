import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Campus from '../../../domain/entities/Campus';
import styles from './AvailabilityModal.module.css';
import Modal from './Modal';

interface AvailabilityModalProps {
    isVisible: boolean;
    onClose: () => void;
    onValidate: (campus?: Campus) => void;
    sites: Campus[] | undefined;
}

const SitesModal: React.FC<AvailabilityModalProps> = ({ isVisible, onClose, onValidate, sites }) => {
    console.log(sites);
    const { t } = useTranslation();
    const [currentCampus, setCurrentCampus] = useState<Campus>();
    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div>
                <div className={styles.container}>
                    {sites &&
                        sites.map((campus) => {
                            return (
                                <button
                                    key={campus.id}
                                    style={{ backgroundColor: currentCampus === campus ? '#FDEE66' : '#F2F4F7' }}
                                    className={styles['occurence-container']}
                                    onClick={() => setCurrentCampus(campus)}
                                >
                                    <p className={styles['occurence-text']}>{campus.name}</p>
                                </button>
                            );
                        })}

                    <button
                        className={`primary-button margin-top ${currentCampus ? '' : 'disabled'}`}
                        disabled={!currentCampus}
                        onClick={() => onValidate(currentCampus)}
                    >
                        {t('signup_availabilities_page.modal.validate_button')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SitesModal;
