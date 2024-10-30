import { IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { AvatarPlaceholderPng, HomeDarkPng, HomeLightPng, Star2Png, VocabularyPng } from '../../../assets';
import styles from './VisioFrameMenu.module.css';

interface VisioFrameMenuProps {
    onMenuItemPress: (id: string) => void;
    selectedMenuItem: string;
    tandemName?: string;
}

const VisioFrameMenu: React.FC<VisioFrameMenuProps> = ({ onMenuItemPress, selectedMenuItem, tandemName }) => {
    const { t } = useTranslation();

    let itemsMenu = [
        {
            id: 'home',
            label: t('visio.menu.home'),
            icon: HomeDarkPng,
            iconLight: HomeLightPng,
        },
        {
            id: 'vocabulary',
            label: t('visio.menu.vocabulary'),
            icon: VocabularyPng,
        },
        {
            id: 'activity',
            label: t('visio.menu.activity'),
            icon: Star2Png,
        },
        {
            id: 'profile',
            label: t('visio.menu.profile', { name: tandemName }),
            icon: AvatarPlaceholderPng,
        },
    ];

    if (!tandemName) {
        itemsMenu = itemsMenu.filter((item) => item.id !== 'profile');
    }

    return (
        <div className={styles.container}>
            {itemsMenu.map((item) => {
                const isActive = selectedMenuItem === item.id;

                return (
                    <div
                        className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                        key={item.id}
                        onClick={() => onMenuItemPress(item.id)}
                    >
                        <IonImg className={styles.icon} src={isActive && item.iconLight ? item.iconLight : item.icon} />
                        <p>{item.label}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default VisioFrameMenu;
