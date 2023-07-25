import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/ConfigurationContext';
import WebLayoutCentered from '../components/WebLayoutCentered';
import quizzDescriptionStyle from './css/PairingQuizzLevelDescription.module.css';
import styles from './css/SignUp.module.css';

const PairingQuizzLevelDescriptionPage = () => {
    const { configuration } = useConfig();
    const { t } = useTranslation();
    const [selectQuizz, setSelectQuizz] = useState<string>();

    const quizzData = [
        { value: 'A1', title: t('pairing_quizz_description_page.A1') },
        { value: 'A2', title: t('pairing_quizz_description_page.A2') },
        { value: 'B1', title: t('pairing_quizz_description_page.B1') },
        { value: 'C1', title: t('pairing_quizz_description_page.C1') },
    ];

    const askQuizz = (level: string | undefined) => {
        if (!level) {
            return;
        }
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
                    <h1 className="title">{t('pairing_quizz_description_page.title')}</h1>
                    <p className="subtitle">{t('pairing_quizz_description_page.subtitle')}</p>
                    {quizzData.map((quizz, index) => {
                        return (
                            <button
                                className={quizzDescriptionStyle['level-container']}
                                onClick={() => setSelectQuizz(quizz.value)}
                                style={{
                                    backgroundColor:
                                        quizz.value === selectQuizz ? configuration.secondaryColor : '#F2F4F7',
                                }}
                            >
                                <div className={quizzDescriptionStyle['bubble-container']}>
                                    <div
                                        className={quizzDescriptionStyle.bubble}
                                        style={{ backgroundColor: index >= 1 ? 'black' : 'white' }}
                                    />
                                    <div
                                        className={quizzDescriptionStyle.bubble}
                                        style={{ backgroundColor: index >= 2 ? 'black' : 'white' }}
                                    />
                                    <div
                                        className={quizzDescriptionStyle.bubble}
                                        style={{ backgroundColor: index >= 3 ? 'black' : 'white' }}
                                    />
                                </div>
                                {quizz.title}
                            </button>
                        );
                    })}
                </div>
                <div>
                    <button
                        className="primary-button large-margin-bottom"
                        disabled={!selectQuizz}
                        onClick={() => askQuizz(selectQuizz)}
                    >
                        {t('pairing_quizz_description_page.validate_button')}
                    </button>
                    <button className="secondary-button large-margin-bottom" onClick={() => askQuizz('A0')}>
                        {t('pairing_quizz_description_page.pass_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingQuizzLevelDescriptionPage;
