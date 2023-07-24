import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { UniversityJsonInterface, UniversityJsonToDomain } from '../../domain/entities/University';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import FlagBubble from '../components/FlagBubble';
import WebLayoutCentered from '../components/WebLayoutCentered';
import pairingLanguagesStyles from './css/PairingLanguages.module.css';
import styles from './css/SignUp.module.css';

const PairingLaguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllLanguages } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLaguage, setSelectedLanguage] = useState<Language>();

    if (!profileSignUp.university) {
        return <Redirect to={'/signup'} />;
    }

    const university = UniversityJsonToDomain(profileSignUp.university as unknown as UniversityJsonInterface); // Easy peasy remove getter and setter in stored object

    const getLanguages = async () => {
        let result = await getAllLanguages.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        const universityLanguages = result.filter((language) => university.languageCodes.includes(language.code));
        return setLanguages(universityLanguages);
    };

    const continueSignUp = async () => {
        updateProfileSignUp({ learningLanguage: selectedLaguage });
        history.push('/signup/pairing/pedagogy');
    };

    useEffect(() => {
        getLanguages();
    }, []);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={12}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div className={pairingLanguagesStyles.content}>
                    <h1 className={pairingLanguagesStyles.title}>{t('pairing_languages_page.title')}</h1>
                    <p className={pairingLanguagesStyles.subtitle}>{t('pairing_languages_page.subtitle')}</p>

                    <div className={pairingLanguagesStyles['languages-container']}>
                        {languages.map((language) => {
                            return (
                                <FlagBubble
                                    isSelected={selectedLaguage?.code === language.code}
                                    language={language}
                                    onPressed={setSelectedLanguage}
                                />
                            );
                        })}
                        {university.isCentral && (
                            <button
                                style={{ background: 'none' }}
                                onClick={() => history.push('/signup/pairing/other-languages')}
                            >
                                <img alt="plus" className={pairingLanguagesStyles.image} src={'assets/plus.svg'} />
                            </button>
                        )}
                    </div>
                </div>
                <div className={`${pairingLanguagesStyles['bottom-container']} large-margin-top large-margin-bottom`}>
                    <button
                        className={`primary-button ${!selectedLaguage ? 'disabled' : ''}`}
                        disabled={!selectedLaguage}
                        onClick={continueSignUp}
                    >
                        {t('pairing_languages_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default PairingLaguagesPage;
