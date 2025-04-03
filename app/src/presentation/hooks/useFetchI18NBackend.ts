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

import { Device } from '@capacitor/device';
import { i18n } from 'i18next';
import { useEffect, useState } from 'react';
import initI18n from '../../i18n';
import { useStoreActions, useStoreState } from '../../store/storeTypes';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

const useFetchI18NBackend = (apiUrl: string): i18n => {
    const isRtl = useStoreState((state) => state.isRtl);
    const language = useStoreState((state) => state.language);
    const setLanguage = useStoreActions((state) => state.setLanguage);
    const setRtl = useStoreActions((state) => state.setRtl);
    const [i18nInstance, setI18nInstance] = useState<i18n>(initI18n());
    useEffect(() => {
        const setDefaultLanguage = async () => {
            const deviceLanguage = await Device.getLanguageCode();

            setLanguage({ language: deviceLanguage.value });
            // if isRtl is true, user forced it on settings, else its undefined
            setRtl({ isRtl: isRtl === true || RTL_LANGUAGES.includes(deviceLanguage.value) });
        };
        setDefaultLanguage();
    }, []);

    useEffect(() => {
        const checkApiHealthAndSetLanguage = async () => {
            try {
                const response = await fetch(`${apiUrl}/health`);
                if (response.ok) {
                    setI18nInstance(initI18n(apiUrl, language));
                } else {
                    throw new Error('API health check failed');
                }
            } catch (error) {
                console.error('API is not reachable, using local translations', error);
                setI18nInstance(initI18n(undefined, language));
            }

            document.documentElement.lang = language;
            document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        };

        checkApiHealthAndSetLanguage();
    }, [apiUrl, language, isRtl]);

    return i18nInstance;
};

export default useFetchI18NBackend;
