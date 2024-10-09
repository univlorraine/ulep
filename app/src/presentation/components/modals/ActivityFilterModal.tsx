import { IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityTheme, ActivityThemeCategory } from '../../../domain/entities/Activity';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import { CEFR_LEVELS } from '../../utils';
import Checkbox from '../Checkbox';
import styles from './ActivityFilterModal.module.css';
import Modal from './Modal';

interface ActivityFilterModalProps {
    isVisible: boolean;
    onClose: () => void;
    onFilterApplied: ({
        shouldTakeAllMine,
        languages,
        levels,
        themes,
    }: {
        shouldTakeAllMine: boolean;
        languages: Language[];
        levels: CEFR[];
        themes: ActivityTheme[];
    }) => void;
    currentShouldTakeAllMineFilter: boolean;
    currentLanguagesFilter: Language[];
    currentLevelsFilter: CEFR[];
    currentThemesFilter: ActivityTheme[];
    profile: Profile;
    themes: ActivityThemeCategory[];
}

const ActivityFilterModal: React.FC<ActivityFilterModalProps> = ({
    isVisible,
    onClose,
    profile,
    onFilterApplied,
    currentShouldTakeAllMineFilter,
    currentLanguagesFilter,
    currentLevelsFilter,
    currentThemesFilter,
    themes,
}) => {
    const { t } = useTranslation();
    const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
    const [selectedThemes, setSelectedThemes] = useState<ActivityTheme[]>([]);
    const [proficiencyLevelsSelected, setProficiencyLevelsSelected] = useState<CEFR[]>([]);
    const [shouldTakeAllMine, setShouldTakeAllMine] = useState<boolean>(false);

    const addOrRemoveLanguage = (language: Language) => {
        if (selectedLanguages.includes(language)) {
            setSelectedLanguages(selectedLanguages.filter((l) => l.id !== language.id));
        } else {
            setSelectedLanguages([...selectedLanguages, language]);
        }
    };

    const addOrRemoveTheme = (theme: ActivityTheme) => {
        if (selectedThemes.includes(theme)) {
            setSelectedThemes(selectedThemes.filter((t) => t.id !== theme.id));
        } else {
            setSelectedThemes([...selectedThemes, theme]);
        }
    };

    const addOrRemoveProficiencyLevel = (level: CEFR) => {
        if (proficiencyLevelsSelected.includes(level)) {
            setProficiencyLevelsSelected(proficiencyLevelsSelected.filter((l) => l !== level));
        } else {
            setProficiencyLevelsSelected([...proficiencyLevelsSelected, level]);
        }
    };

    useEffect(() => {
        setShouldTakeAllMine(currentShouldTakeAllMineFilter);
        setSelectedLanguages(currentLanguagesFilter);
        setProficiencyLevelsSelected(currentLevelsFilter);
        setSelectedThemes(currentThemesFilter);
    }, [isVisible]);

    const languages = [profile.nativeLanguage, ...profile.masteredLanguages, ...profile.learningLanguages];
    return (
        <Modal isVisible={isVisible} onClose={onClose} hideWhiteBackground>
            <div className={styles.container}>
                <div className={styles.filterContainer}>
                    <h1>{t('activity.list.filter.title')}</h1>
                    <Checkbox
                        isSelected={shouldTakeAllMine}
                        onPressed={() => {
                            setShouldTakeAllMine(!shouldTakeAllMine);
                        }}
                        name={t(`activity.list.filter.is_mine`)}
                    />
                    <p className={styles.filter}>{t('activity.list.filter.languages')}</p>
                    <div className={styles.line}>
                        {languages.map((language) => (
                            <Checkbox
                                key={language.id}
                                isSelected={selectedLanguages.includes(language)}
                                onPressed={() => {
                                    addOrRemoveLanguage(language);
                                }}
                                name={t(`languages_code.${language.code}`)}
                            />
                        ))}
                    </div>

                    <p className={styles.filter}>{t('activity.list.filter.levels')}</p>
                    <div className={styles.line}>
                        {CEFR_LEVELS.map((level) => (
                            <Checkbox
                                key={level}
                                isSelected={proficiencyLevelsSelected.includes(level)}
                                onPressed={() => {
                                    addOrRemoveProficiencyLevel(level);
                                }}
                                name={level}
                            />
                        ))}
                    </div>

                    <p className={styles.filter}>{t('activity.list.filter.themes')}</p>
                    <div className={styles.line}>
                        {themes.map((category) => {
                            return (
                                <div key={category.id} className={styles.category}>
                                    <p className={styles['category-title']}>{category.content}</p>
                                    <div className={styles.line}>
                                        {category.themes.map((theme) => {
                                            return (
                                                <Checkbox
                                                    key={theme.id}
                                                    isSelected={selectedThemes.includes(theme)}
                                                    onPressed={() => {
                                                        addOrRemoveTheme(theme);
                                                    }}
                                                    name={theme.content}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <IonButton
                    fill="clear"
                    className="primary-button no-padding"
                    onClick={() =>
                        onFilterApplied({
                            shouldTakeAllMine: shouldTakeAllMine,
                            languages: selectedLanguages,
                            levels: proficiencyLevelsSelected,
                            themes: selectedThemes,
                        })
                    }
                >
                    {t('activity.list.filter.apply')}
                </IonButton>
                <IonButton fill="clear" className="secondary-button" onClick={onClose}>
                    {t('activity.list.filter.cancel')}
                </IonButton>
            </div>
        </Modal>
    );
};

export default ActivityFilterModal;
