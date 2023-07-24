import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { frequency } from '../../domain/entities/ProfileSignUp';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import frequencyStyle from './css/SignUpFrequency.module.css';

const frequencies: frequency[] = [
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
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [frequency, setFrequency] = useState<frequency>();

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
                    <span className="subtitle">{t('signup_frequency_page.subtitle')}</span>

                    {frequencies.map((freq) => {
                        return (
                            <button
                                key={freq}
                                className={frequencyStyle['frequency-container']}
                                onClick={() => setFrequency(freq)}
                                style={{ background: freq !== frequency ? '#F2F4F7' : '#FDEE66' }}
                            >
                                <span className={frequencyStyle['frequency-text']}>
                                    {t(`signup_frequency_page.${freq}`)}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className={`${styles['bottom-container']} large-margin-bottom`}>
                    <button
                        className={`primary-button ${frequency === undefined ? 'disabled' : ''}`}
                        disabled={frequency === undefined}
                        onClick={continueSignUp}
                    >
                        {t('signup_frequency_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpFrequencyPage;
