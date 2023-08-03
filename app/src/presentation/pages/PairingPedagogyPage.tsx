import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import ColoredCard from '../components/ColoredCard';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import SitesModal from '../components/modals/SitesModal';
import styles from './css/SignUp.module.css';

interface PedagogieData {
    color: string;
    title: string;
    button: string;
    value: Pedagogy;
    display?: boolean;
}

const PairingPedagogyPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration } = useConfig();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [pedagogySelected, setPedagogySelected] = useState<Pedagogy>();

    if (!profileSignUp.university) {
        return <Redirect to={'/signup'} />;
    }

    const pedagogiesData: PedagogieData[] = [
        {
            color: '#8BC4C4',
            title: t('pairing_pedagogy_page.tandem_title'),
            button: t('pairing_pedagogy_page.tandem_button'),
            value: 'TANDEM',
            display: profileSignUp.university.isCentral,
        },
        {
            color: '#7997C6',
            title: t('pairing_pedagogy_page.etandem_title'),
            button: t('pairing_pedagogy_page.etandem_button'),
            value: 'ETANDEM',
            display: true,
        },
        {
            color: '#5DABC6',
            title: t('pairing_pedagogy_page.both_title'),
            button: t('pairing_pedagogy_page.both_button'),
            value: 'BOTH',
            display: profileSignUp.university.isCentral,
        },
    ];

    const onPedagogyPressed = (pedagogy: Pedagogy) => {
        if (pedagogy !== 'ETANDEM' && profileSignUp.university && profileSignUp.university.sites.length > 1) {
            return setPedagogySelected(pedagogy);
        }

        if (pedagogy !== 'ETANDEM' && profileSignUp.university && profileSignUp.university.sites.length === 1) {
            updateProfileSignUp({ pedagogy, site: profileSignUp.university.sites[0] });
            return history.push('/signup/pairing/language/confirm');
        }

        updateProfileSignUp({ pedagogy });
        return history.push('/signup/pairing/language/confirm');
    };

    const onSiteValidated = (site: string) => {
        updateProfileSignUp({ pedagogy: pedagogySelected, site });
        return history.push('/signup/pairing/language/confirm');
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={24}
            headerTitle={t('global.pairing_title')}
        >
            <div className={styles.body}>
                <div>
                    <h1 className="title">{t('pairing_pedagogy_page.title')}</h1>
                    <p className="subtitle">{t('pairing_pedagogy_page.subtitle')}</p>

                    {pedagogiesData.map((pedagogyData) => {
                        if (!pedagogyData.display) {
                            return;
                        }

                        return (
                            <ColoredCard<Pedagogy>
                                buttonName={pedagogyData.button}
                                color={pedagogyData.color}
                                onPressed={onPedagogyPressed}
                                title={pedagogyData.title}
                                value={pedagogyData.value}
                            />
                        );
                    })}
                </div>
                <SitesModal
                    isVisible={!!pedagogySelected}
                    onClose={() => setPedagogySelected(undefined)}
                    onValidate={onSiteValidated}
                    sites={profileSignUp.university.sites}
                />
            </div>
        </WebLayoutCentered>
    );
};

export default PairingPedagogyPage;
