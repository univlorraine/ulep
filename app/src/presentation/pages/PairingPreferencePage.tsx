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
                        <button
                            className={pairingPreferenceStyles['preference-container']}
                            style={{ background: sameGender ? configuration.secondaryColor : '#F2F4F7' }}
                            onClick={() => setSameGender(!sameGender)}
                        >
                            <p className={pairingPreferenceStyles['preference-text']}>
                                {t('pairing_preference_page.same_gender')}
                            </p>
                        </button>
                        <button
                            className={pairingPreferenceStyles['preference-container']}
                            style={{ background: sameAge ? configuration.secondaryColor : '#F2F4F7' }}
                            onClick={() => setSameAge(!sameAge)}
                        >
                            <p className={pairingPreferenceStyles['preference-text']}>
                                {t('pairing_preference_page.same_age')}
                            </p>
                        </button>
                        <button
                            className={pairingPreferenceStyles['preference-container']}
                            style={{ background: !sameAge && !sameGender ? configuration.secondaryColor : '#F2F4F7' }}
                            onClick={onNonePressed}
                        >
                            <p className={pairingPreferenceStyles['preference-text']}>
                                {t('pairing_preference_page.none')}
                            </p>
                        </button>
                    </div>
                </div>
                <button className="primary-button extra-large-margin-bottom" onClick={onNextStepPressed}>
                    {t('pairing_preference_page.validate_button')}
                </button>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingPreferencePage;
