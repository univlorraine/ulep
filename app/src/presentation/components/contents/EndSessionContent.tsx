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
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StarPng } from '../../../assets';
import { ReactComponent as Background } from '../../../assets/background.svg';
import { useConfig } from '../../../context/ConfigurationContext';
import styles from './EndSessionContent.module.css';

type EndSessionContentProps = {
    onClose: () => void;
    onCompleteLearningJournalPressed: () => void;
};

const EndSessionContent: React.FC<EndSessionContentProps> = ({ onClose, onCompleteLearningJournalPressed }) => {
    const { t } = useTranslation();
    const { configuration } = useConfig();

    return (
        <div className={styles.container}>
            <Background
                style={{ color: configuration.primaryBackgroundImageColor }}
                className={styles.background_image}
                aria-hidden={true}
            />
            <div className={styles.header}>
                <h1 className={styles.title}>{t('home_page.end_session.title')}</h1>
            </div>
            <div className={styles.star}>
                <img src={StarPng} alt="" aria-hidden />
            </div>
            <div className={styles.content}>
                <p className={styles.description}>{t('home_page.end_session.time_past')}</p>
                <p className={styles.description}>{t('home_page.end_session.complete_learning_journal')}</p>
            </div>
            <div className={styles.buttons}>
                <IonButton
                    fill="clear"
                    className="primary-button no-padding"
                    onClick={onCompleteLearningJournalPressed}
                >
                    {t('home_page.end_session.complete_learning_journal_button')}
                </IonButton>
                <IonButton fill="clear" className="secondary-button no-padding" onClick={onClose}>
                    {t('home_page.end_session.close_button')}
                </IonButton>
            </div>
        </div>
    );
};

export default EndSessionContent;
