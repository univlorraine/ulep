import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import OtherLanguageContent from '../components/contents/OtherLanguageContent';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';

const PairingOtherLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllLanguages } = useConfig();
    const [showToast] = useIonToast();
    const profile = useStoreState((state) => state.profile);
    const university = profile?.user.university;
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const history = useHistory();
    const [languages, setLanguages] = useState<Language[]>([]);

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    const getLanguages = async () => {
        let result = await getAllLanguages.execute('SECONDARY');

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setLanguages(
            result.filter(
                (language) =>
                    profile?.nativeLanguage.code !== language.code &&
                    !profile?.masteredLanguages?.find((otherLanguage) => language.code === otherLanguage.code) &&
                    !profile?.learningLanguages?.find((learningLanguage) => language.code === learningLanguage.code)
            )
        );
    };

    const onOtherLanguageSelected = async (language: Language) => {
        if (language.code === '*') {
            updateProfileSignUp({ learningLanguage: language, learningLanguageLevel: 'A0' });
            return history.push(`/pairing/pedagogy`);
        }

        updateProfileSignUp({ learningLanguage: language, isSuggested: true });
        return history.push(`/pairing/pedagogy`);
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
                <OtherLanguageContent languages={languages} onLanguageSelected={onOtherLanguageSelected} />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingOtherLanguagesPage;
