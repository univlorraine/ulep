import { useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftSvg, ArrowRightSvg, EditPng, ParameterPng, SmallAvatarPng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { useStoreActions } from '../../../store/storeTypes';
import styles from './ProfileContent.module.css';
import { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import Avatar from '../Avatar';
import Profile from '../../../domain/entities/Profile';

interface ProfileContentProps {
    onClose: () => void;
    onParameterPressed: () => void;
    profile: Profile;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ onClose, onParameterPressed, profile }) => {
    const { configuration } = useConfig();
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const [loading, setLoading] = useState<boolean>(false);
    const { logout, updateProfile } = useStoreActions((store) => store);
    const { cameraAdapter, updateAvatar } = useConfig();

    const changeAvatar = async () => {
        const avatarFile = await cameraAdapter.getPictureFromGallery();

        if (avatarFile) {
            setLoading(true);
            const result = await updateAvatar.execute(avatarFile);

            if (result instanceof Error) {
                setLoading(false);
                return await showToast({ message: t(result.message), duration: 5000 });
            }
            updateProfile({ avatar: result });

            return setLoading(false);
        }
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
                {loading ? (
                    <TailSpin
                        height="150"
                        width="150"
                        color={configuration.primaryColor}
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                ) : (
                    <Avatar user={profile.user} className={styles.image} />
                )}
                <span className={styles.name}>{`${profile.user.firstname} ${profile.user.lastname}`}</span>
                <span className={styles.university}>{profile.user.university.name}</span>

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

                <button className={styles.button} onClick={() => logout()}>
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
