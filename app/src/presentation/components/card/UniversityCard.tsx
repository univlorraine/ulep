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

import { IonButton } from '@ionic/react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import University from '../../../domain/entities/University';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import NetworkImage from '../NetworkImage';
import styles from './UniversityCard.module.css';

interface UniversityCardProps {
    university: University;
    onPress: () => void;
    currentColor?: string;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university, onPress, currentColor }) => {
    const { t } = useTranslation();
    const formattedAdmissionStart = format(new Date(university.admissionStart), 'dd/MM/yyyy');
    const formattedAdmissionEnd = format(new Date(university.admissionEnd), 'dd/MM/yyyy');
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    return (
        <div
            className={`${styles.card} ${university.isCentral ? styles.central : styles.partner}`}
            style={{ backgroundColor: currentColor }}
        >
            <div className={`${styles.container}`}>
                {university.logo ? (
                    <NetworkImage
                        id={university.logo}
                        alt=""
                        role="presentation"
                        className={styles.logo}
                        aria-hidden={true}
                    />
                ) : (
                    <div className={styles.logo} aria-hidden={true} />
                )}
                <div className={styles['text-container']}>
                    <span className={styles.title}>{university.name}</span>
                    <br />
                    <span className={styles.subtitle}>{t('university_card.period')}</span>
                    <br />
                    <span className={styles.subtitle}>{`${formattedAdmissionStart} - ${formattedAdmissionEnd}`}</span>
                </div>
            </div>
            {isHybrid && (
                <IonButton className={`primary-button`} fill="clear" onClick={onPress}>
                    {t('university_card.button')}
                </IonButton>
            )}
        </div>
    );
};

export default UniversityCard;
