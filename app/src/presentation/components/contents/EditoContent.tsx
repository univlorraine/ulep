import { IonButton, IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { StarPng } from '../../../assets';
import Edito from '../../../domain/entities/Edito';
import { useStoreState } from '../../../store/storeTypes';
import { codeLanguageToFlag } from '../../utils';
import HeaderSubContent from '../HeaderSubContent';
import NetworkImage from '../NetworkImage';
import styles from './EditoContent.module.css';

interface EditoContentProps {
    edito: Edito;
    onGoBack: () => void;
}

const EditoContent: React.FC<EditoContentProps> = ({ edito, onGoBack }) => {
    const { t } = useTranslation();
    const profile = useStoreState((state) => state.profile);
    const language = useStoreState((state) => state.language);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(language || profile?.nativeLanguage.code, {
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    return (
        <div className={styles.content}>
            <HeaderSubContent title={t('edito.title')} onBackPressed={onGoBack} isBackButton />
            <div className={styles.header}>
                <span className={styles.title}>{edito.university.name}</span>
                {edito.university.logo && <NetworkImage id={edito.university.logo} />}
                <span className={styles.title}>{t('edito.service_date')}</span>
                <span>{`${formatDate(edito.university.openServiceDate)} - ${formatDate(edito.university.closeServiceDate)}`}</span>
                <span className={styles.title}>{t('edito.admission_date')}</span>
                <span>{`${formatDate(edito.university.admissionStart)} - ${formatDate(edito.university.admissionEnd)}`}</span>
            </div>
            <div className={styles.body}>
                <div className={styles.logoContainer}>
                    <div className={styles.imageContainer}>
                        <IonImg className={styles.image} src={edito.image ? edito.image : StarPng} />
                    </div>
                    <div className={styles.flagContainer}>
                        <span className={styles.flag}>{codeLanguageToFlag(edito.university.nativeLanguage.code)}</span>
                    </div>
                </div>
                <span dangerouslySetInnerHTML={{ __html: edito.content }}></span>
                {edito.university.website && (
                    <IonButton
                        fill="clear"
                        className={`${styles.website} primary-button`}
                        href={edito.university.website}
                    >
                        {t('edito.website')}
                    </IonButton>
                )}
            </div>
        </div>
    );
};

export default EditoContent;
