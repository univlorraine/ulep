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

import { IonImg, IonItem } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { MessagesPng, SignalerPng } from '../../../assets';
import Report from '../../../domain/entities/Report';
import { useStoreState } from '../../../store/storeTypes';
import { codeLanguageToFlag } from '../../utils';
import styles from './ReportsListItem.module.css';
import ReportStatusTag from './ReportStatusTag';

interface ReportsListItemProps {
    report: Report;
    key: string;
}

const ReportsListItem: React.FC<ReportsListItemProps> = ({ report, key }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const isConversationReport = report.category.name === 'Conversation';
    const language = useStoreState((state) => state.language);
    const profile = useStoreState((state) => state.profile);

    const formattedDate = new Intl.DateTimeFormat(language || profile?.nativeLanguage?.code, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(report.createdAt));

    const getTandemInfo = () => {
        if (!report.metadata?.tandemUserName || !report.metadata?.tandemLanguage)
            return t('reports_page.list.tandem_missing');

        const tandemUserName = report.metadata.tandemUserName;
        const tandemLanguage = codeLanguageToFlag(report.metadata.tandemLanguage);

        return `${t('reports_page.list.tandem')} ${tandemUserName} ${tandemLanguage}`;
    };

    return (
        <IonItem
            key={key}
            className={styles.line}
            button={true}
            onClick={() => history.push(`/report-item`, { reportId: report.id })}
            role="listitem"
        >
            <IonImg
                aria-hidden
                className={styles.image}
                src={isConversationReport ? MessagesPng : SignalerPng}
                style={{ objectFit: 'contain' }}
                alt={
                    isConversationReport
                        ? (t('reports_page.list.conversation_report') as string)
                        : (t('reports_page.list.report_report') as string)
                }
            />
            <div className={styles.content}>
                <div className={styles.status_container}>
                    <ReportStatusTag status={report.status} />
                </div>
                <p className={styles.date}>
                    {t('reports_page.list.date')} {formattedDate} -{' '}
                    {isConversationReport ? getTandemInfo() : t('reports_page.list.application')}
                </p>
                <p className={styles.message}>
                    {!isConversationReport ? report.category.name : t('reports_page.list.report_message')}
                </p>
            </div>
        </IonItem>
    );
};

export default ReportsListItem;
