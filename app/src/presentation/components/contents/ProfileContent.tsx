import { IonImg, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ArrowRightSvg, AvatarPng, BackgroundPurpleProfilePng, SettingsPng, SignalerPng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import { AvatarMaxSizeError } from '../../../domain/usecases/UpdateAvatarUsecase';
import { useStoreActions, useStoreState } from '../../../store/storeTypes';
import useLogout from '../../hooks/useLogout';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { BACKGROUND_PROFILE_STYLE_INLINE, HYBRID_MAX_WIDTH } from '../../utils';
import EditoContentModal from '../modals/EditoContentModal';
import ProfileDetailsCard from '../profile/ProfileDetailsCard';
import styles from './ProfileContent.module.css';

interface ProfileContentProps {
    onDisplaySettings: () => void;
    profile: Profile;
    onProfileChange: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ onDisplaySettings, profile, onProfileChange }) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [universityId, setUniversityId] = useState<string | undefined>(undefined);
    const { updateProfile } = useStoreActions((store) => store);
    const { language } = useStoreState((store) => store);
    const { cameraAdapter, updateAvatar } = useConfig();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const history = useHistory();

    const { handleLogout } = useLogout();

    const { user } = profile;

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

    const formattedDate = (date: Date): string => {
        return new Intl.DateTimeFormat(language || profile.nativeLanguage.code, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(new Date(date));
    };

    const buttonsProfile = [
        {
            label: t('profile_page.buttons.reports'),
            icon: SignalerPng,
            onClick: navigateToReports,
        },
        {
            label: t('profile_page.buttons.parameters'),
            icon: SettingsPng,
            onClick: onDisplaySettings,
        },
        {
            label: t('profile_page.buttons.disconnect'),
            icon: AvatarPng,
            onClick: handleLogout,
        },
    ];

    const backgroundStyle = {
        backgroundImage: `url('${BackgroundPurpleProfilePng}')`,
        backgroundColor: 'rgba(196, 186, 214, 1)',
        ...BACKGROUND_PROFILE_STYLE_INLINE,
    };

    return (
        <div className={`content-wrapper ${styles.container} ${isHybrid ? styles.hybrid : ''}`}>
            <div className={styles.content}>
                <div className={styles.titleContainer} style={isHybrid ? backgroundStyle : {}}>
                    <h1 className={`title ${styles.title}`}>{t('profile_page.title')}</h1>
                </div>
                <div className={styles.cards}>
                    <ProfileDetailsCard
                        user={user}
                        title={t('profile_page.profile_card.title')}
                        onPress={changeAvatar}
                        textButton={
                            isHybrid
                                ? t('profile_page.profile_card.button_mobile')
                                : t('profile_page.profile_card.button')
                        }
                        subtitle={`${user.firstname} ${user.lastname}`}
                        firstInfo={`${user.age} ${t('profile_page.profile_card.years_old')}`}
                        secondInfo={user.division}
                        isProfileCard={true}
                        isLoading={loading}
                    />
                    <ProfileDetailsCard
                        user={user}
                        title={t('profile_page.university_card.title')}
                        onPress={() => setUniversityId(user.university.id)}
                        textButton={t('profile_page.university_card.button')}
                        subtitle={user.university.name}
                        firstInfo={t('profile_page.university_card.semester_date') || ''}
                        secondInfo={formattedDate(user.university.admissionStart)}
                        thirdInfo={`${t('profile_page.university_card.end_date')} ${formattedDate(user.university.admissionEnd)}`}
                    />
                </div>

                <div className={styles.buttons}>
                    {buttonsProfile.map((button) => (
                        <button aria-label={button.label as string} className={styles.button} onClick={button.onClick}>
                            <div className={styles['button-container']}>
                                <IonImg className={styles.icon} src={button.icon} aria-hidden={true} />
                                <span className="margin-left">{button.label}</span>
                            </div>
                            <img alt="" src={ArrowRightSvg} aria-hidden={true} />
                        </button>
                    ))}
                </div>
            </div>
            <EditoContentModal
                universityId={universityId}
                onClose={() => setUniversityId(undefined)}
                profile={profile}
            />
        </div>
    );
};

export default ProfileContent;
