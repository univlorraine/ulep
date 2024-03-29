import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { Availabilites, AvailabilitesOptions } from '../../domain/entities/ProfileSignUp';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import AvailabilityLine from '../components/AvailabilityLine';
import Dropdown, { DropDownItem } from '../components/DropDown';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import AvailabilityModal from '../components/modals/AvailabilityModal';
import AvailabilityNoteModal from '../components/modals/AvailabilityNoteModal';
import styles from './css/SignUp.module.css';
import availabilitiesStyles from './css/SignUpAvailabilities.module.css';
import moment from 'moment-timezone';

const initialAvailabilities: Availabilites = {
    monday: AvailabilitesOptions.VERY_AVAILABLE,
    tuesday: AvailabilitesOptions.VERY_AVAILABLE,
    wednesday: AvailabilitesOptions.VERY_AVAILABLE,
    thursday: AvailabilitesOptions.VERY_AVAILABLE,
    friday: AvailabilitesOptions.VERY_AVAILABLE,
    saturday: AvailabilitesOptions.VERY_AVAILABLE,
    sunday: AvailabilitesOptions.VERY_AVAILABLE,
};

const SignUpAvailabilitiesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const user = useStoreState((state) => state.user);
    const profileEdit = useStoreState((store) => store.profileSignUp);
    const university = user?.university || profileSignUp.university;
    const [timezone, setTimezone] = useState<string | undefined>(university?.timezone);
    const [availabilities, setAvailabilities] = useState<Availabilites>(
        profileEdit.availabilities ?? initialAvailabilities
    );
    const [openAvailabilityModal, setOpenAvailabilityModal] = useState<{
        id: string;
        occurence: AvailabilitiesOptions;
    } | null>();
    const [openFinalModal, setOpenFinalModal] = useState<boolean>(false);

    const continueSignUp = async (note?: string, isPrivate?: boolean) => {
        updateProfileSignUp({ availabilities, availabilityNote: note, availabilityNotePrivate: isPrivate, timezone });
        setOpenFinalModal(false);

        history.push('/signup/frequency');
    };

    const updateAvailabilities = (occurence: AvailabilitiesOptions) => {
        if (!openAvailabilityModal) {
            return;
        }
        const currentAvailabilities = { ...availabilities };
        const key = openAvailabilityModal.id as keyof Availabilites;
        currentAvailabilities[key] = occurence;
        setAvailabilities(currentAvailabilities);
        return setOpenAvailabilityModal(undefined);
    };

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

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
                        options={moment.tz.names().map(
                            (timezone: string): DropDownItem<string> => ({
                                label: timezone,
                                value: timezone,
                            })
                        )}
                        placeholder={university.timezone}
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
                    currentAvailabilitiesOptions={openAvailabilityModal?.occurence}
                    onClose={() => setOpenAvailabilityModal(undefined)}
                    onValidate={updateAvailabilities}
                    isVisible={!!openAvailabilityModal}
                    title={openAvailabilityModal ? t(`days.${openAvailabilityModal?.id}`) : ''}
                />
                <AvailabilityNoteModal
                    isVisible={openFinalModal}
                    onClose={() => setOpenFinalModal(false)}
                    onValidate={continueSignUp}
                    defaultIsPrivate={profileEdit?.availabilityNotePrivate}
                    defaultNote={profileEdit?.availabilityNote}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpAvailabilitiesPage;
