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
            <span className="home-card-title">{t('proficiency_test.title')}</span>
            <div className={styles.container}>
                <div className={styles['container-content']}>
                    <div className={styles['container-image']}>
                        <img alt="" className={styles.image} src={AdviceSvg} aria-hidden={true} />
                    </div>
                    <TestedLanguageComponent testedLanguages={testedLanguages} />
                </div>
                <div className={styles['card-button']}>
                    <button className={`primary-button`} onClick={() => history.push('/cefr/languages')}>
                        {t('proficiency_test.button')}
                    </button>
                </div>
            </div>
        </div>
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
            <span className={styles.subtitle}>{`${testedLanguages[0].level}  ( ${t(
                `languages_code.${testedLanguages[0].code}`
            )} ${codeLanguageToFlag(testedLanguages[0].code)} )`}</span>
        </div>
    );
};

export default ProficiencyTestCard;
