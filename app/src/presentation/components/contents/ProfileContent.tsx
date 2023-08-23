import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ArrowLeftSvg, ArrowRightSvg, EditPng, ParameterPng, SmallAvatarPng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreActions } from '../../../store/storeTypes';
import styles from './ProfileContent.module.css';

interface ProfileContentProps {
    onClose: () => void;
    onParameterPressed: () => void;
    profileFirstname: string;
    profileLastname: string;
    profilePicture: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    onClose,
    onParameterPressed,
    profileFirstname,
    profileLastname,
    profilePicture,
}) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { logout, updateProfile } = useStoreActions((store) => store);
    const { cameraAdapter, updateAvatar } = useConfig();

    //TODO: test this when api will be ready
    const changeAvatar = async () => {
        const avatarFile = await cameraAdapter.getPictureFromGallery();

        if (avatarFile) {
            const result = await updateAvatar.execute(avatarFile);

            if (result instanceof Error) {
                return await showToast({ message: t(result.message), duration: 5000 });
            }
            return updateProfile({ avatar: result });
        }
    };

    const disconnect = () => {
        return logout();
    };

    return (
        <div className={styles.container}>
            <div>
                <button className={styles['back-button']} onClick={onClose}>
                    <img alt="arrow-left" src={ArrowLeftSvg} />
                </button>
            </div>
            <div className={styles.content}>
                <h1 className="title">{t('home_page.profile.title')}</h1>
                <img alt="avatar" className={styles.image} src={profilePicture} />
                <span className={styles.name}>{`${profileFirstname} ${profileLastname}`}</span>

                <button className={`${styles.button} margin-bottom`} onClick={changeAvatar}>
                    <div className={styles['button-container']}>
                        <img alt="edit" src={EditPng} />
                        <span className="margin-left">{t('home_page.profile.edit')}</span>
                    </div>
                    <img alt="arrow-right" src={ArrowRightSvg} />
                </button>

                <button className={`${styles.button} margin-bottom`} onClick={onParameterPressed}>
                    <div className={styles['button-container']}>
                        <img alt="parameter" src={ParameterPng} />
                        <span className="margin-left">{t('home_page.profile.parameters')}</span>
                    </div>
                    <img alt="arrow-right" src={ArrowRightSvg} />
                </button>

                <button className={styles.button} onClick={disconnect}>
                    <div className={styles['button-container']}>
                        <img alt="disconnect" src={SmallAvatarPng} />
                        <span className="margin-left">{t('home_page.profile.disconnect')}</span>
                    </div>
                    <img alt="arrow-right" src={ArrowRightSvg} />
                </button>
            </div>
        </div>
    );
};

export default ProfileContent;
