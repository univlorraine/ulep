import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { AdvicePng } from '../../../assets';
import TestedLanguage from '../../../domain/entities/TestedLanguage';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { codeLanguageToFlag, HYBRID_MAX_WIDTH } from '../../utils';
import LearningCard from './LearningCard';
import styles from './ProficiencyTestCard.module.css';

interface ProficiencyTestCardProps {
    testedLanguages: TestedLanguage[];
    currentColor?: string;
}

const ProficiencyTestCard: React.FC<ProficiencyTestCardProps> = ({ testedLanguages, currentColor }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    return (
        <LearningCard
            title={t('proficiency_test.title')}
            buttonText={t('proficiency_test.button') as string}
            onButtonPressed={() => history.push('/cefr/languages')}
        >
            <div className={styles.container} style={{ backgroundColor: currentColor }}>
                <div className={styles['container-content']}>
                    <div className={styles['container-image']}>
                        <img alt="" className={styles.image} src={AdvicePng} aria-hidden={true} />
                    </div>
                    {testedLanguages.length > 0 && <TestedLanguageComponent testedLanguages={testedLanguages} />}
                </div>
                {isHybrid && (
                    <div className={styles['card-button']}>
                        <button className={`primary-button`} onClick={() => history.push('/cefr/languages')}>
                            {t('proficiency_test.button')}
                        </button>
                    </div>
                )}
            </div>
        </LearningCard>
    );
};

const TestedLanguageComponent: React.FC<ProficiencyTestCardProps> = ({ testedLanguages }) => {
    const { t } = useTranslation();

    if (Array.isArray(testedLanguages) && testedLanguages.length > 1) {
        return (
            <div>
                <span className={styles.subtitle}>{t('proficiency_test.subtitle')}</span>
                <ul className={styles['tested-languages-list']}>
                    {testedLanguages.map((testedLanguage, index) => (
                        <li
                            className={styles['tested-languages']}
                            role="img"
                            aria-label={`${testedLanguage.level} ${testedLanguage.name}`}
                            key={index}
                        >{`${codeLanguageToFlag(testedLanguage.code)} ( ${testedLanguage.level} )${
                            index !== testedLanguages.length - 1 ? ', ' : ''
                        }`}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className={styles['tested-languages-list']}>
            <span className={styles.subtitle}>{`${testedLanguages[0]?.level}  ( ${t(
                `languages_code.${testedLanguages[0]?.code}`
            )} ${codeLanguageToFlag(testedLanguages[0]?.code)} )`}</span>
        </div>
    );
};

export default ProficiencyTestCard;
