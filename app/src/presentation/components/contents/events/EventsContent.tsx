import { IonButton, IonImg } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import Profile from '../../../../domain/entities/Profile';
import useGetEvent from '../../../hooks/useGetEvent';
import EventAdress from '../../events/EventAdress';
import EventDate from '../../events/EventDate';
import EventSubscribeButton from '../../events/EventSubscribeButton';
import HeaderSubContent from '../../HeaderSubContent';
import LanguageTag from '../../LanguageTag';
import ChangeLanguageModal from '../../modals/ChangeLanguageModal';
import CreditModal from '../../modals/CreditModal';
import UniversityTag from '../../UniversityTag';
import styles from './EventsContent.module.css';

interface EventsContentProps {
    profile: Profile;
    onBackPressed: () => void;
    eventId: string;
}

export const EventsContent: React.FC<EventsContentProps> = ({ eventId, profile, onBackPressed }) => {
    const { t } = useTranslation();
    const [refresh, setRefresh] = useState(false);
    const { event, error } = useGetEvent(eventId, refresh);
    const [currentLanguage, setCurrentLanguage] = useState(event?.languageCode ?? '');
    const [currentTitle, setCurrentTitle] = useState(event?.title ?? '');
    const [currentContent, setCurrentContent] = useState(event?.content ?? '');
    const [showChangeLanguage, setShowChangeLanguage] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (event) {
            setCurrentLanguage(event.languageCode);
            setCurrentTitle(event.title);
            setCurrentContent(event.content);
        }
    }, [event]);

    if (error) {
        return <Redirect to="/home" />;
    }

    if (!event) {
        return <div />;
    }

    const changeLanguage = (languageCode: string) => {
        if (languageCode === event.languageCode) {
            setCurrentLanguage(event.languageCode);
            setCurrentTitle(event.title);
            setCurrentContent(event.content);
        } else {
            setCurrentLanguage(languageCode);
            setCurrentTitle(
                event.translations.find((translation) => translation.languageCode === languageCode)?.title ?? ''
            );
            setCurrentContent(
                event.translations.find((translation) => translation.languageCode === languageCode)?.content ?? ''
            );
        }
        setShowChangeLanguage(false);
    };

    return (
        <div className="subcontent-container content-wrapper" style={{ padding: 0 }} ref={contentRef}>
            <HeaderSubContent title={t('news.list.title')} onBackPressed={onBackPressed} />
            <div className={styles.container}>
                {event.imageUrl && <IonImg className={styles.image} src={event.imageUrl}></IonImg>}
                {event.creditImage && (
                    <IonButton fill="clear" className={styles['credit-view']} onClick={() => setShowCreditModal(true)}>
                        <span className={styles.credit}>©</span>
                    </IonButton>
                )}
                <div className={styles['primary-container']} style={{ marginTop: event.imageUrl ? 200 : 0 }}>
                    <h1 className={styles.title}>{currentTitle}</h1>
                    <EventDate event={event} profile={profile} showAddToCalendar />
                    <EventAdress event={event} showMap />
                    <div className={styles.informations}>
                        <div className={styles['information-item']}>
                            <span className={styles.label}>{t('news.show.language')}</span>
                            <span>
                                <LanguageTag languageCode={currentLanguage} />
                                {event.translations.length > 0 && (
                                    <button
                                        aria-label={t('news.show.change_language') as string}
                                        className={styles['change-language-button']}
                                        onClick={() => setShowChangeLanguage(true)}
                                    >
                                        {t('news.show.change_language')}
                                    </button>
                                )}
                            </span>
                        </div>
                        <div className={styles['information-item']}>
                            <span className={styles.label}>{t('news.show.author')}</span>
                            <UniversityTag university={event.authorUniversity} />
                        </div>
                    </div>
                    <EventSubscribeButton
                        event={event}
                        profile={profile}
                        onEventSubscribed={() => setRefresh(!refresh)}
                    />
                    <p className={styles.content} dangerouslySetInnerHTML={{ __html: currentContent }} />
                </div>
            </div>
            <ChangeLanguageModal
                isVisible={showChangeLanguage}
                onClose={() => setShowChangeLanguage(false)}
                onLanguageCodeChange={changeLanguage}
                currentLanguageCode={currentLanguage}
                allLanguagesCodes={[
                    event.languageCode,
                    ...event.translations.map((translation) => translation.languageCode),
                ]}
            />
            {event.creditImage && (
                <CreditModal
                    isVisible={showCreditModal}
                    onClose={() => setShowCreditModal(false)}
                    credit={event.creditImage}
                />
            )}
        </div>
    );
};

export default EventsContent;
