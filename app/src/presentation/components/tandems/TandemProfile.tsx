import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftSvg, CloseBlackSvg } from '../../../assets';
import { ReactComponent as Background } from '../../../assets/background.svg';
import { useConfig } from '../../../context/ConfigurationContext';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import { Availabilites } from '../../../domain/entities/ProfileSignUp';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH, codeLanguageToFlag } from '../../utils';
import AvailabilityLine from '../AvailabilityLine';
import TandemCard from './TandemCard';
import styles from './TandemProfile.module.css';

interface TandemProfileProps {
    language: Language;
    level: CEFR;
    onClose: () => void;
    pedagogy: Pedagogy;
    profile: Profile;
    partnerLearningLanguage: Language;
}

const TandemProfile: React.FC<TandemProfileProps> = ({
    language,
    level,
    onClose,
    pedagogy,
    profile,
    partnerLearningLanguage,
}) => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    return (
        <div className={styles.container} style={{ backgroundColor: configuration.secondaryColor }}>
            <Background className={styles.image} style={{ color: configuration.secondaryBackgroundImageColor }} />
            <button
                aria-label={t('global.go_back') as string}
                className={styles['back-button']}
                style={{ justifyContent: !isHybrid ? 'flex-end' : 'flex-start' }}
                onClick={onClose}
            >
                <img alt={t('global.go_back') as string} src={!isHybrid ? CloseBlackSvg : ArrowLeftSvg} />
            </button>
            <div className={styles.content}>
                <span className="title extra-large-margin-bottom">{t(`home_page.tandem_validated.title`)}</span>
                <TandemCard profile={profile} language={language} />

                <span className={styles.category}>{t(`global.email`)}</span>
                <div className={styles['text-container']}>{profile.user.email}</div>

                <span className={styles.category}>{t(`home_page.tandem_validated.goals`)}</span>
                <div className={styles['text-container']}>
                    <span>{`${t(`home_page.tandem_validated.type.${pedagogy}`)} ( ${level} ) ${codeLanguageToFlag(
                        partnerLearningLanguage.code
                    )}`}</span>{' '}
                    <br />
                    {profile.goals.map((goal) => (
                        <React.Fragment key={goal.id}>
                            {goal.name}
                            <br />
                        </React.Fragment>
                    ))}
                </div>

                <span className={styles.category}>{t(`home_page.tandem_validated.languages`)}</span>
                <div className={styles['text-container']}>
                    <>
                        {profile.nativeLanguage.name} <br />
                        {profile.masteredLanguages.map((masteredLangauge) => (
                            <div key={masteredLangauge.id}>
                                {masteredLangauge.name}
                                <br />
                            </div>
                        ))}
                    </>
                </div>
                <span className={styles.category}>{t(`home_page.tandem_validated.interests`)}</span>
                <div className={styles.interests}>
                    {profile.interests.map((interest) => {
                        return (
                            <div key={interest.id} className={styles.interest}>
                                {interest.name}
                            </div>
                        );
                    })}
                </div>
                <span className={styles.category}>{t(`home_page.tandem_validated.power`)}</span>
                <div className={styles['text-container']}>{profile.biography.superpower}</div>
                <span className={styles.category}>{t(`home_page.tandem_validated.incredible`)}</span>
                <div className={styles['text-container']}>{profile.biography.anecdote}</div>
                <span className={styles.category}>{t(`home_page.tandem_validated.place`)}</span>
                <div className={styles['text-container']}>{profile.biography.favoritePlace}</div>
                <span className={styles.category}>{t(`home_page.tandem_validated.travel`)}</span>
                <div className={styles['text-container']}>{profile.biography.experience}</div>
                <span className={styles.category}>{t(`home_page.tandem_validated.availabilities`)}</span>
                <div className={styles['text-container']}>{profile.user.university.timezone}</div>
                <div className={styles.separator} />
                {Object.keys(profile.availabilities).map((availabilityKey) => {
                    return (
                        <AvailabilityLine
                            availability={profile.availabilities[availabilityKey as keyof Availabilites]}
                            day={availabilityKey}
                        />
                    );
                })}
                {!profile.availabilitiesNotePrivacy && (
                    <>
                        <span className={styles.category}>{t(`home_page.tandem_validated.availabilities_note`)}</span>
                        <div className={styles['text-container']}>{profile.availabilitiesNote}</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TandemProfile;
