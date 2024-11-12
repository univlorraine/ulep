import { IonButton } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import pairingPreferenceStyles from './css/PairingPreference.module.css';
import styles from './css/SignUp.module.css';

const PairingPreferencePage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const updateProfileSignUp = useStoreActions((store) => store.updateProfileSignUp);
    const history = useHistory();
    const [sameAge, setSameAge] = useState<boolean>(false);
    const [sameGender, setSameGender] = useState<boolean>(false);

    const onNonePressed = () => {
        setSameAge(false);
        setSameGender(false);
    };

    const onNextStepPressed = () => {
        updateProfileSignUp({ sameAge, sameGender });
        return history.push(`/pairing/options`);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={72}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div>
                    <h1 className="title">{t('pairing_preference_page.title')}</h1>
                    <div className={pairingPreferenceStyles.content}>
                        <IonButton
                            aria-label={t('pairing_preference_page.same_gender') as string}
                            className={`${pairingPreferenceStyles['preference-container']} ${
                                sameGender ? 'secondary-selected-button' : ''
                            }`}
                            fill="clear"
                            onClick={() => setSameGender(!sameGender)}
                        >
                            <p className={pairingPreferenceStyles['preference-text']}>
                                {t('pairing_preference_page.same_gender')}
                            </p>
                        </IonButton>
                        <IonButton
                            aria-label={t('pairing_preference_page.same_age') as string}
                            className={`${pairingPreferenceStyles['preference-container']} ${
                                sameAge ? 'secondary-selected-button' : ''
                            }`}
                            fill="clear"
                            onClick={() => setSameAge(!sameAge)}
                        >
                            <p className={pairingPreferenceStyles['preference-text']}>
                                {t('pairing_preference_page.same_age')}
                            </p>
                        </IonButton>
                        <IonButton
                            aria-label={t('pairing_preference_page.none') as string}
                            className={`${pairingPreferenceStyles['preference-container']} ${
                                !sameAge && !sameGender ? 'secondary-selected-button' : ''
                            }`}
                            fill="clear"
                            onClick={onNonePressed}
                        >
                            <p className={pairingPreferenceStyles['preference-text']}>
                                {t('pairing_preference_page.none')}
                            </p>
                        </IonButton>
                    </div>
                </div>
                <IonButton
                    aria-label={t('pairing_preference_page.validate_button') as string}
                    fill="clear"
                    className="primary-button extra-large-margin-bottom no-padding"
                    onClick={onNextStepPressed}
                >
                    {t('pairing_preference_page.validate_button')}
                </IonButton>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingPreferencePage;
