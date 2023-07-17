import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { getInitialAviability, occurence } from '../../domain/entities/Availability';
import { AvailabilitesSignUp } from '../../domain/entities/ProfileSignUp';
import { useStoreActions } from '../../store/storeTypes';
import Dropdown from '../components/DropDown';
import WebLayoutCentered from '../components/WebLayoutCentered';
import AvailabilityModal from '../components/modals/AvailabilityModal';
import styles from './css/SignUp.module.css';
import availabilitiesStyles from './css/SignUpAvailabilities.module.css';

const initialAvailabilities: AvailabilitesSignUp = {
    monday: getInitialAviability(),
    tuesday: getInitialAviability(),
    wednesday: getInitialAviability(),
    thursday: getInitialAviability(),
    friday: getInitialAviability(),
    saturday: getInitialAviability(),
    sunday: getInitialAviability(),
};

const SignUpAvailabilitiesPage: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [timzeone, setTimezone] = useState<string>(''); //TODO: use university timezone on start
    const [availabilities, setAvailabilities] = useState<AvailabilitesSignUp>(initialAvailabilities);
    const [openModal, setOpenModal] = useState<{ id: string; occurence: occurence } | null>();

    const continueSignUp = async () => {
        updateProfileSignUp({ availabilities });

        history.push('/signup/frequency');
    };

    const updateAvailabilities = (occurence: occurence, note?: string, isPrivate?: boolean) => {
        if (!openModal || !openModal) {
            return;
        }
        const currentAvailabilities = { ...availabilities };
        const key = openModal.id as keyof AvailabilitesSignUp;
        currentAvailabilities[key].occurence = occurence;
        if (note) {
            currentAvailabilities[key].note = note;
        }
        if (isPrivate !== undefined) {
            currentAvailabilities[key].occurence = occurence;
        }
        setAvailabilities(currentAvailabilities);
        return setOpenModal(undefined);
    };

    return (
        <WebLayoutCentered headerColor="#FDEE66" headerPercentage={84} headerTitle={t('global.create_account_title')}>
            <div className={styles.body}>
                <div>
                    <h1 className={availabilitiesStyles.title}>{t('signup_availabilities_page.title')}</h1>
                    <span className={availabilitiesStyles.subtitle}>{t('signup_availabilities_page.subtitle')}</span>

                    <div className={availabilitiesStyles.separator} />

                    <Dropdown<string>
                        onChange={setTimezone}
                        options={Intl.supportedValuesOf('timeZone').map((timzeone) => ({
                            title: timzeone,
                            value: timzeone,
                        }))}
                        title={t('signup_availabilities_page.timezone')}
                    />

                    <div className={availabilitiesStyles.separator} />

                    {Object.keys(availabilities).map((availabilityKey) => {
                        let color: string;
                        const status = availabilities[availabilityKey as keyof AvailabilitesSignUp].occurence;

                        switch (status) {
                            case 'AVAILABLE':
                                color = '#FF8700';
                                break;
                            case 'UNAVAILABLE':
                                color = '#F60C36';
                                break;
                            default:
                                color = '#00FF47';
                        }
                        return (
                            <button
                                key={availabilityKey}
                                className={availabilitiesStyles['day-container']}
                                onClick={() => setOpenModal({ id: availabilityKey, occurence: status })}
                            >
                                <span
                                    className={availabilitiesStyles['availability-day']}
                                    style={{ color: status === 'UNAVAILABLE' ? '#767676' : 'black' }}
                                >
                                    {t(`days.${availabilityKey}`)}
                                </span>
                                <div className={availabilitiesStyles['availability-container']}>
                                    <div style={{ backgroundColor: color }} className={availabilitiesStyles.dot} />
                                    <span
                                        className={availabilitiesStyles['availability-status']}
                                        style={{ color: status === 'UNAVAILABLE' ? '#767676' : 'black' }}
                                    >
                                        {t(`signup_availabilities_page.${status}`)}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
                <div className={`${availabilitiesStyles['bottom-container']} large-margin-top large-margin-bottom`}>
                    <button className="primary-button" onClick={continueSignUp}>
                        {t('signup_availabilities_page.validate_button')}
                    </button>
                </div>
                <AvailabilityModal
                    currentOccurence={openModal?.occurence}
                    onClose={() => setOpenModal(undefined)}
                    onValidate={updateAvailabilities}
                    isVisible={!!openModal}
                    title={t(`days.${openModal?.id}`)}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpAvailabilitiesPage;
