/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { IonButton, IonModal } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityTheme, ActivityThemeCategory } from '../../../domain/entities/Activity';
import { EventType } from '../../../domain/entities/Event';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import useGetLearnableLanguages from '../../hooks/useGetLearnableLanguages';
import { CEFR_LEVELS } from '../../utils';
import Checkbox from '../Checkbox';
import styles from './FilterModal.module.css';

export enum FiltersToDisplay {
    IS_MINE = 'is_mine',
    LANGUAGES = 'languages',
    LEVELS = 'levels',
    THEMES = 'themes',
    EVENT_TYPE = 'event_type',
}

interface FilterModalProps {
    isVisible: boolean;
    onClose: () => void;
    onFilterApplied: ({
        shouldTakeAllMine,
        languages,
        levels,
        themes,
        eventType,
    }: {
        shouldTakeAllMine?: boolean;
        languages?: Language[];
        levels?: CEFR[];
        themes?: ActivityTheme[];
        eventType?: EventType[];
    }) => void;
    currentShouldTakeAllMineFilter?: boolean;
    currentLanguagesFilter?: Language[];
    currentLevelsFilter?: CEFR[];
    currentThemesFilter?: ActivityTheme[];
    currentEventTypeFilter?: EventType[];
    profile: Profile;
    themes?: ActivityThemeCategory[];
    title: string;
    filterToDisplay: FiltersToDisplay[];
}

const FilterModal: React.FC<FilterModalProps> = ({
    isVisible,
    onClose,
    profile,
    onFilterApplied,
    currentShouldTakeAllMineFilter,
    currentLanguagesFilter,
    currentLevelsFilter,
    currentThemesFilter,
    currentEventTypeFilter,
    themes,
    filterToDisplay,
    title,
}) => {
    const { t } = useTranslation();
    const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
    const [selectedThemes, setSelectedThemes] = useState<ActivityTheme[]>([]);
    const [selectedEventType, setSelectedEventType] = useState<EventType[]>([]);
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

    const addOrRemoveEventType = (eventType: EventType) => {
        if (selectedEventType.includes(eventType)) {
            setSelectedEventType(selectedEventType.filter((t) => t !== eventType));
        } else {
            setSelectedEventType([...selectedEventType, eventType]);
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
        setShouldTakeAllMine(currentShouldTakeAllMineFilter ?? false);
        setSelectedLanguages(currentLanguagesFilter ?? []);
        setProficiencyLevelsSelected(currentLevelsFilter ?? []);
        setSelectedThemes(currentThemesFilter ?? []);
        setSelectedEventType(currentEventTypeFilter ?? []);
    }, [isVisible]);

    const { languages: learnableLanguages } = useGetLearnableLanguages(profile?.user.university, false, []);

    const languages = Array.from(
        new Map(
            [profile.nativeLanguage, ...profile.masteredLanguages, ...profile.learningLanguages, ...learnableLanguages]
                .filter((language): language is Language => language !== null && language !== undefined)
                .filter((language) => language.id !== '*')
                .map((language) => [language.code, language])
        ).values()
    );

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={styles.container}>
                <div className={styles.filterContainer}>
                    <h1>{t(title)}</h1>
                    {filterToDisplay.includes(FiltersToDisplay.IS_MINE) && (
                        <>
                            <Checkbox
                                isSelected={shouldTakeAllMine}
                                onPressed={() => {
                                    setShouldTakeAllMine(!shouldTakeAllMine);
                                }}
                                name={t(`filter.is_mine`)}
                                ariaLabel={t(`filter.is_mine`) as string}
                            />
                        </>
                    )}
                    {filterToDisplay.includes(FiltersToDisplay.LANGUAGES) && (
                        <>
                            <p className={styles.filter}>{t('filter.languages')}</p>
                            <div className={styles.line} role="listbox">
                                {languages.map((language) => (
                                    <Checkbox
                                        key={language.id}
                                        isSelected={selectedLanguages.some((l) => l.id === language.id)}
                                        onPressed={() => {
                                            addOrRemoveLanguage(language);
                                        }}
                                        name={t(`languages_code.${language.code}`)}
                                        ariaLabel={language.code}
                                        ariaRole="option"
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    {filterToDisplay.includes(FiltersToDisplay.EVENT_TYPE) && (
                        <>
                            <p className={styles.filter}>{t('filter.event_type.title')}</p>
                            <div className={styles.line} role="listbox">
                                <Checkbox
                                    name={t('filter.event_type.online')}
                                    onPressed={() => {
                                        addOrRemoveEventType(EventType.ONLINE);
                                    }}
                                    isSelected={selectedEventType.includes(EventType.ONLINE)}
                                    ariaLabel={t('filter.event_type.online') as string}
                                    ariaRole="option"
                                />
                                <Checkbox
                                    name={t('filter.event_type.presential')}
                                    onPressed={() => {
                                        addOrRemoveEventType(EventType.PRESENTIAL);
                                    }}
                                    isSelected={selectedEventType.includes(EventType.PRESENTIAL)}
                                    ariaLabel={t('filter.event_type.presential') as string}
                                    ariaRole="option"
                                />
                            </div>
                        </>
                    )}
                    {filterToDisplay.includes(FiltersToDisplay.LEVELS) && (
                        <>
                            <p className={styles.filter}>{t('filter.levels')}</p>
                            <div className={styles.line} role="listbox">
                                {CEFR_LEVELS.map((level) => (
                                    <Checkbox
                                        key={level}
                                        isSelected={proficiencyLevelsSelected.includes(level)}
                                        onPressed={() => {
                                            addOrRemoveProficiencyLevel(level);
                                        }}
                                        name={level}
                                        ariaLabel={level as string}
                                        ariaRole="option"
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    {filterToDisplay.includes(FiltersToDisplay.THEMES) && themes && (
                        <>
                            <p className={styles.filter}>{t('filter.themes')}</p>
                            <div className={styles.line} role="listbox">
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
                                                            ariaLabel={theme.content as string}
                                                            ariaRole="option"
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
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
                            eventType: selectedEventType,
                        })
                    }
                >
                    {t('filter.apply')}
                </IonButton>
                <IonButton fill="clear" className="secondary-button" onClick={onClose}>
                    {t('filter.cancel')}
                </IonButton>
            </div>
        </IonModal>
    );
};

export default FilterModal;
