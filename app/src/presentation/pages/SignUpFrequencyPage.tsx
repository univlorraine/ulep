import { IonButton } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import frequencyStyle from './css/SignUpFrequency.module.css';

const frequencies: MeetFrequency[] = [
    'ONCE_A_WEEK',
    'TWICE_A_WEEK',
    'THREE_TIMES_A_WEEK',
    'TWICE_A_MONTH',
    'THREE_TIMES_A_MONTH',
];

const SignUpFrequencyPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();
    const profileEdit = useStoreState((store) => store.profileSignUp);
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [frequency, setFrequency] = useState<MeetFrequency | undefined>(profileEdit?.frequency);

    const continueSignUp = async () => {
        updateProfileSignUp({ frequency });

        history.push('/signup/end');
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={97}
            headerTitle={t('global.create_account_title')}
        >
            <div className={styles.body}>
                <div className={frequencyStyle.container}>
                    <h1 className="title">{t('signup_frequency_page.title')}</h1>
                    <span className="subtitle large-margin-bottom">{t('signup_frequency_page.subtitle')}</span>

                    {frequencies.map((freq) => {
                        return (
                            <IonButton
                                key={freq}
                                aria-label={t(`signup_frequency_page.${freq}`) as string}
                                className={`${frequencyStyle['frequency-container']} ${
                                    freq === frequency ? 'primary-selected-button' : ''
                                }`}
                                fill="clear"
                                onClick={() => setFrequency(freq)}
                            >
                                <span className={frequencyStyle['frequency-text']}>
                                    {t(`signup_frequency_page.${freq}`)}
                                </span>
                            </IonButton>
                        );
                    })}
                </div>
                <div className="extra-large-margin-bottom">
                    <p style={{ textAlign: 'center' }}>{t('signup_frequency_page.required_mention')}</p>
                    <IonButton
                        aria-label={t('signup_frequency_page.validate_button') as string}
                        fill="clear"
                        className={`primary-button no-padding ${frequency === undefined ? 'disabled' : ''}`}
                        disabled={frequency === undefined}
                        onClick={continueSignUp}
                    >
                        {t('signup_frequency_page.validate_button')}
                    </IonButton>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpFrequencyPage;
