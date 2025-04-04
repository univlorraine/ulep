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
                {edito.video && <span dangerouslySetInnerHTML={{ __html: edito.video }}></span>}
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
