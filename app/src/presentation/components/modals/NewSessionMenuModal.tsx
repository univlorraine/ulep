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
import { useState } from 'react';
import { useHistory } from 'react-router';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreState } from '../../../store/storeTypes';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import SelectTandemContent from '../contents/SelectTandemContent';
import SessionFormContent from '../contents/SessionFormContent';
import ShowSessionContent from '../contents/ShowSessionContent';
import { DisplaySessionModal, DisplaySessionModalEnum } from './SessionsContentModal';

interface NewSessionMenuModalProps {
    isVisible: boolean;
    onClose: () => void;
    setRefreshSessions?: (value: boolean) => void;
}

const NewSessionMenuModal: React.FC<NewSessionMenuModalProps> = ({ isVisible, onClose, setRefreshSessions }) => {
    const [selectedTandem, setSelectedTandem] = useState<Tandem>();
    const [displaySessionContent, setDisplaySessionContent] = useState<DisplaySessionModal>();
    const [isSingleTandem, setIsSingleTandem] = useState<boolean>(false);
    const history = useHistory();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    const profile = useStoreState((state) => state.profile);

    const onSelectedTandem = (tandem: Tandem, isSingleTandem?: boolean) => {
        setSelectedTandem(tandem);
        if (isSingleTandem) {
            setIsSingleTandem(true);
        }
    };

    const onShowSessionPressed = (session: Session, tandem: Tandem, confirmCreation?: boolean) => {
        if (isHybrid) {
            history.push('show-session', { session, tandem, confirmCreation });
        } else {
            setRefreshSessions && setRefreshSessions(true);
            setDisplaySessionContent({
                type: DisplaySessionModalEnum.show,
                tandem,
                session,
                confirmCreation,
            });
        }
    };

    const onBackPressed = () => {
        setSelectedTandem(undefined);
        setDisplaySessionContent(undefined);
        onClose();
    };

    const onCloseForm = () => {
        if (selectedTandem && isSingleTandem) {
            onClose();
        } else {
            setSelectedTandem(undefined);
        }
    };

    if (!profile) {
        return null;
    }

    return (
        <>
            <IonModal
                animated
                isOpen={isVisible}
                onDidDismiss={onBackPressed}
                className={`modal modal-side ${isHybrid ? 'hybrid' : ''}`}
            >
                {!selectedTandem && (
                    <SelectTandemContent
                        onBackPressed={onBackPressed}
                        setSelectedTandem={onSelectedTandem}
                        profile={profile}
                    />
                )}
                {selectedTandem && !displaySessionContent?.session && (
                    <SessionFormContent
                        goBack={onCloseForm}
                        isHybrid={false}
                        profile={profile}
                        tandem={selectedTandem}
                        onShowSessionPressed={onShowSessionPressed}
                    />
                )}
                {displaySessionContent && displaySessionContent.session && displaySessionContent.tandem && (
                    <ShowSessionContent
                        goBack={onBackPressed}
                        isHybrid={false}
                        profile={profile}
                        session={displaySessionContent.session}
                        tandem={displaySessionContent.tandem}
                        confirmCreation={displaySessionContent.confirmCreation || false}
                        onUpdateSessionPressed={() => {}}
                    />
                )}
            </IonModal>
        </>
    );
};

export default NewSessionMenuModal;
