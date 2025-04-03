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

import { IonItem, IonLabel, IonList, IonPopover } from '@ionic/react';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../utils';
import styles from './MenuNew.module.css';

interface MenuNewProps {
    onVocabularyPressed: () => void;
    onLearningDiaryPressed: () => void;
    onSessionPressed: () => void;
    onActivityPressed: () => void;
    setIsMenuVisible?: (value: boolean) => void;
    trigger: string;
    className?: string;
    isMenuOpen?: boolean;
}

const MenuNew: React.FC<MenuNewProps> = ({
    onVocabularyPressed,
    onLearningDiaryPressed,
    onSessionPressed,
    onActivityPressed,
    setIsMenuVisible,
    trigger,
    className,
    isMenuOpen,
}) => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    const popoverRef = useRef<any | null>(null);

    const onCloseMenu = () => {
        popoverRef.current?.dismiss();
        setIsMenuVisible?.(false);
    };

    useEffect(() => {
        if (!isMenuOpen) {
            onCloseMenu();
        }
    }, [isMenuOpen]);

    const items = [
        {
            id: 1,
            title: t('navigation.sidebar.new.vocabulary'),
            onClick: onVocabularyPressed,
        },
        {
            id: 2,
            title: t('navigation.sidebar.new.learning_diary'),
            onClick: onLearningDiaryPressed,
        },
        {
            id: 3,
            title: t('navigation.sidebar.new.activity'),
            onClick: onActivityPressed,
        },
        {
            id: 4,
            title: t('navigation.sidebar.new.session'),
            onClick: onSessionPressed,
        },
    ];

    const menuSide = !isHybrid ? 'right' : 'top';
    const menuAlignment = !isHybrid ? 'end' : 'center';

    return (
        <IonPopover
            ref={popoverRef}
            trigger={trigger}
            triggerAction="click"
            showBackdrop={false}
            className={`${styles.container} ${className}`}
            side={menuSide}
            alignment={menuAlignment}
            arrow={false}
            onDidDismiss={() => {
                setIsMenuVisible?.(false);
            }}
            size="auto"
        >
            <IonList className={styles.list} lines="full">
                {items.map((item) => (
                    <IonItem
                        key={item.id}
                        button={true}
                        detail={false}
                        className={styles.item}
                        onClick={() => {
                            item.onClick();
                            onCloseMenu();
                        }}
                    >
                        <IonLabel className={styles['popover-label']}>{item.title}</IonLabel>
                    </IonItem>
                ))}
            </IonList>
        </IonPopover>
    );
};

export default MenuNew;
