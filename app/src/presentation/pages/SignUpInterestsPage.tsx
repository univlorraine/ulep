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
import { useHistory } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import CategoryInterests, { Interest } from '../../domain/entities/CategoryInterests';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import styles from './css/SignUp.module.css';
import interestStyle from './css/SignUpInterests.module.css';

const SignUpInterestsPage: React.FC = () => {
    const { t } = useTranslation();
    const { configuration, getAllInterestCategories, deviceAdapter } = useConfig();
    const [showToast] = useIonToast();
    const history = useHistory();
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileEdit = useStoreState((store) => store.profileSignUp);
    const [catergoriesInterests, setCatergoriesInterests] = useState<CategoryInterests[]>([]);
    const [userInterests, setUserInterests] = useState<string[]>(profileEdit.interests ? profileEdit.interests : []);

    const getInterests = async () => {
        const result = await getAllInterestCategories.execute();

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 1000 });
        }

        return setCatergoriesInterests(result);
    };

    const interestPressed = (item: Interest) => {
        const currentInterests = [...userInterests];
        const index = currentInterests.findIndex((interest) => interest === item.id);

        if (index !== -1) {
            currentInterests.splice(index, 1);
        } else if (currentInterests.length < 10) {
            currentInterests.push(item.id);
        }

        return setUserInterests(currentInterests);
    };

    const cleanUserInterests = () => {
        const validInterestIds = new Set(
            catergoriesInterests.flatMap((category) => category.interests.map((interest) => interest.id))
        );

        return userInterests.filter((interestId) => validInterestIds.has(interestId));
    };

    const continueSignUp = async () => {
        const cleanedUserInterests = cleanUserInterests();
        updateProfileSignUp({ interests: cleanedUserInterests });

        history.push('/signup/biography');
    };

    useEffect(() => {
        getInterests();
    }, []);

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.primaryBackgroundImageColor}
            headerColor={configuration.primaryColor}
            headerPercentage={60}
            headerTitle={t('global.create_account_title')}
        >
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                <div>
                    <h1 className="title">{t('signup_interests_page.title')}</h1>
                    <h2 className="subtitle">{t('signup_interests_page.subtitle')}</h2>

                    {catergoriesInterests.map((categoryInterest) => {
                        return (
                            <div key={categoryInterest.id}>
                                <span className={interestStyle['category-title']}>{categoryInterest.name}</span>
                                <ul className={interestStyle['interests-container']}>
                                    {categoryInterest.interests.map((interest) => {
                                        const isInclued = userInterests.includes(interest.id);
                                        return (
                                            <li key={interest.id}>
                                                <button
                                                    aria-label={interest.name}
                                                    className={interestStyle.tags}
                                                    onClick={() => interestPressed(interest)}
                                                    role="checkbox"
                                                    aria-checked={isInclued}
                                                    disabled={userInterests.length === 10 ? !isInclued : false}
                                                    style={{
                                                        backgroundColor: isInclued
                                                            ? configuration.primaryColor
                                                            : 'white',
                                                        borderWidth: 1,
                                                        borderColor: isInclued ? configuration.primaryColor : 'black',
                                                    }}
                                                >
                                                    <span
                                                        className={interestStyle['tags-text']}
                                                        style={{ fontWeight: isInclued ? 'bold' : 'normal' }}
                                                    >
                                                        {interest.name}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>
                <p style={{ textAlign: 'center' }}>{t('signup_interests_page.required_mention')}</p>

                <div className="extra-large-margin-bottom">
                    <button
                        aria-label={t('signup_interests_page.validate_button') as string}
                        className={`primary-button ${userInterests.length < 5 ? 'disabled' : ''}`}
                        disabled={userInterests.length < 5}
                        onClick={continueSignUp}
                    >
                        {t('signup_interests_page.validate_button')}
                    </button>
                </div>
            </div>
        </WebLayoutCentered>
    );
};

export default SignUpInterestsPage;
