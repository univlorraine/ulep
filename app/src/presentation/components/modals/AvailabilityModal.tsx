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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AvailabilityModal.module.css';
import Modal from './Modal';

interface AvailabilityModalProps {
    currentAvailabilitiesOptions?: AvailabilitiesOptions;
    isVisible: boolean;
    onClose: () => void;
    onValidate: (occurence: AvailabilitiesOptions) => void;
    title: string;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
    currentAvailabilitiesOptions,
    isVisible,
    onClose,
    onValidate,
    title,
}) => {
    const { t } = useTranslation();
    const [occurrence, setAvailabilitiesOptions] = useState<AvailabilitiesOptions>(
        currentAvailabilitiesOptions ?? 'VERY_AVAILABLE'
    );

    useEffect(() => {
        setAvailabilitiesOptions(currentAvailabilitiesOptions ?? 'VERY_AVAILABLE');
    }, [isVisible]);

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div>
                <div className={styles.container}>
                    <span className={styles.title} id="dialog_label">
                        {title}
                    </span>

                    <IonButton
                        aria-label={t('signup_availabilities_page.UNAVAILABLE') as string}
                        fill="clear"
                        className={`${styles['occurence-container']} ${
                            occurrence === 'UNAVAILABLE' ? 'primary-selected-button' : ''
                        }`}
                        onClick={() => setAvailabilitiesOptions('UNAVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.UNAVAILABLE')}</p>
                    </IonButton>

                    <IonButton
                        aria-label={t('signup_availabilities_page.AVAILABLE') as string}
                        fill="clear"
                        className={`${styles['occurence-container']} ${
                            occurrence === 'AVAILABLE' ? 'primary-selected-button' : ''
                        }`}
                        onClick={() => setAvailabilitiesOptions('AVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.AVAILABLE')}</p>
                    </IonButton>

                    <IonButton
                        aria-label={t('signup_availabilities_page.VERY_AVAILABLE') as string}
                        fill="clear"
                        className={`${styles['occurence-container']} ${
                            occurrence === 'VERY_AVAILABLE' ? 'primary-selected-button' : ''
                        }`}
                        onClick={() => setAvailabilitiesOptions('VERY_AVAILABLE')}
                    >
                        <p className={styles['occurence-text']}>{t('signup_availabilities_page.VERY_AVAILABLE')}</p>
                    </IonButton>

                    <IonButton
                        aria-label={t('signup_availabilities_page.modal.validate_button') as string}
                        className="primary-button margin-top no-padding"
                        fill="clear"
                        onClick={() => onValidate(occurrence)}
                    >
                        {t('signup_availabilities_page.modal.validate_button')}
                    </IonButton>
                </div>
            </div>
        </Modal>
    );
};

export default AvailabilityModal;
