import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions } from '../../store/storeTypes';
import TextInput from '../components/TextInput';
import WebLayoutCentered from '../components/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import biographyStyles from './css/SignUpBiography.module.css';

const SignUpBiographyPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [errorMessage, setErrorMessage] = useState<{ id: string; value: string }>();
    const [powerBiography, setPowerBiography] = useState<string>('');
    const [incredibleBiography, setIncredibleBiography] = useState<string>('');
    const [placeBiography, setPlaceBiography] = useState<string>('');
    const [travelBiography, setTravelBiography] = useState<string>('');

    const continueSignUp = async () => {
        if (powerBiography.length < 10) {
            return setErrorMessage({ id: 'power', value: t('signup_biography_page.error_message') });
        } else if (incredibleBiography.length < 10) {
            return setErrorMessage({ id: 'incredible', value: t('signup_biography_page.error_message') });
        } else if (placeBiography.length < 10) {
            return setErrorMessage({ id: 'place', value: t('signup_biography_page.error_message') });
        } else if (travelBiography.length < 10) {
            return setErrorMessage({ id: 'travel', value: t('signup_biography_page.error_message') });
        }
        updateProfileSignUp({
            biography: {
                incredible: incredibleBiography,
                place: placeBiography,
                power: powerBiography,
                travel: travelBiography,
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
            <div className={styles.body}>
                <div>
                    <h1 className="title">{t('signup_biography_page.title')}</h1>
                    <h2 className="subtitle">{t('signup_biography_page.subtitle')}</h2>

                    <div className={biographyStyles['input-container']}>
                        <TextInput
                            errorMessage={errorMessage?.id === 'power' ? errorMessage.value : undefined}
                            onChange={setPowerBiography}
                            placeholder={t('signup_biography_page.power_placeholder')}
                            title={t('signup_biography_page.power_title')}
                            type="text-area"
                            value={powerBiography}
                        />
                    </div>

                    <div className={biographyStyles['input-container']}>
                        <TextInput
                            errorMessage={errorMessage?.id === 'incredible' ? errorMessage.value : undefined}
                            onChange={setIncredibleBiography}
                            placeholder={t('signup_biography_page.incredible_placeholder')}
                            title={t('signup_biography_page.incredible_title')}
                            type="text-area"
                            value={incredibleBiography}
                        />
                    </div>

                    <div className={biographyStyles['input-container']}>
                        <TextInput
                            errorMessage={errorMessage?.id === 'place' ? errorMessage.value : undefined}
                            onChange={setPlaceBiography}
                            placeholder={t('signup_biography_page.place_placeholder')}
                            title={t('signup_biography_page.place_title')}
                            type="text-area"
                            value={placeBiography}
                        />
                    </div>

                    <div className={biographyStyles['input-container']}>
                        <TextInput
                            errorMessage={errorMessage?.id === 'travel' ? errorMessage.value : undefined}
                            onChange={setTravelBiography}
                            placeholder={t('signup_biography_page.travel_placeholder')}
                            title={t('signup_biography_page.travel_title')}
                            type="text-area"
                            value={travelBiography}
                        />
                    </div>
                </div>
                <div className={`${biographyStyles['bottom-container']} large-margin-top extra-large-margin-bottom`}>
                    <button className={`primary-button`} onClick={continueSignUp}>
                        {t('signup_biography_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpBiographyPage;
