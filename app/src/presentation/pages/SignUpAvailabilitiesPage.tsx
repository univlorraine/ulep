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
    const [timezone, setTimezone] = useState<string>(profileSignUp._timezone);
    const [availabilities, setAvailabilities] = useState<Availabilites>(initialAvailabilities);
    const [openModal, setOpenModal] = useState<{ id: string; occurence: occurence } | null>();

    if (!profileSignUp.university) {
        return <Redirect to={'/signup'} />;
    }

    const continueSignUp = async () => {
        updateProfileSignUp({ availabilities, timezone });

        history.push('/signup/frequency');
    };

    const updateAvailabilities = (occurence: occurence, note?: string, isPrivate?: boolean) => {
        if (!openModal || !openModal) {
            return;
        }
        const currentAvailabilities = { ...availabilities };
        const key = openModal.id as keyof Availabilites;
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
                                availability={availabilities[availabilityKey as keyof Availabilites]}
                                day={availabilityKey}
                                onPress={(item) => setOpenModal(item)}
                            />
                        );
                    })}
                </div>
                <div className={`large-margin-top extra-large-margin-bottom`}>
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
