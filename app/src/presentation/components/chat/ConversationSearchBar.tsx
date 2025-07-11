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

import { IonButton, IonIcon, IonSearchbar, useIonToast } from '@ionic/react';
import { t } from 'i18next';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useState } from 'react';
import { CloseBlackSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Conversation from '../../../domain/entities/chat/Conversation';
import styles from './ConversationSearchBar.module.css';

interface ConversationSearchBarProps {
    conversation: Conversation;
    loadMessages: (messageId: string) => void;
    clearSearch: () => void;
    setIsSearchMode: (isSearchMode: boolean) => void;
    onSearchIsEmpty: () => void;
}

const ConversationSearchBar: React.FC<ConversationSearchBarProps> = ({
    setIsSearchMode,
    conversation,
    loadMessages,
    onSearchIsEmpty,
    clearSearch,
}) => {
    const { searchMessagesIdsFromConversation } = useConfig();
    const [showToast] = useIonToast();
    const [messagesIds, setMessagesIds] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const searchForMessages = async (searchText: string) => {
        if (searchText.length <= 1) {
            return;
        }
        const messagesIds = await searchMessagesIdsFromConversation.execute(conversation.id, searchText);

        if (messagesIds instanceof Error) {
            return showToast({
                message: t(messagesIds.message),
                duration: 2000,
                color: 'danger',
            });
        }

        setMessagesIds(messagesIds);
        setCurrentIndex(0);
        if (messagesIds.length === 0) {
            onSearchIsEmpty();
        } else {
            loadMessages(messagesIds[currentIndex]);
        }
    };

    const onClear = () => {
        setMessagesIds([]);
        setCurrentIndex(0);
        setIsSearchMode(false);
        clearSearch();
    };

    const goPrevious = () => {
        if (messagesIds.length === 0) {
            return;
        } else if (currentIndex < messagesIds.length - 1) {
            setCurrentIndex(currentIndex + 1);
            loadMessages(messagesIds[currentIndex + 1]);
        } else {
            setCurrentIndex(0);
            loadMessages(messagesIds[0]);
        }
    };

    const goNext = () => {
        if (messagesIds.length === 0) {
            return;
        } else if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            loadMessages(messagesIds[currentIndex - 1]);
        } else {
            setCurrentIndex(messagesIds.length - 1);
            loadMessages(messagesIds[messagesIds.length - 1]);
        }
    };

    return (
        <div className={styles.searchContainer}>
            <IonSearchbar
                cancelButtonIcon={CloseBlackSvg}
                cancelButtonText="close"
                onIonChange={(e) => searchForMessages(e.detail.value as string)}
                onIonCancel={onClear}
                placeholder={t('chat.search.placeholder') as string}
                aria-label={t('chat.search.placeholder') as string}
                showCancelButton="always"
            ></IonSearchbar>
            <IonButton fill="clear" className={styles.searchIcon} onClick={goPrevious}>
                <IonIcon
                    icon={chevronBackOutline}
                    aria-label={t('chat.search.previous') as string}
                    title={t('chat.search.previous') as string}
                />
            </IonButton>
            <IonButton fill="clear" className={styles.searchIcon} onClick={goNext}>
                <IonIcon
                    icon={chevronForwardOutline}
                    aria-label={t('chat.search.next') as string}
                    title={t('chat.search.next') as string}
                />
            </IonButton>
        </div>
    );
};

export default ConversationSearchBar;
