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

import { IonButton } from '@ionic/react';
import { formatInTimeZone } from 'date-fns-tz';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreState } from '../../../store/storeTypes';
import DateFormatted from './DateFormatted';
import styles from './SessionCard.module.css';
import TandemBubble from './TandemBubble';

interface SessionCardProps {
    tandem: Tandem;
    session?: Session;
    isHybrid: boolean;
    onShowSessionPressed: (session: Session, tandem: Tandem) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
    onCreateSessionPressed: (tandem: Tandem) => void;
}

interface CreateSessionButton {
    tandem: Tandem;
    onCreateSessionPressed: (tandem: Tandem) => void;
}

interface JoinSessionButtonProps {
    tandem: Tandem;
}

interface ShowSessionButtonProps {
    session: Session;
    tandem: Tandem;
    onShowSessionPressed: (session: Session, tandem: Tandem) => void;
}

interface UpdateSessionButtonProps {
    session: Session;
    tandem: Tandem;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
}

const CreateSessionButton: React.FC<CreateSessionButton> = ({ tandem, onCreateSessionPressed }) => {
    const { t } = useTranslation();
    const createSession = () => {
        onCreateSessionPressed(tandem);
    };
    return (
        <IonButton fill="clear" className="primary-button no-padding little-button" onClick={createSession}>
            {t('session.card.create_session')}
        </IonButton>
    );
};

const JoinSessionButton: React.FC<JoinSessionButtonProps> = ({ tandem }) => {
    const history = useHistory();
    const { t } = useTranslation();
    const joinSession = () => {
        return history.push({
            pathname: '/jitsi',
            search: `?roomName=${tandem.id}`,
            state: { tandemPartner: tandem.partner },
        });
    };
    return (
        <IonButton fill="clear" className="primary-button no-padding little-button" onClick={joinSession}>
            {t('session.card.join_session')}
        </IonButton>
    );
};

const ShowSessionButton: React.FC<ShowSessionButtonProps> = ({ session, tandem, onShowSessionPressed }) => {
    const { t } = useTranslation();
    const showSession = () => {
        onShowSessionPressed(session, tandem);
    };
    return (
        <IonButton fill="clear" className="primary-button no-padding little-button" onClick={showSession}>
            {t('session.card.show_session')}
        </IonButton>
    );
};

const UpdateSessionButton: React.FC<UpdateSessionButtonProps> = ({ session, tandem, onUpdateSessionPressed }) => {
    const { t } = useTranslation();
    const updateSession = () => {
        onUpdateSessionPressed(session, tandem);
    };
    return (
        <IonButton fill="clear" className="primary-button no-padding little-button" onClick={updateSession}>
            {t('session.card.update_session')}
        </IonButton>
    );
};

const SessionCard: React.FC<SessionCardProps> = ({
    tandem,
    session,
    onShowSessionPressed,
    onUpdateSessionPressed,
    onCreateSessionPressed,
    isHybrid,
}) => {
    const { t } = useTranslation();
    const profile = useStoreState((state) => state.profile);

    const renderSessionButtons = () => {
        if (!session) {
            return <CreateSessionButton tandem={tandem} onCreateSessionPressed={onCreateSessionPressed} />;
        }

        if (session.cancelledAt !== null) {
            return <ShowSessionButton session={session} tandem={tandem} onShowSessionPressed={onShowSessionPressed} />;
        }

        if (session.startAt.toDateString() === new Date().toDateString()) {
            return (
                <>
                    <JoinSessionButton tandem={tandem} />
                    <ShowSessionButton session={session} tandem={tandem} onShowSessionPressed={onShowSessionPressed} />
                </>
            );
        }

        return (
            <>
                <ShowSessionButton session={session} tandem={tandem} onShowSessionPressed={onShowSessionPressed} />
                <UpdateSessionButton
                    session={session}
                    tandem={tandem}
                    onUpdateSessionPressed={onUpdateSessionPressed}
                />
            </>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {!isHybrid && (
                    <div className={styles.bubble}>
                        <TandemBubble language={tandem.learningLanguage} profile={tandem.partner} />
                    </div>
                )}
                <div className={styles.content}>
                    {isHybrid && (
                        <div className={styles.bubble}>
                            <TandemBubble language={tandem.learningLanguage} profile={tandem.partner} />
                        </div>
                    )}
                    <div className={styles.text}>
                        <div className={styles['text-container']}>
                            <span className={styles.name}>
                                {t('session.card.session_with', { name: tandem.partner?.user.firstname })}
                            </span>
                        </div>
                        {session ? (
                            <>
                                <div className={styles['text-container']}>
                                    <DateFormatted date={session.startAt} />
                                    {session.cancelledAt && (
                                        <div className={styles.cancelled}>{t('session.card.cancelled')}</div>
                                    )}
                                </div>
                                <div className={styles['text-container']}>
                                    {formatInTimeZone(
                                        session.startAt,
                                        profile?.user?.university.timezone as string,
                                        'HH:mm (zzzz, zzz)'
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className={styles['text-container']}>{t('session.card.no_session')}</div>
                        )}
                    </div>
                    {!isHybrid && <div className={styles.buttons}>{renderSessionButtons()}</div>}
                </div>
                {isHybrid && <div className={styles.buttons}>{renderSessionButtons()}</div>}
            </div>
        </div>
    );
};

export default SessionCard;
