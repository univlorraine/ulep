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

import moment from 'moment-timezone';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import { Availabilites, AvailabilitesOptions } from '../../domain/entities/ProfileSignUp';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import AvailabilityLine from '../components/AvailabilityLine';
import Dropdown, { DropDownItem } from '../components/DropDown';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import AvailabilityModal from '../components/modals/AvailabilityModal';
import AvailabilityNoteModal from '../components/modals/AvailabilityNoteModal';
import styles from './css/SignUp.module.css';
import availabilitiesStyles from './css/SignUpAvailabilities.module.css';

const initialAvailabilities: Availabilites = {
    monday: AvailabilitesOptions.VERY_AVAILABLE,
    tuesday: AvailabilitesOptions.VERY_AVAILABLE,
    wednesday: AvailabilitesOptions.VERY_AVAILABLE,
    thursday: AvailabilitesOptions.VERY_AVAILABLE,
    friday: AvailabilitesOptions.VERY_AVAILABLE,
    saturday: AvailabilitesOptions.VERY_AVAILABLE,
    sunday: AvailabilitesOptions.VERY_AVAILABLE,
};

const SignUpAvailabilitiesPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, deviceAdapter } = useConfig();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const user = useStoreState((state) => state.user);
    const profileEdit = useStoreState((store) => store.profileSignUp);
    const university = user?.university || profileSignUp.university;
    const [timezone, setTimezone] = useState<string | undefined>(university?.timezone);
    const [availabilities, setAvailabilities] = useState<Availabilites>(
        profileEdit.availabilities && Object.keys(profileEdit.availabilities).length > 0
            ? profileEdit.availabilities
            : initialAvailabilities
    );
    const [openAvailabilityModal, setOpenAvailabilityModal] = useState<{
        id: string;
        occurence: AvailabilitiesOptions;
    } | null>();
    const [openFinalModal, setOpenFinalModal] = useState<boolean>(false);

    const continueSignUp = async (note?: string, isPrivate?: boolean) => {
        updateProfileSignUp({ availabilities, availabilityNote: note, availabilityNotePrivate: isPrivate, timezone });
        setOpenFinalModal(false);

        history.push('/signup/frequency');
    };

    const updateAvailabilities = (occurence: AvailabilitiesOptions) => {
        if (!openAvailabilityModal) {
            return;
        }
        const currentAvailabilities = { ...availabilities };
        const key = openAvailabilityModal.id as keyof Availabilites;
        currentAvailabilities[key] = occurence;
        setAvailabilities(currentAvailabilities);
        return setOpenAvailabilityModal(undefined);
    };

    if (!university) {
        return <Redirect to={'/signup'} />;
    }

    return (
        <>
            <WebLayoutCentered
                backgroundIconColor={configuration.primaryBackgroundImageColor}
                headerColor={configuration.primaryColor}
                headerPercentage={84}
                headerTitle={t('global.create_account_title')}
            >
                <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                    <div>
                        <h1 className="title">{t('signup_availabilities_page.title')}</h1>
                        <span className="subtitle">{t('signup_availabilities_page.subtitle')}</span>

                        <div className={availabilitiesStyles.separator} />

                        <Dropdown<string>
                            onChange={setTimezone}
                            options={moment.tz.names().map(
                                (timezone: string): DropDownItem<string> => ({
                                    label: timezone,
                                    value: timezone,
                                })
                            )}
                            placeholder={university.timezone}
                            title={t('signup_availabilities_page.timezone')}
                        />

                        <div className={availabilitiesStyles.separator} />

                        {Object.keys(availabilities).map((availabilityKey) => {
                            return (
                                <AvailabilityLine
                                    key={availabilityKey}
                                    availability={availabilities[availabilityKey as keyof Availabilites]}
                                    day={availabilityKey}
                                    onPress={(item) => setOpenAvailabilityModal(item)}
                                />
                            );
                        })}
                    </div>
                    <div className={`large-margin-top extra-large-margin-bottom`}>
                        <button
                            aria-label={t('signup_availabilities_page.validate_button') as string}
                            className="primary-button"
                            onClick={() => setOpenFinalModal(true)}
                        >
                            {t('signup_availabilities_page.validate_button')}
                        </button>
                    </div>
                </div>
            </WebLayoutCentered>
            <AvailabilityModal
                currentAvailabilitiesOptions={openAvailabilityModal?.occurence}
                onClose={() => setOpenAvailabilityModal(undefined)}
                onValidate={updateAvailabilities}
                isVisible={!!openAvailabilityModal}
                title={openAvailabilityModal ? t(`days.${openAvailabilityModal?.id}`) : ''}
            />
            <AvailabilityNoteModal
                isVisible={openFinalModal}
                onClose={() => setOpenFinalModal(false)}
                onValidate={continueSignUp}
                defaultIsPrivate={profileEdit?.availabilityNotePrivate}
                defaultNote={profileEdit?.availabilityNote}
            />
        </>
    );
};

export default SignUpAvailabilitiesPage;
