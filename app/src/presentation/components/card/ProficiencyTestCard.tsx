import { useTranslation } from 'react-i18next';
import TestedLanguage from '../../../domain/entities/TestedLanguage';
import { codeLanguageToFlag } from '../../utils';
import styles from './ProficiencyTestCard.module.css';
import { AdviceSvg } from '../../../assets';

interface ProficiencyTestCardProps {
    testedLanguages: TestedLanguage[];
}

const ProficiencyTestCard: React.FC<ProficiencyTestCardProps> = ({ testedLanguages }) => {
    const { t } = useTranslation();
    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.proficiency_test.title')}</span>
            <div className={styles.container}>
                <div className={styles['container-content']}>
                    <div className={styles['container-image']}>
                        <img className={styles.image} src={AdviceSvg} />
                    </div>
                    <div>
                        <span className={styles.subtitle}>{t('home_page.proficiency_test.subtitle')}</span>
                        <div>
                            {testedLanguages.map((testedLanguage) => (
                                <span>{`( ${testedLanguage.level} ) ${codeLanguageToFlag(testedLanguage.code)}`}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <button className="primary-button margin-top" onClick={() => null}>
                    {t('home_page.proficiency_test.button')}
                </button>
            </div>
        </div>
    );
};

export default ProficiencyTestCard;
