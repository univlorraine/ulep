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

import i18next, { i18n } from 'i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';

const DEFAULT_LANGUAGE = 'fr';
const DEFAULT_LOAD_PATH = '/locales/{{lng}}/translation.json';

export const initI18n = (apiUrl?: string, language?: string): i18n => {
    const i18n = i18next.createInstance();
    i18n.use(HttpBackend) // charge les traductions à partir des fichiers distants
        .init<HttpBackendOptions>({
            lng: language || DEFAULT_LANGUAGE,
            fallbackLng: 'en', // si la langue choisie ne peut pas être chargée, utiliser l'anglais
            debug: import.meta.env.VITE_ENV === 'dev',
            backend: {
                loadPath: apiUrl ? `${apiUrl}/instance/locales/{{lng}}/translation` : DEFAULT_LOAD_PATH,
            },
            interpolation: {
                escapeValue: false, // not needed for React as it escapes by default
            },
        });
    return i18n;
};

export default initI18n;
