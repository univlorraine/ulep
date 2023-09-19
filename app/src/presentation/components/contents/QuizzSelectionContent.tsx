import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import styles from './QuizzSelectionContent.module.css';

interface QuizzDataInterface {
    value: CEFR;
    title: string;
}

interface QuizzSelectionContentProps {
    onQuizzSelected: (level: CEFR | undefined) => Promise<void>;
}

const QuizzSelectionContent: React.FC<QuizzSelectionContentProps> = ({ onQuizzSelected }) => {
    const { configuration } = useConfig();
    const { t } = useTranslation();
    const [selectQuizz, setSelectQuizz] = useState<CEFR>();

    const quizzData: QuizzDataInterface[] = [
        { value: 'A1', title: t('pairing_quizz_description_page.A1') },
        { value: 'A2', title: t('pairing_quizz_description_page.A2') },
        { value: 'B1', title: t('pairing_quizz_description_page.B1') },
        { value: 'C1', title: t('pairing_quizz_description_page.C1') },
    ];

    return (
        <>
            <div>
                <h1 className="title">{t('pairing_quizz_description_page.title')}</h1>
                <p className="subtitle">{t('pairing_quizz_description_page.subtitle')}</p>
                {quizzData.map((quizz, index) => {
                    return (
                        <button
                            key={quizz.value}
                            className={styles['level-container']}
                            onClick={() => setSelectQuizz(quizz.value)}
                            style={{
                                backgroundColor: quizz.value === selectQuizz ? configuration.secondaryColor : '#F2F4F7',
                            }}
                        >
                            <div className={styles['bubble-container']}>
                                <div
                                    className={styles.bubble}
                                    style={{ backgroundColor: index >= 1 ? 'black' : 'white' }}
                                />
                                <div
                                    className={styles.bubble}
                                    style={{ backgroundColor: index >= 2 ? 'black' : 'white' }}
                                />
                                <div
                                    className={styles.bubble}
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
                    className={`primary-button large-margin-bottom ${!selectQuizz ? 'disabled' : ''}`}
                    disabled={!selectQuizz}
                    onClick={() => onQuizzSelected(selectQuizz)}
                >
                    {t('pairing_quizz_description_page.validate_button')}
                </button>
                <button className="secondary-button extra-large-margin-bottom" onClick={() => onQuizzSelected('A1')}>
                    {t('pairing_quizz_description_page.pass_button')}
                </button>
            </div>
        </>
    );
};

export default QuizzSelectionContent;
