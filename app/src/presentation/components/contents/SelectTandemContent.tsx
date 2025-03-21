import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../context/ConfigurationContext';
import Profile from '../../../domain/entities/Profile';
import Tandem from '../../../domain/entities/Tandem';
import HeaderSubContent from '../HeaderSubContent';
import TandemCardButton from '../tandems/TandemCardButton';
import styles from './SelectTandemContent.module.css';

interface SelectTandemContentProps {
    onBackPressed: () => void;
    setSelectedTandem: (tandem: Tandem, isSingleTandem?: boolean) => void;
    profile: Profile;
}

const SelectTandemContent: React.FC<SelectTandemContentProps> = ({ onBackPressed, setSelectedTandem, profile }) => {
    const { t } = useTranslation();
    const { getAllTandems } = useConfig();

    const [tandems, setTandems] = useState<Tandem[]>([]);

    const getProfilesTandems = async () => {
        const tandems = await getAllTandems.execute(profile.id);
        if (tandems instanceof Error) {
            return [];
        }

        setTandems(tandems);

        if (tandems.length === 1) {
            setSelectedTandem(tandems[0], true);
        }
    };

    useEffect(() => {
        getProfilesTandems();
    }, [profile]);

    return (
        <div className={styles.container}>
            <HeaderSubContent title={t('sidebar_modal.tandem.head_title')} onBackPressed={onBackPressed} />
            <div className={styles.content}>
                <h1 className="title">{t('sidebar_modal.tandem.title')}</h1>
                <p className={`text ${styles.text}`}>{t('sidebar_modal.tandem.text')}</p>
                {!tandems || !tandems.length ? (
                    <p className="text">{t('sidebar_modal.tandem.no_tandem')}</p>
                ) : (
                    <div className={styles['tandem-container']}>
                        {tandems
                            ?.filter((tandem) => tandem.partner)
                            .map((tandem) => (
                                <TandemCardButton
                                    key={tandem.id}
                                    tandem={tandem}
                                    onClick={() => setSelectedTandem(tandem)}
                                />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectTandemContent;
