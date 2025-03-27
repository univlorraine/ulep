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

import { useTranslation } from 'react-i18next';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ReportSvg } from '../../../assets';
import EventObject from '../../../domain/entities/Event';
import News from '../../../domain/entities/News';
import Profile from '../../../domain/entities/Profile';
import Session from '../../../domain/entities/Session';
import Tandem from '../../../domain/entities/Tandem';
import Loader from '../../components/Loader';
import TandemList from '../../components/tandems/TandemList';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import EventsList from '../events/EventsList';
import NewsList from '../news/NewsList';
import SessionListHome from '../sessions/SessionListHome';
import styles from './HomeContent.module.css';

interface HomeContentProps {
    isLoading: boolean;
    profile: Profile;
    onReportPressed?: () => void;
    onValidatedTandemPressed: (tandem: Tandem) => void;
    tandems: Tandem[];
    sessions: Session[];
    news: News[];
    events: EventObject[];
    onShowSessionPressed: (session: Session, tandem: Tandem, confirmCreation?: boolean) => void;
    onUpdateSessionPressed: (session: Session, tandem: Tandem) => void;
    onCreateSessionPressed: (tandem: Tandem) => void;
    onShowSessionListPressed: () => void;
    onShowNewsPressed: (news?: News) => void;
    onShowEventPressed: (event?: EventObject) => void;
}

const HomeContent: React.FC<HomeContentProps> = ({
    isLoading,
    profile,
    onReportPressed,
    onValidatedTandemPressed,
    tandems,
    sessions,
    news,
    events,
    onShowSessionPressed,
    onUpdateSessionPressed,
    onCreateSessionPressed,
    onShowSessionListPressed,
    onShowNewsPressed,
    onShowEventPressed,
}) => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    return (
        <div className={styles.content}>
            <div className={`${styles.container} content-wrapper`}>
                <div className={styles['header']}>
                    <div className={styles['hello-container']}>
                        <h1 className={styles.hello}>{`${t('global.hello')} ${profile.user.firstname}`}</h1>
                    </div>
                </div>
                {isHybrid && <div className={styles.separator} />}
                <div className={styles['masonery-content']}>
                    {isLoading ? (
                        <div className={styles.loaderContainer}>
                            <Loader />
                        </div>
                    ) : (
                        <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 1024: 2 }}>
                            <Masonry className={styles.masonery} gutter="20px">
                                {tandems.find((tandem) => tandem.status === 'ACTIVE') && (
                                    <TandemList onTandemPressed={onValidatedTandemPressed} tandems={tandems} />
                                )}
                                {tandems.find((tandem) => tandem.status === 'ACTIVE') && (
                                    <SessionListHome
                                        tandems={tandems}
                                        sessions={sessions}
                                        onShowSessionListPressed={onShowSessionListPressed}
                                        onShowSessionPressed={onShowSessionPressed}
                                        onUpdateSessionPressed={onUpdateSessionPressed}
                                        onCreateSessionPressed={onCreateSessionPressed}
                                        isHybrid={isHybrid}
                                    />
                                )}
                                {news.length > 0 && (
                                    <NewsList news={news} profile={profile} onNewsPressed={onShowNewsPressed} />
                                )}
                                {events.length > 0 && (
                                    <EventsList events={events} profile={profile} onEventPressed={onShowEventPressed} />
                                )}
                            </Masonry>
                        </ResponsiveMasonry>
                    )}
                </div>
                {isHybrid && (
                    <div className={styles['report-container']}>
                        <button
                            aria-label={t('home_page.report.report_button') as string}
                            className={`tertiary-button ${styles.report}`}
                            onClick={onReportPressed}
                        >
                            {
                                <>
                                    <img alt="" className="margin-right" src={ReportSvg} aria-hidden={true} />
                                    <span>{t('home_page.report.report_button')}</span>
                                </>
                            }
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeContent;
