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
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import SessionCard from './SessionCard';
import styles from './SessionListHome.module.css';

interface SessionListHomeProps {
    tandems: Tandem[];
    sessions: Session[];
    isHybrid: boolean;
    onShowSessionListPressed: () => void;
    onShowSessionPressed: (session: Session, tandem: Tandem) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
    onCreateSessionPressed: (tandem: Tandem) => void;
}

const SessionListHome: React.FC<SessionListHomeProps> = ({
    tandems,
    sessions,
    isHybrid,
    onShowSessionPressed,
    onUpdateSessionPressed,
    onCreateSessionPressed,
    onShowSessionListPressed,
}) => {
    const { t } = useTranslation();

    const handleShowSessionList = () => {
        onShowSessionListPressed();
    };

    const tandemsWithoutSession = tandems.filter((tandem) => 
        tandem.status === 'ACTIVE' &&
        !sessions.some((session) => session.tandemId === tandem.id
    ));
    
    const countTandems = tandemsWithoutSession.length;
    const countSessionsToDisplay = 3 - countTandems;

    return (
        <div className="home-card">
            <span className="home-card-title">{t('home_page.session.title', { count: sessions.length })}</span>
            <div className={styles.container}>
                <div className={styles['session-container']}>
                    {tandemsWithoutSession.map((tandem) => {
                        return (
                            <SessionCard
                                key={tandem.id}
                                tandem={tandem}
                                isHybrid={isHybrid}
                                onShowSessionPressed={onShowSessionPressed}
                                onUpdateSessionPressed={onUpdateSessionPressed}
                                onCreateSessionPressed={onCreateSessionPressed}
                            />
                        );
                    })}
                    {countSessionsToDisplay > 0 && sessions.slice(0, countSessionsToDisplay).map((session) => {
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
                </div>
                {sessions.length > 0 && (
                    <IonButton className="primary-button no-padding" fill="clear" onClick={handleShowSessionList}>
                        {t('home_page.session.show_session_list_button')}
                    </IonButton>
                )}
            </div>
        </div>
    );
};

export default SessionListHome;
