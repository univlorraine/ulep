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

import React from 'react';
import { ReactComponent as Background } from '../../assets/background.svg';
import { useConfig } from '../../context/ConfigurationContext';

interface WatermarkProps {
    className?: string;
    style?: React.CSSProperties;
}

// Renders the instance watermark uploaded from the back office when one is
// configured, and falls back to the default ULEP background shape (tinted
// through `style.color`) otherwise.
const Watermark: React.FC<WatermarkProps> = ({ className, style }) => {
    const { configuration } = useConfig();

    if (configuration.watermarkURL) {
        // An <img> loads the SVG as an isolated external document, so CSS
        // `color` can't reach its `fill: currentColor`. Instead the file is
        // used as a CSS mask tinted with the inherited color. The callers'
        // classes only position the watermark and rely on the image's
        // intrinsic size, so a hidden <img> keeps that size and the mask
        // layer is stacked on top of it in the same grid cell.
        const maskStyle: React.CSSProperties = {
            gridArea: '1 / 1',
            backgroundColor: 'currentColor',
            maskImage: `url("${configuration.watermarkURL}")`,
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskImage: `url("${configuration.watermarkURL}")`,
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            WebkitMaskSize: 'contain',
        };

        return (
            <span className={className} style={{ display: 'grid', ...style }} aria-hidden={true}>
                <img
                    alt=""
                    src={configuration.watermarkURL}
                    style={{ gridArea: '1 / 1', visibility: 'hidden' }}
                />
                <span style={maskStyle} />
            </span>
        );
    }

    return <Background className={className} style={style} aria-hidden={true} />;
};

export default Watermark;
