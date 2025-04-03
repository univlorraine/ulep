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

import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Profile from '../../../domain/entities/Profile';
import VocabularyList from '../../../domain/entities/VocabularyList';
import Checkbox from '../Checkbox';
import VocabularyListLineCheckbox from '../vocabulary/VocabularyListLineCheckbox';
import styles from './SelectVocabularyListsForQuizModal.module.css';

interface SelectVocabularyListsForQuizModaleProps {
    isVisible: boolean;
    onClose: () => void;
    onValidate: (selectedListsIds: string[]) => void;
    vocabularyLists: VocabularyList[];
    profile: Profile;
    isHybrid?: boolean;
}

const SelectVocabularyListsForQuizModale: React.FC<SelectVocabularyListsForQuizModaleProps> = ({
    isVisible,
    onClose,
    onValidate,
    vocabularyLists,
    profile,
    isHybrid,
}) => {
    const { t } = useTranslation();
    const [selectedLists, setSelectedLists] = useState<VocabularyList[]>([]);
    const [selectedListsIds, setSelectedListsIds] = useState<string[]>([]);

    const onSelectVocabularyList = (vocabularyList: VocabularyList) => {
        if (selectedLists.includes(vocabularyList)) {
            setSelectedLists(selectedLists.filter((list) => list !== vocabularyList));
        } else {
            setSelectedLists([...selectedLists, vocabularyList]);
        }
    };

    const onSelectAllVocabularyLists = () => {
        if (selectedLists.length === vocabularyLists.length) {
            setSelectedLists([]);
        } else {
            setSelectedLists(vocabularyLists);
        }
    };

    useEffect(() => {
        setSelectedLists([]);
    }, [isVisible]);

    useEffect(() => {
        setSelectedListsIds(selectedLists.map((selectedList) => selectedList.id));
    }, [selectedLists]);

    return (
        <IonModal animated isOpen={isVisible} onDidDismiss={onClose} className={styles.modal}>
            <div className={`${styles.container} ${isHybrid && styles.mobileContainer}`}>
                <IonButton size="small" fill="clear" color="dark" className={styles.close} onClick={onClose}>
                    <IonIcon
                        aria-label={t('vocabulary.list.start_quiz.close') as string}
                        icon={closeCircle}
                        slot="icon-only"
                        className={styles.close_icon}
                    />
                </IonButton>
                <span className={styles.title}>{t('vocabulary.list.start_quiz.title')}</span>

                <div className={styles.list}>
                    <IonButton
                        aria-label={t('vocabulary.list.start_quiz.all_lists') as string}
                        fill="clear"
                        className={styles.item_all_lists}
                        onClick={() => onSelectAllVocabularyLists()}
                    >
                        <div className={styles.all_lists}>
                            <div className={styles.content}>
                                <span className={styles.title}>{t('vocabulary.list.start_quiz.all_lists')}</span>
                            </div>
                            <div className={styles['checkbox-container']}>
                                <Checkbox
                                    isSelected={selectedLists.length === vocabularyLists.length}
                                    className={styles.checkbox}
                                />
                            </div>
                        </div>
                    </IonButton>
                    {vocabularyLists
                        .filter((vocabularyList) => vocabularyList.numberOfVocabularies > 0)
                        .map((vocabularyList) => (
                            <VocabularyListLineCheckbox
                                key={vocabularyList.id}
                                profile={profile}
                                vocabularyList={vocabularyList}
                                onSelectVocabularyList={() => onSelectVocabularyList(vocabularyList)}
                                isSelected={selectedLists.includes(vocabularyList)}
                            />
                        ))}
                </div>
                <IonButton
                    className={`secondary-button ${styles.button}`}
                    fill="clear"
                    onClick={() => onValidate(selectedListsIds)}
                >
                    {t('vocabulary.list.start_quiz.create')}
                </IonButton>
            </div>
        </IonModal>
    );
};

export default SelectVocabularyListsForQuizModale;
