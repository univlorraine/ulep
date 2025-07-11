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

import { IonButton, IonIcon, IonImg, IonItem, IonLabel, IonList, IonSearchbar, useIonToast } from '@ionic/react';
import { arrowRedoOutline, downloadOutline, pencilOutline, trashOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddSvg, VocabularyPng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import Vocabulary from '../../../domain/entities/Vocabulary';
import VocabularyList from '../../../domain/entities/VocabularyList';
import HeaderSubContent from '../HeaderSubContent';
import ConfirmModal from '../modals/ConfirmModal';
import VocabularyLine from '../vocabulary/VocabularyLine';
import styles from './VocabularyListContent.module.css';

interface VocabularyContentProps {
    goBack?: () => void;
    profile: Profile;
    vocabularyList: VocabularyList;
    vocabularyPairs: Vocabulary[];
    isLoading: boolean;
    associatedTandem?: Tandem;
    searchVocabularies: string;
    onAddVocabulary: (vocabulary?: Vocabulary) => void;
    onUpdateVocabularyList: () => void;
    onDeleteVocabularyList: () => void;
    onSearch: (search: string) => void;
    onShareVocabularyList: () => void;
    onUnshareVocabularyList: () => void;
    setQuizzSelectedListIds: (selectedListsIds: string[]) => void;
}

const VocabularyItemContent: React.FC<VocabularyContentProps> = ({
    profile,
    vocabularyList,
    vocabularyPairs,
    goBack,
    isLoading,
    onAddVocabulary,
    onUpdateVocabularyList,
    onDeleteVocabularyList,
    searchVocabularies,
    onSearch,
    associatedTandem,
    onShareVocabularyList,
    onUnshareVocabularyList,
    setQuizzSelectedListIds,
}) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { getVocabularyListPdf } = useConfig();
    const [showDeleteVocabularyListModal, setShowDeleteVocabularyListModal] = useState(false);
    const isVocabularyListShared = vocabularyList.editorsIds.length > 1;
    const isVocabularyListMine = vocabularyList.isMine(profile);

    const exportToPdf = async () => {
        const result = await getVocabularyListPdf.execute(
            vocabularyList.id,
            `${vocabularyList.name.replace(' ', '_')}.pdf`
        );

        if (result instanceof Error) {
            return showToast({
                message: t(result.message),
                duration: 3000,
            });
        }
        showToast({
            message: t('vocabulary.list.export.success'),
            duration: 2000,
        });
    };

    const onShareVocabularyListPressed = () => {
        onShareVocabularyList();
    };

    const onUnshareVocabularyListPressed = () => {
        onUnshareVocabularyList();
    };

    const onStartQuizzPressed = () => {
        const selectedListsId = [vocabularyList.id];
        setQuizzSelectedListIds(selectedListsId);
    };

    const isSharable = isVocabularyListMine && associatedTandem && associatedTandem.partner;

    let vocabulariesWithoutPronunciation;
    if (vocabularyList.creatorId === profile.id) {
        vocabulariesWithoutPronunciation = vocabularyPairs.filter((vocabulary) => {
            return !vocabulary.pronunciationTranslationUrl;
        });
    } else {
        vocabulariesWithoutPronunciation = vocabularyPairs.filter((vocabulary) => {
            return !vocabulary.pronunciationWordUrl;
        });
    }
    const [isSearchbarFocused, setIsSearchbarFocused] = useState(false);

    return (
        <div>
            <HeaderSubContent
                title={`${vocabularyList.symbol} ${vocabularyList.name}`}
                onBackPressed={() => goBack?.()}
                kebabContent={(closeMenu) => (
                    <IonList lines="none">
                        {isSharable && (
                            <IonItem
                                button={true}
                                detail={false}
                                onClick={() => {
                                    isVocabularyListShared
                                        ? onUnshareVocabularyListPressed()
                                        : onShareVocabularyListPressed();
                                    closeMenu();
                                }}
                            >
                                <IonIcon icon={arrowRedoOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>
                                    {isVocabularyListShared
                                        ? t('vocabulary.pair.unshare_button')
                                        : t('vocabulary.pair.share_button')}
                                </IonLabel>
                            </IonItem>
                        )}
                        <IonItem
                            button={true}
                            detail={false}
                            onClick={() => {
                                exportToPdf();
                                closeMenu();
                            }}
                        >
                            <IonIcon icon={downloadOutline} aria-hidden="true" />
                            <IonLabel className={styles['popover-label']}>{t('vocabulary.pair.export')}</IonLabel>
                        </IonItem>
                        {isVocabularyListMine && (
                            <IonItem
                                button={true}
                                detail={false}
                                onClick={() => {
                                    onUpdateVocabularyList();
                                    closeMenu();
                                }}
                            >
                                <IonIcon icon={pencilOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>
                                    {t('vocabulary.list.update.title')}
                                </IonLabel>
                            </IonItem>
                        )}
                        {isVocabularyListMine && (
                            <IonItem
                                button={true}
                                detail={false}
                                onClick={() => {
                                    setShowDeleteVocabularyListModal(true);
                                    closeMenu();
                                }}
                            >
                                <IonIcon icon={trashOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>
                                    {t('vocabulary.list.delete.title')}
                                </IonLabel>
                            </IonItem>
                        )}
                        {vocabularyList.numberOfVocabularies > 0 && (
                            <IonItem
                                button={true}
                                detail={false}
                                onClick={() => {
                                    onStartQuizzPressed();
                                    closeMenu();
                                }}
                            >
                                <IonIcon icon={arrowRedoOutline} aria-hidden="true" />
                                <IonLabel className={styles['popover-label']}>
                                    {t('vocabulary.list.start_quiz_menu')}
                                </IonLabel>
                            </IonItem>
                        )}
                    </IonList>
                )}
            />
            <div className={styles.content}>
                {!isLoading && !searchVocabularies && vocabularyPairs.length === 0 && (
                    <div className={styles.emptyContainer} role="listitem">
                        <IonImg alt="" aria-hidden className={styles.emptyImage} src={VocabularyPng} />
                        <p className={styles.emptyText}>{t('vocabulary.pair.empty')}</p>
                        <IonButton
                            className="tertiary-button no-padding"
                            fill="clear"
                            onClick={() => onAddVocabulary()}
                        >
                            <IonIcon aria-hidden slot="start" name="add-outline" />
                            {t('vocabulary.pair.create')}
                        </IonButton>
                    </div>
                )}
                {!isLoading && (vocabularyPairs.length > 0 || searchVocabularies) && (
                    <IonSearchbar
                        className={isSearchbarFocused ? styles.searchbarFocused : styles.searchbar}
                        onFocus={() => setIsSearchbarFocused(true)}
                        onBlur={() => setIsSearchbarFocused(false)}
                        placeholder={t('vocabulary.pair.search') as string}
                        onIonClear={() => onSearch('')}
                        onIonCancel={() => onSearch('')}
                        onIonChange={(e) => onSearch(e.detail.value as string)}
                        value={searchVocabularies}
                    />
                )}
                <div role="list">
                    {!isLoading &&
                        vocabulariesWithoutPronunciation &&
                        vocabulariesWithoutPronunciation.length > 0 &&
                        vocabularyList.isEditable && (
                            <>
                                <div className={styles.pronunciationTitle}>
                                    <h2>{t('vocabulary.pair.without_pronunciation')}</h2>
                                </div>
                                {vocabulariesWithoutPronunciation.map((vocabulary) => (
                                    <VocabularyLine
                                        key={vocabulary.id}
                                        onVocabularyClick={onAddVocabulary}
                                        vocabulary={vocabulary}
                                        isEditable={vocabularyList.isEditable}
                                        vocabularyList={vocabularyList}
                                    />
                                ))}
                                <div className={styles.pronunciationTitle}>
                                    <h2>{t('vocabulary.pair.every_pronunciation')}</h2>
                                </div>
                            </>
                        )}
                </div>
                <div role="list">
                    {!isLoading &&
                        vocabularyPairs.length > 0 &&
                        vocabularyPairs.map((vocabulary) => (
                            <VocabularyLine
                                key={vocabulary.id}
                                onVocabularyClick={onAddVocabulary}
                                vocabulary={vocabulary}
                                isEditable={vocabularyList.isEditable}
                                vocabularyList={vocabularyList}
                            />
                        ))}
                </div>
            </div>

            {vocabularyList.isEditable && (
                <IonButton fill="clear" className={styles.addButton} onClick={() => onAddVocabulary()}>
                    <IonImg aria-hidden className={styles.addIcon} src={AddSvg} />
                </IonButton>
            )}

            <ConfirmModal
                isVisible={showDeleteVocabularyListModal}
                onClose={() => setShowDeleteVocabularyListModal(false)}
                onValidate={() => onDeleteVocabularyList()}
                title={t('vocabulary.list.delete.modal')}
            />
        </div>
    );
};

export default VocabularyItemContent;
