import { IonImg, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ArrowRightSvg, EditPng, ParameterPng, SignalerPng, SmallAvatarPng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import { AvatarMaxSizeError } from '../../../domain/usecases/UpdateAvatarUsecase';
import { useStoreActions } from '../../../store/storeTypes';
import useLogout from '../../hooks/useLogout';
import Avatar from '../Avatar';
import Loader from '../Loader';
import styles from './ProfileContent.module.css';

interface ProfileContentProps {
    onParameterPressed: () => void;
    profile: Profile;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ onParameterPressed, profile }) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const [loading, setLoading] = useState<boolean>(false);
    const { updateProfile } = useStoreActions((store) => store);
    const { cameraAdapter, updateAvatar } = useConfig();
    const history = useHistory();

    const { handleLogout } = useLogout();

    const changeAvatar = async () => {
        const avatarFile = await cameraAdapter.getPictureFromGallery();

        if (avatarFile) {
            setLoading(true);
            const result = await updateAvatar.execute(avatarFile);

            if (result instanceof Error) {
                let message = t(result.message);
                if (result instanceof AvatarMaxSizeError) {
                    message = t(result.message, { maxSize: result.maxSize });
                }
                setLoading(false);
                return await showToast({ message, duration: 5000 });
            }
            updateProfile({ avatar: result });

            return setLoading(false);
        }
    };

    const navigateToReports = (): void => {
        history.push('/reports');
    };

    return (
        <div className={`content-wrapper ${styles.container}`}>
            <div className={styles.content}>
                <h1 className="title">{t('home_page.profile.title')}</h1>
                {loading ? (
                    <Loader height="150" width="150" wrapperStyle={{}} wrapperClass="" />
                ) : (
                    <Avatar user={profile.user} className={styles.image} />
                )}
                <span className={styles.name}>{`${profile.user.firstname} ${profile.user.lastname}`}</span>
                <span className={styles.university}>{profile.user.university.name}</span>

                <button
                    aria-label={t('home_page.profile.reports') as string}
                    className={`${styles.button} margin-bottom`}
                    onClick={navigateToReports}
                >
                    <div className={styles['button-container']}>
                        <IonImg className={styles.icon} alt="" src={SignalerPng} aria-hidden={true} />
                        <span className="margin-left">{t('home_page.profile.reports')}</span>
                    </div>
                    <img alt="" src={ArrowRightSvg} aria-hidden={true} />
                </button>
                <button
                    aria-label={t('home_page.profile.edit') as string}
                    className={`${styles.button} margin-bottom`}
                    onClick={changeAvatar}
                >
                    <div className={styles['button-container']}>
                        <img alt="" src={EditPng} aria-hidden={true} />
                        <span className="margin-left">{t('home_page.profile.edit')}</span>
                    </div>
                    <img alt="" src={ArrowRightSvg} aria-hidden={true} />
                </button>

                <button
                    aria-label={t('home_page.profile.parameters') as string}
                    className={`${styles.button} margin-bottom`}
                    onClick={onParameterPressed}
                >
                    <div className={styles['button-container']}>
                        <img alt="" src={ParameterPng} aria-hidden={true} />
                        <span className="margin-left">{t('home_page.profile.parameters')}</span>
                    </div>
                    <img alt="" src={ArrowRightSvg} aria-hidden={true} />
                </button>

                <button
                    aria-label={t('home_page.profile.disconnect') as string}
                    className={styles.button}
                    onClick={handleLogout}
                >
                    <div className={styles['button-container']}>
                        <img alt="" src={SmallAvatarPng} aria-hidden={true} />
                        <span className="margin-left">{t('home_page.profile.disconnect')}</span>
                    </div>
                    <img alt="" src={ArrowRightSvg} />
                </button>
            </div>
        </div>
    );
};

export default ProfileContent;
