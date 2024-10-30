import { IonImg } from '@ionic/react';
import { Trans, useTranslation } from 'react-i18next';
import { AvatarPlaceholderPng, Star2Png, VocabularyPng } from '../../../assets';
import styles from './VisioWelcomeContent.module.css';

const VisioWelcomeContent: React.FC<{ setSelectedMenuItem: (item: string) => void }> = ({ setSelectedMenuItem }) => {
    const { t } = useTranslation();

    const sections = [
        {
            id: 'vocabulary',
            icon: VocabularyPng,
            text: (
                <Trans
                    i18nKey="visio.sections.vocabulary"
                    components={{
                        linkOnClick: (
                            <span
                                className={styles.link}
                                onClick={() => {
                                    setSelectedMenuItem('vocabulary');
                                }}
                            />
                        ),
                    }}
                />
            ),
        },
        {
            id: 'activity',
            icon: Star2Png,
            text: (
                <Trans
                    i18nKey="visio.sections.activity"
                    components={{
                        linkOnClick: (
                            <span
                                className={styles.link}
                                onClick={() => {
                                    setSelectedMenuItem('activity');
                                }}
                            />
                        ),
                    }}
                />
            ),
        },
        {
            id: 'profile',
            icon: AvatarPlaceholderPng,
            text: (
                <Trans
                    i18nKey="visio.sections.profile"
                    components={{
                        linkOnClick: (
                            <span
                                className={styles.link}
                                onClick={() => {
                                    setSelectedMenuItem('profile');
                                }}
                            />
                        ),
                    }}
                />
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h1 className={`${styles.title} title`}>{t('visio.hello')}</h1>
            <h2 className={styles.subtitle}>{t('visio.welcome')}</h2>
            <p className={styles.intro}>{t('visio.sections.intro')}</p>
            <div className={styles.sections}>
                {sections.map((section) => (
                    <div className={styles.section} key={section.id}>
                        <IonImg className={styles.icon} src={section.icon} />
                        <p className={styles.text}>{section.text}</p>
                    </div>
                ))}
            </div>
            <p>{t('visio.stay_polite')}</p>
            <p>{t('visio.contact_animator')}</p>
        </div>
    );
};

export default VisioWelcomeContent;
