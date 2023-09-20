import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useParams } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import OtherLanguageContent from '../components/contents/OtherLanguageContent';
import OtherLanguageSelectedContent from '../components/contents/OtherLanguageSelectedContent';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';

const PairingOtherLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { askForLanguage, configuration, getAllLanguages } = useConfig();
    const isSignUp = useParams<{ prefix?: string }>().prefix;
    const [showToast] = useIonToast();
    const user = useStoreState((state) => state.user);
    const profile = useStoreState((state) => state.profile);
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const history = useHistory();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>();
    const university = user?.university || profile?.user.university;

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    const getLanguages = async () => {
        let result = await getAllLanguages.execute('SECONDARY');

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setLanguages(result);
    };

    const onOtherLanguageSelected = async (language: Language) => {
        if (language.code === '*') {
            updateProfileSignUp({ learningLanguage: language, learningLanguageLevel: 'A0' });
            return history.push(`${isSignUp ? '/' + isSignUp : '/'}pairing/pedagogy`);
        }

        return setSelectedLanguage(language);
    };

    const onLanguageAsked = async () => {
        if (!selectedLanguage) {
            return;
        }

        const result = await askForLanguage.execute(selectedLanguage);

        if (result instanceof Error) {
            setSelectedLanguage(undefined);
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        history.push(`${isSignUp ? '/' + isSignUp : '/'}pairing/unavailable-language`, {
            askingStudents: result,
            codeLanguage: selectedLanguage.code,
            nameLanguage: selectedLanguage.name,
        });
        setSelectedLanguage(undefined);
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
