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

import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import HomeHeader from '../HomeHeader';
import NewActivityMenuModal from '../modals/NewActivityMenuModal';
import NewLogEntryMenuModal from '../modals/NewLogEntryMenuModal';
import NewSessionMenuModal from '../modals/NewSessionMenuModal';
import NewVocabularyMenuModal from '../modals/NewVocabularyMenuModal';
import ReportModal from '../modals/ReportModal';
import styles from './OnlineWebLayout.module.css';
import Sidebar from './Sidebar';
interface OnlineLayoutProps {
    children: React.ReactNode;
    onRefresh?: () => void;
}

const OnlineWebLayout: React.FC<OnlineLayoutProps> = ({ children, onRefresh }) => {
    const [displayReport, setDisplayReport] = useState<boolean>(false);
    const [displayVocabularySidebar, setDisplayVocabularySidebar] = useState<boolean>(false);
    const [displayActivitySidebar, setDisplayActivitySidebar] = useState<boolean>(false);
    const [displayLearningDiary, setDisplayLearningDiary] = useState<boolean>(false);
    const [displaySessionModal, setDisplaySessionModal] = useState<boolean>(false);
    return (
        <IonPage>
            <HomeHeader />
            <div className={styles.container}>
                <Sidebar
                    onDisplayReport={() => setDisplayReport(true)}
                    onDisplayVocabularySidebar={() => setDisplayVocabularySidebar(true)}
                    onDisplayActivitySidebar={() => setDisplayActivitySidebar(true)}
                    onDisplayLearningDiary={() => setDisplayLearningDiary(true)}
                    onOpenActivitySidebar={() => setDisplayActivitySidebar(true)}
                    onDisplaySessionModal={() => setDisplaySessionModal(true)}
                />
                <IonContent className={styles.content}>{children}</IonContent>
            </div>
            <ReportModal isVisible={displayReport} onClose={() => setDisplayReport(false)} />
            <NewVocabularyMenuModal
                isVisible={displayVocabularySidebar}
                onClose={() => setDisplayVocabularySidebar(false)}
            />
            <NewActivityMenuModal isVisible={displayActivitySidebar} onClose={() => setDisplayActivitySidebar(false)} />
            <NewSessionMenuModal
                isVisible={displaySessionModal}
                onClose={() => setDisplaySessionModal(false)}
                setRefreshSessions={onRefresh}
            />
            <NewLogEntryMenuModal isVisible={displayLearningDiary} onClose={() => setDisplayLearningDiary(false)} />
        </IonPage>
    );
};

export default OnlineWebLayout;
