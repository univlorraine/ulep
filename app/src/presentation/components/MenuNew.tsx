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
