import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftSvg, CloseBlackSvg } from '../../../assets';
import { ReactComponent as Background } from '../../../assets/background.svg';
import { useConfig } from '../../../context/ConfigurationContext';
import { getInitialAviability } from '../../../domain/entities/Availability';
import Language from '../../../domain/entities/Language';
import Profile from '../../../domain/entities/Profile';
import { Availabilites } from '../../../domain/entities/ProfileSignUp';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import AvailabilityLine from '../AvailabilityLine';
import TandemCard from './TandemCard';
import styles from './TandemProfile.module.css';

interface TandemProfileProps {
    language: Language;
    onClose: () => void;
    profile: Profile;
}

//Mocked data
// TODO: chagne this
const initialAvailabilities: Availabilites = {
    monday: getInitialAviability(),
    tuesday: getInitialAviability(),
    wednesday: getInitialAviability(),
    thursday: getInitialAviability(),
    friday: getInitialAviability(),
    saturday: getInitialAviability(),
    sunday: getInitialAviability(),
};

const note = 'J’aurai peu de dispo les 2 premières semaines d’Octobre, mais après tout sera beaucoup plus simple';

//TODO: Change language description
const TandemProfile: React.FC<TandemProfileProps> = ({ language, onClose, profile }) => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    return (
        <div className={styles.container} style={{ backgroundColor: configuration.secondaryColor }}>
            <Background className={styles.image} style={{ color: configuration.secondaryBackgroundImageColor }} />
            <button
                className={styles['back-button']}
                style={{ justifyContent: !isHybrid ? 'flex-end' : 'flex-start' }}
                onClick={onClose}
            >
                <img alt="back" src={!isHybrid ? CloseBlackSvg : ArrowLeftSvg} />
            </button>
            <div className={styles.content}>
                <span className="title extra-large-margin-bottom">{t(`home_page.tandem_validated.title`)}</span>
                <TandemCard
                    avatar={profile.user.avatar}
                    fistname={profile.user.firstname}
                    language={language}
                    lastname={profile.user.lastname}
                    university={profile.user.university}
                />
                {profile.goals.length !== 0 && (
                    <>
                        <span className={styles.category}>{t(`home_page.tandem_validated.goals`)}</span>
                        <div className={styles['text-container']}>
                            {profile.goals.map((goal) => (
                                <React.Fragment key={goal.id}>
                                    {goal.name}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>
                    </>
                )}

                <span className={styles.category}>{t(`home_page.tandem_validated.languages`)}</span>
                <div className={styles['text-container']}>
                    <>{profile.nativeLanguage.name}</>
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
                {Object.keys(initialAvailabilities).map((availabilityKey) => {
                    return (
                        <AvailabilityLine
                            availability={initialAvailabilities[availabilityKey as keyof Availabilites]}
                            day={availabilityKey}
                        />
                    );
                })}
                <span className={styles.category}>{t(`home_page.tandem_validated.availabilities_note`)}</span>
                <div className={styles['text-container']}>{note}</div>
            </div>
        </div>
    );
};

export default TandemProfile;
