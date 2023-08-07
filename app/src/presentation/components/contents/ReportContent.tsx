import { useIonToast } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftSvg, CloseBlackSvg } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import ReportCategory from '../../../domain/entities/ReportCategory';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import Dropdown, { DropDownItem } from '../DropDown';
import TextInput from '../TextInput';
import styles from './ReportContent.module.css';

interface ReportContentProps {
    onGoBack: () => void;
    onReportSent: () => void;
}

const ReportContent: React.FC<ReportContentProps> = ({ onGoBack, onReportSent }) => {
    const { t } = useTranslation();
    const { createReport, getAllReportCategories } = useConfig();
    const [showToast] = useIonToast();
    const [reportCategories, setReportCategories] = useState<DropDownItem<ReportCategory>[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ReportCategory>();
    const [note, setNote] = useState<string>('');
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    const getCategories = async () => {
        const result = await getAllReportCategories.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        setSelectedCategory(result[0]);
        return setReportCategories(
            result.map((reportCategory) => ({ title: reportCategory.name, value: reportCategory }))
        );
    };

    //TODO: test this when token will be up
    const sendReport = async () => {
        if (!selectedCategory) {
            return;
        }
        const result = await createReport.execute(selectedCategory.id, note);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        onReportSent();
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                {isHybrid ? (
                    <button className={styles['back-button']} onClick={onGoBack}>
                        <img alt="go-back" src={ArrowLeftSvg} />
                    </button>
                ) : (
                    <div />
                )}
                <span>{t('global.account')}</span>
                {!isHybrid ? (
                    <button className={styles['back-button']} onClick={onGoBack}>
                        <img alt="go-back" src={CloseBlackSvg} />
                    </button>
                ) : (
                    <div />
                )}
            </div>
            <div className={styles.container}>
                <h1 className="title large-margin-bottom">{t('home_page.report.title')}</h1>
                <div className={styles.category}>
                    <Dropdown
                        onChange={setSelectedCategory}
                        options={reportCategories}
                        title={t('home_page.report.category_title')}
                    />
                </div>
                <TextInput onChange={setNote} title={t('home_page.report.note')} type="text-area" value={note} />
                <div className={styles['button-container']}>
                    <button
                        className={`primary-button ${!selectedCategory ? 'disabled' : ''}`}
                        disabled={!selectedCategory}
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
