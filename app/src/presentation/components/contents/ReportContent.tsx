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

import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftSvg, CloseBlackSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { ReportCategoryName } from '../../../domain/entities/Report';
import ReportCategory from '../../../domain/entities/ReportCategory';
import { useStoreActions } from '../../../store/storeTypes';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import Dropdown, { DropDownItem } from '../DropDown';
import TextInput from '../TextInput';
import styles from './ReportContent.module.css';

interface ReportContentProps {
    onClose: () => void;
}

const ReportContent: React.FC<ReportContentProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { createReport, getAllReportCategories } = useConfig();
    const [showToast] = useIonToast();
    const [reportCategories, setReportCategories] = useState<DropDownItem<ReportCategory>[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ReportCategory>();
    const [note, setNote] = useState<string>('');
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const setRefreshReport = useStoreActions((state) => state.setRefreshReports);

    const buttonDisabled = !selectedCategory || note.length === 0;

    const getCategories = async () => {
        const result = await getAllReportCategories.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        const categories = result.filter((category) => category.name !== ReportCategoryName.CONVERSATION);

        setSelectedCategory(categories[0]);
        return setReportCategories(
            categories.map((reportCategory) => ({ label: reportCategory.name, value: reportCategory }))
        );
    };

    const sendReport = async () => {
        if (buttonDisabled) {
            return;
        }

        if (note.length === 0) {
            return await showToast({ message: t('home_page.report.note_required'), duration: 2000 });
        }

        const result = await createReport.execute(selectedCategory.id, note);
        setRefreshReport();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        onClose();
        return await showToast({ message: t('home_page.report.report_sent'), duration: 2000 });
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className={`content-wrapper ${styles.content}`}>
            <div className={styles.header} role="navigation">
                {isHybrid ? (
                    <button
                        aria-label={t('global.go_back') as string}
                        className={styles['back-button']}
                        onClick={onClose}
                    >
                        <img alt={t('global.go_back') as string} src={ArrowLeftSvg} />
                    </button>
                ) : (
                    <div />
                )}
                <span>{t('global.account')}</span>
                {!isHybrid ? (
                    <button
                        aria-label={t('global.go_back') as string}
                        className={styles['back-button']}
                        onClick={onClose}
                    >
                        <img alt={t('global.go_back') as string} src={CloseBlackSvg} />
                    </button>
                ) : (
                    <div />
                )}
            </div>
            <div className={styles.container} role="main">
                <h1 className="title large-margin-bottom">{t('home_page.report.title')}</h1>
                <div className={styles.category}>
                    <Dropdown
                        onChange={setSelectedCategory}
                        options={reportCategories}
                        title={t('home_page.report.category_title')}
                    />
                </div>
                <TextInput
                    id="input-report-note"
                    onChange={setNote}
                    title={t('home_page.report.note') as string}
                    type="text-area"
                    value={note}
                    maxLength={1000}
                />
                <div className={styles['button-container']}>
                    <button
                        aria-label={t('home_page.report.send_button') as string}
                        className={`primary-button ${buttonDisabled ? 'disabled' : ''}`}
                        disabled={buttonDisabled}
                        onClick={sendReport}
                    >
                        {t('home_page.report.send_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportContent;
