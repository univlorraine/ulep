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
import { ArrowLeftSvg, ClockPng, CloseBlackSvg, TandemNotFoundPng } from '../../../assets';
import { ReactComponent as Background } from '../../../assets/background.svg';
import { useConfig } from '../../../context/ConfigurationContext';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { HYBRID_MAX_WIDTH } from '../../utils';
import styles from './TandemStatusContent.module.css';

interface TandemStatusContentProps {
    onFindNewTandem: () => void;
    onClose: () => void;
    status?: TandemStatus;
}

const TandemStatusContent: React.FC<TandemStatusContentProps> = ({ onFindNewTandem, onClose, status }) => {
    const { configuration } = useConfig();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const waiting = status === 'DRAFT' || status === 'VALIDATED_BY_ONE_UNIVERSITY' || status === 'PAUSED';
    const tradKey = waiting ? 'draft' : 'not_found';
    return (
        <div
            id="modal-content"
            className={`${styles.container} content-wrapper`}
            style={{ backgroundColor: configuration.secondaryColor }}
        >
            <Background className={styles.image} style={{ color: configuration.secondaryBackgroundImageColor }} />
            <button
                aria-label={t('global.close') as string}
                className={styles['close-container']}
                style={{ justifyContent: !isHybrid ? 'flex-end' : 'flex-start' }}
                onClick={onClose}
            >
                <img alt="" src={!isHybrid ? CloseBlackSvg : ArrowLeftSvg} aria-hidden={true} />
            </button>
            <div className={styles.content}>
                <span className="title extra-large-margin-bottom">{t(`home_page.tandem_${tradKey}.title`)}</span>
                <img
                    alt=""
                    className="extra-large-margin-bottom"
                    src={waiting ? ClockPng : TandemNotFoundPng}
                    aria-hidden={true}
                />
                <span className="subtitle extra-large-margin-bottom">{t(`home_page.tandem_${tradKey}.subtitle`)}</span>
                {status === 'INACTIVE' && (
                    <div className={styles['bottom-container']}>
                        <button
                            aria-label={t('home_page.tandem_not_found.button_pass') as string}
                            className="tertiary-button extra-large-margin-bottom"
                            onClick={onClose}
                        >
                            {t('home_page.tandem_not_found.button_pass')}
                        </button>
                        <button
                            aria-label={t('home_page.tandem_not_found.button') as string}
                            className="primary-button extra-large-margin-bottom"
                            onClick={onClose}
                        >
                            {t('home_page.tandem_not_found.button')}
                        </button>
                    </div>
                )}
                {waiting && (
                    <button
                        aria-label={t('home_page.tandem_draft.button') as string}
                        className="primary-button extra-large-margin-bottom"
                        onClick={onClose}
                    >
                        {t('home_page.tandem_draft.button')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TandemStatusContent;
