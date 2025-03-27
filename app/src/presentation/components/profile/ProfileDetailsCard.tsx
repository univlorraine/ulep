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

import { IonButton, IonIcon, IonText } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import User from '../../../domain/entities/User';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import Avatar from '../Avatar';
import Loader from '../Loader';
import NetworkImage from '../NetworkImage';
import styles from './ProfileDetailsCard.module.css';

interface ProfileDetailsCardProps {
    user: User;
    title: string;
    onPress: () => void;
    textButton: string;
    subtitle: string;
    firstInfo?: string;
    secondInfo?: string;
    thirdInfo?: string;
    isProfileCard?: boolean;
    isLoading?: boolean;
}

const ProfileDetailsCard: React.FC<ProfileDetailsCardProps> = ({
    user,
    title,
    onPress,
    textButton,
    subtitle,
    firstInfo,
    secondInfo,
    thirdInfo,
    isProfileCard,
    isLoading,
}) => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    return (
        <div className={`${styles.card} ${isProfileCard ? styles.profile_card : ''} ${isHybrid ? styles.hybrid : ''}`}>
            <div className={styles.container_title}>
                <h2 className={styles.title}>{title}</h2>
                {!isHybrid && (
                    <IonButton
                        fill="clear"
                        className={`primary-button ${styles.button}`}
                        onClick={onPress}
                        size="small"
                    >
                        <IonText>{textButton}</IonText>
                    </IonButton>
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.infos}>
                    {isProfileCard && isLoading && <Loader />}
                    {isProfileCard && !isLoading && <Avatar user={user} className={styles.image} />}
                    {!isProfileCard && (
                        <NetworkImage id={user.university.logo || ''} className={`${styles.image} ${styles.logo}`} />
                    )}
                    <div className={styles.details}>
                        <p className={styles.subtitle}>{subtitle}</p>
                        <div>
                            <p>{firstInfo}</p>
                            {secondInfo && <p>{secondInfo}</p>}
                            {thirdInfo && <p>{thirdInfo}</p>}
                        </div>
                    </div>
                </div>
                {isHybrid && (
                    <IonButton
                        fill="clear"
                        className={`tertiary-button ${styles.button}`}
                        onClick={onPress}
                        size="small"
                    >
                        <IonIcon className={styles.icon} icon={searchOutline} slot="start" />
                        <IonText>{textButton}</IonText>
                    </IonButton>
                )}
            </div>
        </div>
    );
};

export default ProfileDetailsCard;
