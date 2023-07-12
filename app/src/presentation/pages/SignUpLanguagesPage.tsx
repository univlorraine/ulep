import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions } from '../../store/storeTypes';
import Dropdown, { DropDownItem } from '../components/DropDown';
import Header from '../components/Header';
import WebLayoutCentered from '../components/WebLayoutCentered';
import styles from './css/SignUp.module.css';

const SignUpLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { getAllLanguages } = useConfig();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [showToast] = useIonToast();
    const history = useHistory();
    const [languages, setLanguages] = useState<DropDownItem<Language>[]>([]);
    const [myLanguage, setMyLanguage] = useState<Language>();
    const [otherLanguages, setOtherLanguages] = useState<Language[]>([]);

    const getLanguagesData = async () => {
        const result = await getAllLanguages.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setLanguages(result.map((language) => ({ title: language.name, value: language })));
    };

    const pushOtherLanguage = (item: Language, index: number) => {
        const currentOtherLanguages = [...otherLanguages];
        currentOtherLanguages[index] = item;
        setOtherLanguages(currentOtherLanguages);
    };

    const continueSignUp = () => {
        updateProfileSignUp({
            nativeLanguage: myLanguage,
            otherLanguages: otherLanguages.filter(Boolean),
        });
        //Todo : Navigate to next page
    };

    useEffect(() => {
        getLanguagesData();
    }, []);

    return (
        <WebLayoutCentered>
            <div className={styles.container}>
                <Header progressColor="#FDEE66" progressPercentage={36} title={t('global.create_account_title')} />
                <div className={styles.body}>
                    <h1 className={styles.title}>{t('signup_languages_page.title')}</h1>

                    <Dropdown
                        onChange={setMyLanguage}
                        options={languages}
                        placeholder={t('signup_languages_page.placeholder_primary_language')}
                        title={t('signup_languages_page.language')}
                    />

                    <Dropdown
                        onChange={(item) => pushOtherLanguage(item, 0)}
                        options={languages.filter(
                            (language) =>
                                language.title !== myLanguage?.name &&
                                (!otherLanguages[1] || otherLanguages[1].name !== language.title)
                        )}
                        placeholder={t('signup_languages_page.placeholder_first_optional_language')}
                        title={t('signup_languages_page.other_languages')}
                    />

                    <Dropdown
                        onChange={(item) => pushOtherLanguage(item, 1)}
                        options={languages.filter(
                            (language) =>
                                language.title !== myLanguage?.name &&
                                (!otherLanguages[0] || otherLanguages[0].name !== language.title)
                        )}
                        placeholder={t('signup_languages_page.placeholder_second_optional_language')}
                    />

                    <div className={styles['bottom-container']}>
                        <button
                            disabled={!myLanguage}
                            className={`primary-button large-margin-bottom ${!myLanguage ? 'disabled' : ''}`}
                            onClick={continueSignUp}
                        >
                            {t('signup_languages_page.validate_button')}
                        </button>
                    </div>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpLanguagesPage;
