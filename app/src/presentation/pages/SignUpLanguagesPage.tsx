import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions } from '../../store/storeTypes';
import Dropdown, { DropDownItem } from '../components/DropDown';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import { codeLanguageToFlag } from '../utils';

const SignUpLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllLanguages } = useConfig();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [showToast] = useIonToast();
    const history = useHistory();
    const [languages, setLanguages] = useState<DropDownItem<Language | undefined>[]>([]);
    const [myLanguage, setMyLanguage] = useState<Language | undefined>();
    const [otherLanguages, setOtherLanguages] = useState<(Language | undefined)[]>([]);

    const getLanguagesData = async () => {
        const result = await getAllLanguages.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setLanguages([
            { title: t('signup_languages_page.none'), value: undefined },
            ...result.map((language) => ({
                title: codeLanguageToFlag(language.code) + ' ' + language.name,
                value: language,
            })),
        ]);
    };

    const pushOtherLanguage = (item: Language | undefined, index: number) => {
        const currentOtherLanguages = [...otherLanguages];
        currentOtherLanguages[index] = item;
        setOtherLanguages(currentOtherLanguages);
    };

    const continueSignUp = () => {
        updateProfileSignUp({
            nativeLanguage: myLanguage,
            otherLanguages: otherLanguages.filter(Boolean) as Language[],
        });
        history.push('/signup/goals');
    };

    useEffect(() => {
        getLanguagesData();
    }, []);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={36}
            headerTitle={t('global.create_account_title')}
        >
            <div className={styles.body}>
                <h1 className={styles.title}>{t('signup_languages_page.title')}</h1>

                <div className="large-margin-bottom">
                    <Dropdown<Language | undefined>
                        onChange={setMyLanguage}
                        options={languages}
                        placeholder={t('signup_languages_page.placeholder_primary_language')}
                        title={t('signup_languages_page.language')}
                    />
                </div>

                {myLanguage && (
                    <div className="margin-bottom">
                        <Dropdown<Language | undefined>
                            onChange={(item) => pushOtherLanguage(item, 0)}
                            options={languages.filter(
                                (language) =>
                                    language.value?.name !== myLanguage?.name &&
                                    (!otherLanguages[1] || otherLanguages[1].name !== language.value?.name)
                            )}
                            placeholder={t('signup_languages_page.placeholder_first_optional_language')}
                            title={t('signup_languages_page.other_languages')}
                        />
                    </div>
                )}

                {otherLanguages[0] && (
                    <Dropdown<Language | undefined>
                        onChange={(item) => pushOtherLanguage(item, 1)}
                        options={languages.filter(
                            (language) =>
                                language.value?.name !== myLanguage?.name &&
                                (!otherLanguages[0] || otherLanguages[0].name !== language.value?.name)
                        )}
                        placeholder={t('signup_languages_page.placeholder_second_optional_language')}
                    />
                )}

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
        </WebLayoutCentered>
    );
};

export default SignUpLanguagesPage;
