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
import Configuration from '../../domain/entities/Confirguration';

interface InstanceCommand {
    name: string;
    email: string;
    cguUrl: string;
    confidentialityUrl: string;
    ressourceUrl: string;
    primaryColor: string;
    primaryBackgroundColor: string;
    primaryDarkColor: string;
    secondaryColor: string;
    secondaryBackgroundColor: string;
    secondaryDarkColor: string;
    hasConnector: boolean;
    isInMaintenance: boolean;
    logoURL: string;
}

const useFetchConfiguration = (apiUrl: string) => {
    const { t } = useTranslation();
    const [showToast] = useIonToast();
    const [configuration, setConfiguration] = useState<Configuration>();
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState<boolean>(false);

    const askInstance = async () => {
        try {
            const response = await fetch(`${apiUrl}/instance/config`);

            if (!response.ok) {
                const message = t('instance.error');
                throw new Error(message);
            }

            const result: InstanceCommand = await response.json();
            setConfiguration(
                new Configuration(
                    result.name,
                    result.name,
                    result.email,
                    result.cguUrl,
                    result.confidentialityUrl,
                    result.ressourceUrl,
                    result.primaryColor,
                    result.primaryDarkColor,
                    result.primaryBackgroundColor,
                    result.secondaryColor,
                    result.secondaryDarkColor,
                    result.secondaryBackgroundColor,
                    result.isInMaintenance,
                    result.logoURL
                )
            );
            document.documentElement.style.setProperty('--primary-color', result.primaryColor);
            document.documentElement.style.setProperty('--primary-dark-color', result.primaryDarkColor);
            document.documentElement.style.setProperty('--primary-background-color', result.primaryBackgroundColor);
            document.documentElement.style.setProperty('--secondary-color', result.secondaryColor);
            document.documentElement.style.setProperty('--secondary-dark-color', result.secondaryDarkColor);
            document.documentElement.style.setProperty('--secondary-background-color', result.secondaryBackgroundColor);
        } catch (error: any) {
            setError(error);
            showToast({ message: error.message, duration: 5000 });
        }
    };

    useEffect(() => {
        setLoading(true);
        askInstance().finally(() => {
            setLoading(false);
        });
    }, [apiUrl]);

    return { configuration, error, loading };
};

export default useFetchConfiguration;
