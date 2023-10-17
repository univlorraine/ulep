import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreState } from '../../store/storeTypes';
import OtherLanguageSelectedContent from '../components/contents/OtherLanguageSelectedContent';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';

const PairingOtherLanguageSelectedPage: React.FC = () => {
    const { t } = useTranslation();
    const { askForLanguage, configuration } = useConfig();
    const [showToast] = useIonToast();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const profile = useStoreState((state) => state.profile);
    const language = profileSignUp.learningLanguage;
    const university = profile?.user.university;
    const history = useHistory();

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    if (!language) {
        return <Redirect to={'/pairing/languages'} />;
    }

    const onLanguageAsked = async () => {
        if (!language) {
            return;
        }

        const result = await askForLanguage.execute(language);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        history.push(`/pairing/unavailable-language`, {
            askingStudents: result,
        });
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={12}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <OtherLanguageSelectedContent language={language} onNextStep={onLanguageAsked} />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingOtherLanguageSelectedPage;
