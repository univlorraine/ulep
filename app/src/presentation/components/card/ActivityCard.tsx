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

import { IonButton, IonIcon } from '@ionic/react';
import { alertCircle, checkmarkCircle, closeCircle } from 'ionicons/icons';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightSvg } from '../../../assets';
import { Activity, ActivityStatus } from '../../../domain/entities/Activity';
import { useStoreState } from '../../../store/storeTypes';
import { codeLanguageToFlag } from '../../utils';
import styles from './ActivityCard.module.css';

interface ActivityCardProps {
    activity: Activity;
    onClick: (activity: Activity) => void;
    isHybrid: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick, isHybrid }) => {
    const { t } = useTranslation();
    const profile = useStoreState((state) => state.profile);
    const isMine = activity.creator?.id === profile?.id;

    return (
        <button className={styles.container} onClick={() => onClick(activity)}>
            <div className={styles.imageContainer}>
                <img className={styles.image} src={activity.imageUrl} alt={activity.title} />
                {isMine && activity.status === ActivityStatus.PUBLISHED && (
                    <IonIcon className={styles.status} icon={checkmarkCircle} color="success" aria-hidden="true" />
                )}
                {isMine && activity.status === ActivityStatus.IN_VALIDATION && (
                    <IonIcon className={styles.status} icon={alertCircle} color="warning" aria-hidden="true" />
                )}
                {isMine && activity.status === ActivityStatus.REJECTED && (
                    <IonIcon className={styles.status} icon={closeCircle} color="danger" aria-hidden="true" />
                )}
            </div>
            <div className={styles.content}>
                <p className={styles.title}>{activity.title}</p>
                <span className={styles.subtitle}>
                    {activity.description
                        .slice(0, 250)
                        .split('\n')
                        .map((line, index, array) => (
                            <Fragment key={index}>
                                {index === array.length - 1
                                    ? `${line}${activity.description.length >= 250 ? '...' : ''}`
                                    : line}
                                <br />
                            </Fragment>
                        ))}
                </span>
            </div>
            <div className={styles.information}>
                <div className={styles['information-container']}>
                    <span className={styles['information-title']}>{t('activity.list.language')}</span>
                    <span className={styles['information-content']}>
                        {codeLanguageToFlag(activity.language.code)} {t(`languages_code.${activity.language.code}`)}
                    </span>
                </div>

                <div className={styles['information-container']}>
                    <span className={styles['information-title']}>{t('activity.list.level')}</span>
                    <span className={styles['information-content']}>{activity.languageLevel}</span>
                </div>

                <div className={styles['information-container']}>
                    <span className={styles['information-title']}>{t('activity.list.theme')}</span>
                    <span className={styles['information-content']}>{activity.activityTheme.content}</span>
                </div>

                {!isHybrid && (
                    <IonButton fill="clear">
                        <IonIcon icon={ArrowRightSvg} />
                    </IonButton>
                )}
            </div>
        </button>
    );
};

export default ActivityCard;
