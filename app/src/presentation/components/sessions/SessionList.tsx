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
