import React from 'react';
import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import { Availabilites } from '../../../domain/entities/ProfileSignUp';
import { useStoreState } from '../../../store/storeTypes';
import { codeLanguageToFlag } from '../../utils';
import AvailabilityLine from '../AvailabilityLine';
import TandemCard from './TandemCard';
import styles from './TandemProfileContent.module.css';

interface TandemProfileContentProps {
    learningLanguage: LearningLanguage;
    level: CEFR;
    pedagogy: Pedagogy;
    partnerProfile: Profile;
    partnerLearningLanguage: Language;
    className?: string;
}

const TandemProfileContent: React.FC<TandemProfileContentProps> = ({
    learningLanguage,
    level,
    pedagogy,
    partnerProfile,
    partnerLearningLanguage,
    className,
}) => {
    const { t } = useTranslation();
    const meProfile = useStoreState((state) => state.profile);

    if (!meProfile) {
        return null;
    }

    return (
        <div className={`${styles.content} ${className ? className : ''}`}>
            <span className="title extra-large-margin-bottom large-margin-top">
                {t(`home_page.tandem_validated.title`)}
            </span>
            <TandemCard profile={partnerProfile} language={learningLanguage} />
            <span className={styles.category}>{t(`global.email`)}</span>
            <div className={styles['text-container']}>{partnerProfile.user.email}</div>

            <span className={styles.category}>{t(`home_page.tandem_validated.goals`)}</span>
            <div className={styles['text-container']}>
                <span>{`${t(`home_page.tandem_validated.type.${pedagogy}`)} ( ${level} ) ${codeLanguageToFlag(
                    partnerLearningLanguage.code
                )}`}</span>{' '}
                <br />
                {partnerProfile.goals.map((goal) => (
                    <React.Fragment key={goal.id}>
                        {goal.name}
                        <br />
                    </React.Fragment>
                ))}
            </div>

            <span className={styles.category}>{t(`home_page.tandem_validated.languages`)}</span>
            <div className={styles['text-container']}>
                <>
                    {partnerProfile.nativeLanguage.name} <br />
                    {partnerProfile.masteredLanguages.map((masteredLangauge) => (
                        <div key={masteredLangauge.id}>
                            {masteredLangauge.name}
                            <br />
                        </div>
                    ))}
                </>
            </div>
            <span className={styles.category}>{t(`home_page.tandem_validated.interests`)}</span>
            <div className={styles.interests}>
                {partnerProfile.interests.map((interest) => {
                    return (
                        <div key={interest.id} className={styles.interest}>
                            {interest.name}
                        </div>
                    );
                })}
            </div>
            <span className={styles.category}>{t(`home_page.tandem_validated.power`)}</span>
            <div className={styles['text-container']}>{partnerProfile.biography.superpower}</div>
            <span className={styles.category}>{t(`home_page.tandem_validated.incredible`)}</span>
            <div className={styles['text-container']}>{partnerProfile.biography.anecdote}</div>
            <span className={styles.category}>{t(`home_page.tandem_validated.place`)}</span>
            <div className={styles['text-container']}>{partnerProfile.biography.favoritePlace}</div>
            <span className={styles.category}>{t(`home_page.tandem_validated.travel`)}</span>
            <div className={styles['text-container']}>{partnerProfile.biography.experience}</div>
            <span className={styles.category}>{t(`home_page.tandem_validated.availabilities`)}</span>
            <div className={styles['text-container']}>{partnerProfile.user.university.timezone}</div>
            <div className={styles.separator} />
            {Object.keys(partnerProfile.availabilities).map((availabilityKey) => {
                return (
                    <AvailabilityLine
                        key={availabilityKey}
                        availability={partnerProfile.availabilities[availabilityKey as keyof Availabilites]}
                        day={availabilityKey}
                    />
                );
            })}
            {!partnerProfile.availabilitiesNotePrivacy && (
                <>
                    <span className={styles.category}>{t(`home_page.tandem_validated.availabilities_note`)}</span>
                    <div className={styles['text-container']}>{partnerProfile.availabilitiesNote}</div>
                </>
            )}
        </div>
    );
};

export default TandemProfileContent;
