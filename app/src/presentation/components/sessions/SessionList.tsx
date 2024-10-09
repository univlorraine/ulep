import { useTranslation } from 'react-i18next';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import SessionCard from './SessionCard';
import styles from './SessionList.module.css';
import { getMonth, isThisWeek } from 'date-fns';

interface SessionListProps {
    tandems: Tandem[];
    sessions: Session[];
    isHybrid: boolean;
    onShowSessionPressed: (session: Session, tandem: Tandem, confirmCreation?: boolean) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
    onCreateSessionPressed: (tandem: Tandem) => void;
}

const SessionList: React.FC<SessionListProps> = ({
    tandems,
    sessions,
    isHybrid,
    onShowSessionPressed,
    onUpdateSessionPressed,
    onCreateSessionPressed,
}) => {
    const { t } = useTranslation();

    const today = new Date();
    const thisMonth = today.getMonth();

    const thisWeekSessions = sessions.filter((session) => {
        return isThisWeek(session.startAt);
    });

    const getSessionsByMonth = (month: number) => sessions
        .filter((session) => {
            return !thisWeekSessions.some((weekSession) => weekSession.id === session.id);
        })
        .filter((session) => {
            return getMonth(session.startAt) === month;
        });
    
    const sessionsMonths = sessions.reduce((acc: number[], session: Session) => {
        const month = getMonth(session.startAt);
        if (acc.includes(month)) return acc;
        acc.push(month);
        return acc;
    }, []);

    const getMonthName = (month: number) => {
        const date = new Date();
        date.setMonth(month);
        return date.toLocaleString('fr-FR', { month: 'long' });
    };

    return (
        <div className={styles.container}>
            <div className={styles['session-container']}>
                <h2 className={styles.title}>{t('session.list.this_week', { count: thisWeekSessions.length })}</h2>
                {thisWeekSessions.map((session) => {
                    const tandem = tandems.find((tandem) => tandem.id === session.tandemId);
                    if (!tandem) return null;
                    return (    
                        <SessionCard
                            key={session.id}
                            tandem={tandem}
                            session={session}
                            isHybrid={isHybrid}
                            onShowSessionPressed={onShowSessionPressed}
                            onUpdateSessionPressed={onUpdateSessionPressed}
                            onCreateSessionPressed={onCreateSessionPressed}
                        />
                    );
                })}
                {sessionsMonths.map((month) => {
                    const sessionsByMonth = getSessionsByMonth(month);
                    const count = sessionsByMonth.length;
                    return (
                        <>
                            {thisMonth === month ? (
                                <h2 className={styles.title}>{t('session.list.this_month', { count })}</h2>
                            ) : (
                                <h2 className={styles.title}>{t('session.list.at_month', {  month: getMonthName(month), count })}</h2>
                            )}
                            {sessionsByMonth.map((session) => {
                                const tandem = tandems.find((tandem) => tandem.id === session.tandemId);
                                if (!tandem) return null;
                                return <SessionCard
                                    key={session.id}
                                    tandem={tandem}
                                    session={session}
                                    isHybrid={isHybrid}
                                    onShowSessionPressed={onShowSessionPressed}
                                    onUpdateSessionPressed={onUpdateSessionPressed}
                                    onCreateSessionPressed={onCreateSessionPressed}
                                    
                                />;
                            })}
                        </>
                    );
                })}
            </div>
        </div>
    );
};

export default SessionList;
