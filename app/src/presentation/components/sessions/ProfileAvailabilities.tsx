import { IonButton, IonIcon } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownSvg, ArrowUpSvg } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import { Availabilites } from '../../../domain/entities/ProfileSignUp';
import { AvailabilityText } from '../AvailabilityLine';
import styles from './ProfileAvailabilities.module.css';

interface ProfileAvailabilitiesProps {
    partner?: Profile;
}

const ProfileAvailabilities: React.FC<ProfileAvailabilitiesProps> = ({ partner }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    if (!partner) {
        return null;
    }

    const availabilities = Object.keys(partner.availabilities).filter(
        (key) => partner.availabilities[key as keyof Availabilites] !== 'UNAVAILABLE'
    );
    const openAvailabilities = () => setIsOpen(!isOpen);
    const isNoteAvailable = !partner.availabilitiesNotePrivacy && partner.availabilitiesNote;

    return (
        <div className={styles.container}>
            <div
                className={styles.header}
                onClick={openAvailabilities}
                role="button"
                aria-label={t('session.availabilities.open') as string}
            >
                <p className={styles.title}>{t('session.availabilities.title', { name: partner?.user.firstname })}</p>
                <IonButton fill="clear" onClick={openAvailabilities}>
                    {isOpen ? <IonIcon icon={ArrowUpSvg} /> : <IonIcon icon={ArrowDownSvg} />}
                </IonButton>
            </div>
            {isOpen && (
                <div className={styles.content}>
                    <div className={styles.availabilities_container}>
                        {availabilities.map((availabilityKey) => (
                            <AvailabilityText
                                key={availabilityKey}
                                availability={partner.availabilities[availabilityKey as keyof Availabilites]}
                                day={availabilityKey}
                                className={styles.availability_text}
                            />
                        ))}
                    </div>
                    {isNoteAvailable && (
                        <p>
                            <p className={styles.title}>{t('session.availabilities.note')}</p>
                            <div className={styles.note}>{partner.availabilitiesNote}</div>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileAvailabilities;
