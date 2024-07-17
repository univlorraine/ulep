import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { AdviceSvg } from '../../../assets';
import TestedLanguage from '../../../domain/entities/TestedLanguage';
import { codeLanguageToFlag } from '../../utils';
import styles from './ProficiencyTestCard.module.css';

interface ProficiencyTestCardProps {
    testedLanguages: TestedLanguage[];
}

const ProficiencyTestCard: React.FC<ProficiencyTestCardProps> = ({ testedLanguages }) => {
    const { t } = useTranslation();
    const history = useHistory();
    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.proficiency_test.title')}</span>
            <div className={styles.container}>
                <div className={styles['container-content']}>
                    <div className={styles['container-image']}>
                        <img alt="" className={styles.image} src={AdviceSvg} aria-hidden={true} />
                    </div>
                    <div>
                        <span className={styles.subtitle}>{t('home_page.proficiency_test.subtitle')}</span>
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
                </div>
                <div className={styles['card-button']}>
                    <button className={`primary-button`} onClick={() => history.push('/cefr/languages')}>
                        {t('home_page.proficiency_test.button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProficiencyTestCard;
