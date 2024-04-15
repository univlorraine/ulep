import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import pairingSelectLevelStyles from './css/PairingSelectLevel.module.css';
import styles from './css/SignUp.module.css';

const PairingSelectCEFRPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const history = useHistory();
    const [selectedLevel, setSelectedLevel] = useState<CEFR>();

    const levels: CEFR[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    const onValidateCefr = () => {
        updateProfileSignUp({ learningLanguageLevel: selectedLevel });
        return history.push(`/pairing/language/quizz/end`);
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={60}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div>
                    <h1 className="title">{t('pairing_select_level_page.title')}</h1>
                    <p className="subtitle">{t('pairing_select_level_page.subtitle')}</p>
                    <button
                        aria-label={'A0' + t('pairing_select_level_page.no_knowledge')}
                        className={pairingSelectLevelStyles['level-container']}
                        onClick={() => setSelectedLevel('A0')}
                        style={{ backgroundColor: selectedLevel === 'A0' ? configuration.secondaryColor : '#F2F4F7' }}
                    >
                        {'A0'} <br /> {t('pairing_select_level_page.no_knowledge')}
                    </button>
                    <div className={pairingSelectLevelStyles['levels-container']}>
                        {levels.map((level) => {
                            return (
                                <button
                                    key={level}
                                    aria-label={level}
                                    className={pairingSelectLevelStyles['level-container-override']}
                                    onClick={() => setSelectedLevel(level)}
                                    style={{
                                        backgroundColor:
                                            selectedLevel === level ? configuration.secondaryColor : '#F2F4F7',
                                    }}
                                >
                                    {level}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="extra-large-margin-bottom">
                    <button
                        aria-label={t('pairing_select_level_page.validate_button') as string}
                        className={`primary-button ${!selectedLevel ? 'disabled' : ''}`}
                        disabled={!selectedLevel}
                        onClick={onValidateCefr}
                    >
                        {t('pairing_select_level_page.validate_button')}
                    </button>
                    <button
                        aria-label={t('pairing_select_level_page.test_button') as string}
                        className="secondary-button large-margin-top"
                        onClick={() => history.push(`/pairing/language/quizz/introduction`)}
                    >
                        {t('pairing_select_level_page.test_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingSelectCEFRPage;
