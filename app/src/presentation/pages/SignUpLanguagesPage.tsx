import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import Dropdown, { DropDownItem } from '../components/DropDown';
import RequiredFieldsMention from '../components/forms/RequiredFieldsMention';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import { codeLanguageToFlag } from '../utils';
import styles from './css/SignUp.module.css';

const SignUpLanguagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllLanguages } = useConfig();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const [showToast] = useIonToast();
    const history = useHistory();
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [languages, setLanguages] = useState<DropDownItem<Language | undefined>[]>([]);
    const [myLanguage, setMyLanguage] = useState<Language | undefined>(
        profileSignUp?.nativeLanguage ? profileSignUp.nativeLanguage : undefined
    );
    const [otherLanguages, setOtherLanguages] = useState<(Language | undefined)[]>(
        profileSignUp?.otherLanguages ? profileSignUp?.otherLanguages : []
    );

    const updateNativeLanguage = (language: Language | undefined) => {
        setMyLanguage(language);
        setOtherLanguages([undefined, undefined]);
    };

    const getLanguagesData = async () => {
        const result = await getAllLanguages.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setLanguages([
            { label: t('signup_languages_page.none'), value: undefined },
            ...result
                .map((language) => ({
                    label: `${codeLanguageToFlag(language.code)} ${t(`languages_code.${language.code}`)}`,
                    value: language,
                }))
                .sort((a, b) => {
                    if (a.value.code === 'fr') {
                        return -1;
                    }

                    if (b.value.code === 'fr') {
                        return 1;
                    }

                    const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                    const translatedA = removeAccents(t(`languages_code.${a.value.code}`));
                    const translatedB = removeAccents(t(`languages_code.${b.value.code}`));

                    return translatedB < translatedA ? 1 : -1;
                }),
        ]);
    };

    const pushOtherLanguage = (item: Language | undefined, index: number) => {
        if (!item && index === 0) {
            return setOtherLanguages([]);
        }
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
            hasGoBackButton={false}
        >
            <div className={styles.body}>
                <h1 className={styles.title}>{t('signup_languages_page.title')}</h1>
                <RequiredFieldsMention />

                <div className="large-margin-bottom">
                    <Dropdown<Language | undefined>
                        onChange={updateNativeLanguage}
                        value={languages.find((language) => myLanguage?.code === language.value?.code)}
                        options={languages}
                        placeholder={t('signup_languages_page.placeholder_primary_language')}
                        title={t('signup_languages_page.language')}
                        ariaLabel={t('signup_languages_page.aria_label') as string}
                        required={true}
                    />
                </div>

                <div role="group" aria-label={t('signup_languages_page.mastered_aria_label') as string}>
                    {myLanguage && (
                        <div className="margin-bottom">
                            <Dropdown<Language | undefined>
                                onChange={(item) => pushOtherLanguage(item, 0)}
                                value={languages.find((language) => otherLanguages[0]?.code === language.value?.code)}
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
                            value={languages.find((language) => otherLanguages[1]?.code === language.value?.code)}
                            options={languages.filter(
                                (language) =>
                                    language.value?.name !== myLanguage?.name &&
                                    (!otherLanguages[0] || otherLanguages[0].name !== language.value?.name)
                            )}
                            placeholder={t('signup_languages_page.placeholder_second_optional_language')}
                            title={t('signup_languages_page.other_languages')}
                        />
                    )}
                </div>

                <div className={styles['bottom-container']}>
                    <button
                        aria-label={t('signup_languages_page.validate_button') as string}
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
