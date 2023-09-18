import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { getInitialAviability, occurence } from '../../domain/entities/Availability';
import { Availabilites } from '../../domain/entities/ProfileSignUp';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import AvailabilityLine from '../components/AvailabilityLine';
import Dropdown from '../components/DropDown';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import AvailabilityModal from '../components/modals/AvailabilityModal';
import AvailabilityNoteModal from '../components/modals/AvailabilityNoteModal';
import styles from './css/SignUp.module.css';
import availabilitiesStyles from './css/SignUpAvailabilities.module.css';

const initialAvailabilities: Availabilites = {
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
    const { configuration } = useConfig();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    // @ts-ignore
    const [timezone, setTimezone] = useState<string>(profileSignUp.university.timezone);
    const [availabilities, setAvailabilities] = useState<Availabilites>(initialAvailabilities);
    const [openAvailabilityModal, setOpenAvailabilityModal] = useState<{ id: string; occurence: occurence } | null>();
    const [openFinalModal, setOpenFinalModal] = useState<boolean>(false);

    if (!profileSignUp.university) {
        return <Redirect to={'/signup'} />;
    }

    const continueSignUp = async (note?: string, isPrivate?: boolean) => {
        updateProfileSignUp({ availabilities, availabilityNote: note, availabilityNotePrivate: isPrivate, timezone });
        setOpenFinalModal(false);

        history.push('/signup/frequency');
    };

    const updateAvailabilities = (occurence: occurence, note?: string, isPrivate?: boolean) => {
        if (!openAvailabilityModal) {
            return;
        }
        const currentAvailabilities = { ...availabilities };
        const key = openAvailabilityModal.id as keyof Availabilites;
        currentAvailabilities[key].occurence = occurence;
        if (note) {
            currentAvailabilities[key].note = note;
        }
        if (isPrivate !== undefined) {
            currentAvailabilities[key].occurence = occurence;
        }
        setAvailabilities(currentAvailabilities);
        return setOpenAvailabilityModal(undefined);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={84}
            headerTitle={t('global.create_account_title')}
        >
            <div className={styles.body}>
                <div>
                    <h1 className="title">{t('signup_availabilities_page.title')}</h1>
                    <span className="subtitle">{t('signup_availabilities_page.subtitle')}</span>

                    <div className={availabilitiesStyles.separator} />

                    <Dropdown<string>
                        onChange={setTimezone}
                        //@ts-ignore
                        options={Intl.supportedValuesOf('timeZone').map((timzeone: string) => ({
                            title: timzeone,
                            value: timzeone,
                        }))}
                        placeholder={profileSignUp.university.timezone}
                        title={t('signup_availabilities_page.timezone')}
                    />

                    <div className={availabilitiesStyles.separator} />

                    {Object.keys(availabilities).map((availabilityKey) => {
                        return (
                            <AvailabilityLine
                                key={availabilityKey}
                                availability={availabilities[availabilityKey as keyof Availabilites]}
                                day={availabilityKey}
                                onPress={(item) => setOpenAvailabilityModal(item)}
                            />
                        );
                    })}
                </div>
                <div className={`large-margin-top extra-large-margin-bottom`}>
                    <button className="primary-button" onClick={() => setOpenFinalModal(true)}>
                        {t('signup_availabilities_page.validate_button')}
                    </button>
                </div>
                <AvailabilityModal
                    currentOccurence={openAvailabilityModal?.occurence}
                    onClose={() => setOpenAvailabilityModal(undefined)}
                    onValidate={updateAvailabilities}
                    isVisible={!!openAvailabilityModal}
                    title={openAvailabilityModal ? t(`days.${openAvailabilityModal?.id}`) : ''}
                />
                <AvailabilityNoteModal
                    isVisible={openFinalModal}
                    onClose={() => setOpenFinalModal(false)}
                    onValidate={continueSignUp}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpAvailabilitiesPage;
