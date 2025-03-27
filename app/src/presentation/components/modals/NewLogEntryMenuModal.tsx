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

import { IonContent, IonModal, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useConfig } from '../../../context/ConfigurationContext';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import { LogEntryType } from '../../../domain/entities/LogEntry';
import { useStoreState } from '../../../store/storeTypes';
import CreateOrUpdateCustomLogEntryContent from '../contents/learning-book/CreateOrUpdateCustomLogEntryContent';
import SelectLanguageContent from '../contents/SelectLanguageContent';

interface NewLogEntryMenuModalProps {
    isVisible: boolean;
    onClose: () => void;
    isHybrid?: boolean;
}

const NewsContentModal: React.FC<NewLogEntryMenuModalProps> = ({ isVisible, onClose, isHybrid }) => {
    const { createLogEntry } = useConfig();
    const [showToast] = useIonToast();
    const { t } = useTranslation();
    const history = useHistory();
    const { profile } = useStoreState((state) => ({ profile: state.profile }));
    const [selectedLanguage, setSelectedLanguage] = useState<LearningLanguage>();

    const createCustomLogEntry = async ({
        date,
        title,
        description,
    }: {
        date: Date;
        title: string;
        description: string;
    }) => {
        if (!selectedLanguage) {
            return;
        }

        const result = await createLogEntry.execute({
            type: LogEntryType.CUSTOM_ENTRY,
            learningLanguageId: selectedLanguage.id,
            metadata: {
                date,
                title,
                content: description,
            },
        });

        if (result instanceof Error) {
            showToast(t(result.message), 3000);
        }

        onClose();
    };

    const onSelectedLanguage = (language: LearningLanguage) => {
        setSelectedLanguage(language);
    };

    const onSelectedLanguageMobile = (language: LearningLanguage) => {
        history.push('/learning-book', { learningLanguage: language });
    };

    const onCloseModal = () => {
        setSelectedLanguage(undefined);
        onClose();
    };

    if (!profile) {
        return null;
    }

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onCloseModal} className={`modal modal-side`}>
            {!selectedLanguage && (
                <SelectLanguageContent
                    onBackPressed={onClose}
                    setSelectedLanguage={onSelectedLanguage}
                    profile={profile}
                />
            )}
            {selectedLanguage && (
                <IonContent>
                    <CreateOrUpdateCustomLogEntryContent
                        onBackPressed={onClose}
                        profile={profile}
                        onSubmit={createCustomLogEntry}
                    />
                </IonContent>
            )}
        </IonModal>
    );
};

export default NewsContentModal;
