import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import RequiredFieldsMention from '../components/forms/RequiredFieldsMention';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import TextInput from '../components/TextInput';
import styles from './css/SignUp.module.css';
import biographyStyles from './css/SignUpBiography.module.css';

const SignUpBiographyPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, deviceAdapter } = useConfig();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileEdit = useStoreState((store) => store.profileSignUp);
    const [errorMessage, setErrorMessage] = useState<{ id: string; value: string }>();
    const [powerBiography, setPowerBiography] = useState<string>(
        profileEdit.biography?.power ? profileEdit.biography?.power : ''
    );
    const [incredibleBiography, setIncredibleBiography] = useState<string>(
        profileEdit.biography?.incredible ? profileEdit.biography?.incredible : ''
    );
    const [placeBiography, setPlaceBiography] = useState<string>(
        profileEdit.biography?.place ? profileEdit.biography?.place : ''
    );
    const [travelBiography, setTravelBiography] = useState<string>(
        profileEdit.biography?.travel ? profileEdit.biography?.travel : ''
    );

    const isAFieldEmpty =
        powerBiography.trim().length === 0 ||
        incredibleBiography.trim().length === 0 ||
        placeBiography.trim().length === 0 ||
        travelBiography.trim().length === 0;

    const continueSignUp = async () => {
        const power = powerBiography.trim();
        const incredible = incredibleBiography.trim();
        const place = placeBiography.trim();
        const travel = travelBiography.trim();
        if (power.length < 10) {
            return setErrorMessage({ id: 'power', value: t('signup_biography_page.error_message') });
        } else if (incredible.length < 10) {
            return setErrorMessage({ id: 'incredible', value: t('signup_biography_page.error_message') });
        } else if (place.length < 10) {
            return setErrorMessage({ id: 'place', value: t('signup_biography_page.error_message') });
        } else if (travel.length < 10) {
            return setErrorMessage({ id: 'travel', value: t('signup_biography_page.error_message') });
        }
        updateProfileSignUp({
            biography: {
                incredible,
                place,
                power,
                travel,
            },
        });

        history.push('/signup/availabilities');
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={72}
            headerTitle={t('global.create_account_title')}
        >
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                <div>
                    <h1 className="title">{t('signup_biography_page.title')}</h1>
                    <h2 className="subtitle">{t('signup_biography_page.subtitle')}</h2>
                    <RequiredFieldsMention />

                    <div className={biographyStyles['input-container']}>
                        <TextInput
                            id="input-power"
                            errorMessage={errorMessage?.id === 'power' ? errorMessage.value : undefined}
                            onChange={setPowerBiography}
                            placeholder={t('signup_biography_page.power_placeholder')}
                            title={t('signup_biography_page.power_title') as string}
                            type="text-area"
                            value={powerBiography}
                            required={true}
                        />
                    </div>

                    <div className={biographyStyles['input-container']}>
                        <TextInput
                            id="input-incredible"
                            errorMessage={errorMessage?.id === 'incredible' ? errorMessage.value : undefined}
                            onChange={setIncredibleBiography}
                            placeholder={t('signup_biography_page.incredible_placeholder')}
                            title={t('signup_biography_page.incredible_title') as string}
                            type="text-area"
                            value={incredibleBiography}
                            required={true}
                        />
                    </div>

                    <div className={biographyStyles['input-container']}>
                        <TextInput
                            id="input-place"
                            errorMessage={errorMessage?.id === 'place' ? errorMessage.value : undefined}
                            onChange={setPlaceBiography}
                            placeholder={t('signup_biography_page.place_placeholder')}
                            title={t('signup_biography_page.place_title') as string}
                            type="text-area"
                            value={placeBiography}
                            required={true}
                        />
                    </div>

                    <div className={biographyStyles['input-container']}>
                        <TextInput
                            id="input-travel"
                            errorMessage={errorMessage?.id === 'travel' ? errorMessage.value : undefined}
                            onChange={setTravelBiography}
                            placeholder={t('signup_biography_page.travel_placeholder')}
                            title={t('signup_biography_page.travel_title') as string}
                            type="text-area"
                            value={travelBiography}
                            required={true}
                        />
                    </div>
                </div>
                <div className={`${biographyStyles['bottom-container']} large-margin-top extra-large-margin-bottom`}>
                    <button
                        aria-label={t('signup_biography_page.validate_button') as string}
                        className={`primary-button ${isAFieldEmpty ? 'disabled' : ''}`}
                        disabled={isAFieldEmpty}
                        onClick={continueSignUp}
                    >
                        {t('signup_biography_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpBiographyPage;
