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

import { IonModal } from '@ionic/react';
import Profile from '../../../domain/entities/Profile';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import SessionFormContent from '../contents/SessionFormContent';
import SessionListContent from '../contents/SessionListContent';
import ShowSessionContent from '../contents/ShowSessionContent';

export const DisplaySessionModalEnum = {
    list: 'list',
    form: 'form',
    show: 'show',
};

export interface DisplaySessionModal {
    type: (typeof DisplaySessionModalEnum)[keyof typeof DisplaySessionModalEnum];
    tandem?: Tandem;
    session?: Session;
    confirmCreation?: boolean;
}

interface SessionsContentModalProps {
    isVisible: boolean;
    onClose: () => void;
    profile: Profile;
    tandems: Tandem[];
    sessions: Session[];
    displaySessionModal?: DisplaySessionModal;
    onCreateSessionPressed: (tandem: Tandem) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
    onShowSessionPressed: (session: Session, tandem: Tandem, confirmCreation?: boolean) => void;
}

const SessionsContentModal: React.FC<SessionsContentModalProps> = ({
    isVisible,
    onClose,
    profile,
    tandems,
    sessions,
    displaySessionModal,
    onCreateSessionPressed,
    onUpdateSessionPressed,
    onShowSessionPressed,
}) => {
    if (!displaySessionModal) {
        return null;
    }

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className="modal modal-side">
            <>
                {displaySessionModal?.type === DisplaySessionModalEnum.list && (
                    <SessionListContent
                        goBack={onClose}
                        isHybrid={false}
                        tandems={tandems}
                        sessions={sessions}
                        onCreateSessionPressed={onCreateSessionPressed}
                        onUpdateSessionPressed={onUpdateSessionPressed}
                        onShowSessionPressed={onShowSessionPressed}
                    />
                )}
                {displaySessionModal?.type === DisplaySessionModalEnum.form && displaySessionModal.tandem && (
                    <SessionFormContent
                        goBack={onClose}
                        isHybrid={false}
                        profile={profile}
                        tandem={displaySessionModal.tandem}
                        session={displaySessionModal.session}
                        onShowSessionPressed={onShowSessionPressed}
                    />
                )}
                {displaySessionModal?.type === DisplaySessionModalEnum.show &&
                    displaySessionModal.session &&
                    displaySessionModal.tandem && (
                        <ShowSessionContent
                            goBack={onClose}
                            isHybrid={false}
                            profile={profile}
                            session={displaySessionModal.session}
                            tandem={displaySessionModal.tandem}
                            confirmCreation={displaySessionModal.confirmCreation || false}
                            onUpdateSessionPressed={onUpdateSessionPressed}
                        />
                    )}
            </>
        </IonModal>
    );
};

export default SessionsContentModal;
