import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import WebLayoutCentered from '../components/WebLayoutCentered';
import OtherLanguageContent from '../components/contents/OtherLanguageContent';
import OtherLanguageSelectedContent from '../components/contents/OtherLanguageSelectedContent';
import styles from './css/SignUp.module.css';

const PairingOtherLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { askForLanguage, configuration, getAllLanguages } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>();

    const getLanguages = async () => {
        let result = await getAllLanguages.execute(); // TODO: Change this later, use university ( profileSignUp.secondaryLanguages )

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setLanguages(result);
    };

    const onOtherLanguageSelected = async (language: Language) => {
        if (language.code === 'joker') {
            return history.push('/signup/pairing/pedagogy'); // we dont update signUpProfile because joker is null in api
        }

        setSelectedLanguage(language);
    };

    const onLanguageAsked = async () => {
        if (!selectedLanguage) {
            return;
        }

        const result = await askForLanguage.execute(selectedLanguage);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        history.push('/signup/pairing/unavailable-language', {
            askingStudents: result,
            codeLanguage: selectedLanguage.code,
            nameLanguage: selectedLanguage.name,
            enabledLanguage: selectedLanguage.enabled,
        });
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
                {!selectedLanguage && (
                    <OtherLanguageContent languages={languages} onLanguageSelected={onOtherLanguageSelected} />
                )}
                {selectedLanguage && (
                    <OtherLanguageSelectedContent language={selectedLanguage} onNextStep={onLanguageAsked} />
                )}
            </div>
        </WebLayoutCentered>
    );
};

export default PairingOtherLanguagesPage;
