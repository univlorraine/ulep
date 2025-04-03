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

import { IonButton, IonImg, IonPage } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg } from '../../../assets';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import HeaderSubContent from '../HeaderSubContent';
import SelectTandemModal from '../modals/SelectTandemModal';
import SessionList from '../sessions/SessionList';
import styles from './SessionListContent.module.css';

interface SessionListContentProps {
    goBack?: () => void;
    isHybrid: boolean;
    tandems: Tandem[];
    sessions: Session[];
    onCreateSessionPressed: (tandem: Tandem) => void;
    onShowSessionPressed: (session: Session, tandem: Tandem, confirmCreation?: boolean) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
}

const Content: React.FC<SessionListContentProps> = ({
    goBack,
    tandems,
    sessions,
    isHybrid,
    onCreateSessionPressed,
    onShowSessionPressed,
    onUpdateSessionPressed,
}) => {
    const { t } = useTranslation();
    const [showSelectTandemModal, setShowSelectTandemModal] = useState(false);
    const onAddSession = () => {
        const activeTandemsCount = tandems.filter((tandem) => Boolean(tandem.partner)).length;

        if (activeTandemsCount === 1) {
            onCreateSessionPressed(tandems[0]);
        } else {
            setShowSelectTandemModal(true);
        }
    };

    const onSelectTandem = (tandems: Tandem[]) => {
        onCreateSessionPressed(tandems[0]);
        setShowSelectTandemModal(false);
    };

    return (
        <div className={styles.container}>
            <HeaderSubContent
                title={t('session.list.title', { count: sessions.length })}
                onBackPressed={() => goBack?.()}
            />
            <SessionList
                tandems={tandems}
                sessions={sessions}
                isHybrid={isHybrid}
                onShowSessionPressed={onShowSessionPressed}
                onUpdateSessionPressed={onUpdateSessionPressed}
                onCreateSessionPressed={onCreateSessionPressed}
            />
            <IonButton fill="clear" className="add-button" onClick={() => onAddSession()}>
                <IonImg aria-hidden className="add-button-icon" src={AddSvg} />
            </IonButton>
            <SelectTandemModal
                isVisible={showSelectTandemModal}
                onClose={() => setShowSelectTandemModal(false)}
                onSelectTandem={onSelectTandem}
                title="session.select_partner_title"
                tandems={tandems}
            />
        </div>
    );
};

const SessionListContent: React.FC<SessionListContentProps> = ({
    isHybrid,
    goBack,
    tandems,
    sessions,
    onCreateSessionPressed,
    onShowSessionPressed,
    onUpdateSessionPressed,
}) => {
    if (!isHybrid) {
        return (
            <Content
                goBack={goBack}
                isHybrid={isHybrid}
                tandems={tandems}
                sessions={sessions}
                onCreateSessionPressed={onCreateSessionPressed}
                onShowSessionPressed={onShowSessionPressed}
                onUpdateSessionPressed={onUpdateSessionPressed}
            />
        );
    }

    return (
        <IonPage className={styles.content}>
            <Content
                goBack={goBack}
                isHybrid={isHybrid}
                tandems={tandems}
                sessions={sessions}
                onCreateSessionPressed={onCreateSessionPressed}
                onShowSessionPressed={onShowSessionPressed}
                onUpdateSessionPressed={onUpdateSessionPressed}
            />
        </IonPage>
    );
};

export default SessionListContent;
