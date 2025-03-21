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
