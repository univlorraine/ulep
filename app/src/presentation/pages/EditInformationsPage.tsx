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

import { IonRadio, IonRadioGroup, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { PlusPng } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import { useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import NetworkImage from '../components/NetworkImage';
import TextInput from '../components/TextInput';
import { isEmailCorrect, isImageFormatValid, isNameCorrect } from '../utils';
import styles from './css/SignUp.module.css';

const EditInformationsPage: React.FC = () => {
    const { t } = useTranslation();
    const { editUser, cameraAdapter, configuration } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const profile = useStoreState((state) => state.profile);

    const [email, setEmail] = useState<string>(profile?.user ? profile!.user.email : '');
    const [firstname, setFirstname] = useState<string>(profile?.user ? profile!.user.firstname : '');
    const [lastname, setLastname] = useState<string>(profile?.user ? profile!.user.lastname : '');
    const [gender, setGender] = useState<Gender | undefined>(profile?.user ? profile!.user!.gender : undefined);
    const [age, setAge] = useState<number | undefined>(profile?.user ? profile!.user!.age : undefined);
    const [profilePicture, setProfilePicture] = useState<File | undefined>();

    const [errorMessage, setErrorMessage] = useState<{ type: string; message: string }>();

    const allFieldHasValue = () => {
        return (profile?.user.university.isCentral || email) && gender && age && firstname && lastname;
    };

    const openGallery = async () => {
        const image = await cameraAdapter.getPictureFromGallery();

        if (image && !isImageFormatValid(image)) {
            return showToast({
                message: t('errors.imageFormat'),
                duration: 3000,
            });
        }

        setProfilePicture(image);
    };

    const nextStep = async () => {
        if (!profile?.user.university.isCentral && (!email || !isEmailCorrect(email))) {
            return setErrorMessage({ type: 'email', message: t('signup_informations_page.error_email') });
        }

        if (!firstname || !isNameCorrect(firstname)) {
            return setErrorMessage({ type: 'firstname', message: t('signup_informations_page.error_firstname') });
        }

        if (!lastname || !isNameCorrect(lastname)) {
            return setErrorMessage({ type: 'lastname', message: t('signup_informations_page.error_lastname') });
        }

        if (!gender) {
            return await showToast(t('signup_informations_page.error_gender'), 1000);
        }

        if (!age || age < 17 || age > 80) {
            return setErrorMessage({ type: 'age', message: t('signup_informations_page.error_age') });
        }

        const result = await editUser.execute(
            profile!.user.id,
            age,
            email,
            firstname,
            gender,
            lastname,
            profilePicture
        );

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 3000 });
        }

        return history.push('/signup/languages');
    };

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={24}
            headerTitle={t('global.edit_account_title')}
        >
            <div className={styles.body}>
                <h1 className={styles.title}>{t('signup_informations_page.title')}</h1>

                <button className="secondary-button" onClick={() => openGallery()}>
                    {!profilePicture && profile?.user.avatar && (
                        <NetworkImage id={profile.user.id} className={styles.image} aria-hidden={true} />
                    )}
                    {(profilePicture || !profile?.user) && (
                        <img
                            alt=""
                            className={styles.image}
                            src={profilePicture ? URL.createObjectURL(profilePicture) : PlusPng}
                        />
                    )}
                    <p>
                        {t(
                            profilePicture || profile?.user.avatar
                                ? 'signup_informations_page.photo_selected'
                                : 'signup_informations_page.photo'
                        )}
                    </p>
                </button>

                <TextInput
                    id="input-firstname"
                    autocomplete="name"
                    errorMessage={errorMessage?.type === 'firstname' ? errorMessage.message : undefined}
                    onChange={setFirstname}
                    placeholder={t('signup_informations_page.placeholder_firstname')}
                    title={t('global.firstname') as string}
                    type="text"
                    value={firstname}
                />

                <TextInput
                    id="input-lastname"
                    autocomplete="family-name"
                    errorMessage={errorMessage?.type === 'lastname' ? errorMessage.message : undefined}
                    onChange={setLastname}
                    placeholder={t('signup_informations_page.placeholder_name')}
                    title={t('global.lastname') as string}
                    type="text"
                    value={lastname}
                />

                <div className="margin-bottom">
                    <h2 className={`${styles.subtitle} no-margin-top`}>{t('global.gender')}</h2>

                    <IonRadioGroup value={gender} onIonChange={(ev) => setGender(ev.detail.value)}>
                        <IonRadio labelPlacement="end" value="FEMALE">
                            {t('global.woman')}
                        </IonRadio>
                        <br />
                        <IonRadio labelPlacement="end" value="MALE">
                            {t('global.men')}
                        </IonRadio>
                        <br />
                        <IonRadio labelPlacement="end" value="OTHER">
                            {t('global.binary')}
                        </IonRadio>
                    </IonRadioGroup>
                </div>

                <TextInput
                    id="input-age"
                    errorMessage={errorMessage?.type === 'age' ? errorMessage.message : undefined}
                    onChange={(age: string) => setAge(Number(age))}
                    placeholder={t('signup_informations_page.placeholder_age')}
                    title={t('global.age') as string}
                    type="text"
                    value={age ? `${age}` : ''}
                />

                {!profile?.user.university.isCentral && (
                    <TextInput
                        id="input-email"
                        autocomplete="email"
                        errorMessage={errorMessage?.type === 'email' ? errorMessage.message : undefined}
                        onChange={setEmail}
                        placeholder={t('signup_informations_page.placeholder_email')}
                        title={t('global.email') as string}
                        type="email"
                        value={email}
                    />
                )}

                <div className={styles['bottom-container']}>
                    <button
                        className={`primary-button small-margin-top large-margin-bottom ${
                            !allFieldHasValue() ? 'disabled' : ''
                        }`}
                        disabled={!allFieldHasValue()}
                        onClick={nextStep}
                    >
                        {t('signup_informations_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default EditInformationsPage;
