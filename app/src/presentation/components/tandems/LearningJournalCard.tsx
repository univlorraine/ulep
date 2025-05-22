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

import { IonButton, useIonToast } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { TrophiePng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import Tandem from '../../../domain/entities/Tandem';
import { useStoreState } from '../../../store/storeTypes';
import useGetMediaObject from '../../hooks/useGetMediaObject';
import useOnOpenChat from '../../hooks/useOnOpenChat';
import LearningCard from '../card/LearningCard';
import styles from './LearningJournalCard.module.css';

interface LearningJournalCardProps {
    tandem: Tandem;
    onOpenEdito: () => void;
    currentColor: string;
}

const LearningJournalCard: React.FC<LearningJournalCardProps> = ({ tandem, onOpenEdito, currentColor }) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const { fileAdapter } = useConfig();
    const language = useStoreState((state) => state.language);
    const onOpenChat = useOnOpenChat({ tandemId: tandem.id, withAdministrator: true });
    const {
        loading: loadingCertificate,
        image: certificateFile,
        error: certificateError,
    } = useGetMediaObject({ id: tandem.learningLanguage.certificateFile?.id || '' });

    const downloadableCertificate =
        tandem.learningLanguage.sharedCertificate &&
        tandem.learningLanguage.certificateFile &&
        !loadingCertificate &&
        !certificateError;

    const onDownloadCertificate = async () => {
        if (downloadableCertificate) {
            const firstName = tandem.learningLanguage.profile?.user.firstname.replace(/ /g, '_');
            const lastName = tandem.learningLanguage.profile?.user.lastname.replace(/ /g, '_');

            const certificateFileName: string =
                [
                    t('learning_journal.certificate_file_name'),
                    t(`languages_code.${tandem.learningLanguage.code}`),
                    `${firstName}_${lastName}`,
                ].join('_') + '.pdf';
            try {
                await fileAdapter.saveFile(certificateFile, certificateFileName);
                showToast({
                    message: t('learning_journal.download_successful'),
                    duration: 2000,
                });
            } catch (error) {
                console.error(error);
                showToast({
                    message: t('learning_journal.download_failed'),
                    duration: 2000,
                });
            }
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return (
            new Intl.NumberFormat(language, {
                minimumIntegerDigits: 2,
                useGrouping: false,
            }).format(hours) +
            'h' +
            new Intl.NumberFormat(language, {
                minimumIntegerDigits: 2,
                useGrouping: false,
            }).format(remainingMinutes)
        );
    };

    return (
        <LearningCard title={t('learning_journal.title')}>
            <div className={styles.container} style={{ backgroundColor: currentColor }}>
                <div className={styles.content}>
                    <div className={styles.imageContainer}>
                        <img alt="" className={styles.image} src={TrophiePng} aria-hidden={true} />
                    </div>
                    <div className={styles.textContainer}>
                        <h2 className={styles.title}>{t('learning_journal.certificate_title')}</h2>
                        <p className={styles.text}>{t('learning_journal.certificate_text')}</p>
                    </div>
                </div>
                <ul className={styles.activities}>
                    <li className={styles.activity}>
                        <h3 className={styles.activityTitle}>{t('learning_journal.sessions_duration_title')}</h3>
                        <span className={styles.activityValue}>
                            {formatDuration(tandem.learningLanguage.visioDuration || 0)}
                        </span>
                    </li>
                    <li className={styles.activity}>
                        <h3 className={styles.activityTitle}>{t('learning_journal.vocabulary_title')}</h3>
                        <span className={styles.activityValue}>{tandem.learningLanguage.countVocabularies}</span>
                    </li>
                    <li className={styles.activity}>
                        <h3 className={styles.activityTitle}>{t('learning_journal.activities_title')}</h3>
                        <span className={styles.activityValue}>{tandem.learningLanguage.countActivities}</span>
                    </li>
                </ul>
                <div className={styles.buttons}>
                    {downloadableCertificate ? (
                        <IonButton fill="clear" className="primary-button no-padding" onClick={onDownloadCertificate}>
                            {t('learning_journal.download_certificate_button')}
                        </IonButton>
                    ) : (
                        <IonButton fill="clear" className="primary-button no-padding" onClick={onOpenChat}>
                            {t('learning_journal.ask_for_certificate_button')}
                        </IonButton>
                    )}
                    <IonButton
                        fill="clear"
                        className={`secondary-button no-padding ${styles.link}`}
                        onClick={onOpenEdito}
                    >
                        {t('learning_journal.how_to_get_certificate_button')}
                    </IonButton>
                </div>
            </div>
        </LearningCard>
    );
};

export default LearningJournalCard;
