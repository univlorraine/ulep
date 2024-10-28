import { IonButton, IonIcon, IonPopover } from '@ionic/react';
import { chevronBack } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KebabSvg } from '../../assets';

interface HeaderSubContentProps {
    title: string;
    onBackPressed: () => void;
    kebabContent?: (closeMenu: () => void) => React.ReactNode;
    isBackButton?: boolean;
}

const HeaderSubContent: React.FC<HeaderSubContentProps> = ({
    title,
    onBackPressed,
    kebabContent,
    isBackButton = true,
}) => {
    const { t } = useTranslation();
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div className="subcontent-header">
            {isBackButton && (
                <IonButton fill="clear" onClick={onBackPressed}>
                    <IonIcon icon={chevronBack} color="dark" />
                </IonButton>
            )}
            <p className="subcontent-title" style={{ paddingLeft: isBackButton ? 0 : 20 }}>
                {title}
            </p>
            {kebabContent ? (
                <>
                    <IonButton
                        fill="clear"
                        id="click-trigger"
                        onClick={() => setShowMenu(!showMenu)}
                        aria-label={t('global.kebab_button') as string}
                    >
                        <IonIcon icon={KebabSvg} color="dark" />
                    </IonButton>
                    <IonPopover trigger="click-trigger" triggerAction="click" isOpen={showMenu} showBackdrop={false}>
                        {kebabContent(() => setShowMenu(false))}
                    </IonPopover>
                </>
            ) : (
                <div style={{ width: 40 }} />
            )}
        </div>
    );
};

export default HeaderSubContent;
