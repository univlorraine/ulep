import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import cefr from '../../domain/entities/cefr';
import { useStoreActions } from '../../store/storeTypes';
import WebLayoutCentered from '../components/WebLayoutCentered';
import pairingSelectLevelStyles from './css/PairingSelectLevel.module.css';
import styles from './css/SignUp.module.css';

const PairingSelectCEFRPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const history = useHistory();
    const [selectedLevel, setSelectedLevel] = useState<cefr>();

    const levels: cefr[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    const onValidateCefr = () => {
        updateProfileSignUp({ learningLanguageLevel: selectedLevel });
        return history.push('/signup/pairing/language/quizz/end');
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
                                    className={pairingSelectLevelStyles['level-container']}
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
                        className={`primary-button ${!selectedLevel ? 'disabled' : ''}`}
                        disabled={!selectedLevel}
                        onClick={onValidateCefr}
                    >
                        {t('pairing_select_level_page.validate_button')}
                    </button>
                    <button
                        className="secondary-button large-margin-top"
                        onClick={() => history.push('/signup/pairing/language/quizz/introduction')}
                    >
                        {t('pairing_select_level_page.test_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingSelectCEFRPage;
