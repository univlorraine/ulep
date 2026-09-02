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

import { isRtlLanguage, resolveDefaultLanguage, resolveIsRtl } from '../../../src/presentation/hooks/textDirection';

describe('isRtlLanguage', () => {
    it.each(['ar', 'he', 'fa', 'ur'])('returns true for the RTL language code "%s"', (code) => {
        expect(isRtlLanguage(code)).toBe(true);
    });

    it.each(['fr', 'en', 'zh', 'de', 'es'])('returns false for the LTR language code "%s"', (code) => {
        expect(isRtlLanguage(code)).toBe(false);
    });

    it('handles regional tags and casing', () => {
        expect(isRtlLanguage('ar-SA')).toBe(true);
        expect(isRtlLanguage('AR')).toBe(true);
        expect(isRtlLanguage('fr-FR')).toBe(false);
    });

    it('returns false when the language is unknown', () => {
        expect(isRtlLanguage(undefined)).toBe(false);
        expect(isRtlLanguage('')).toBe(false);
    });
});

describe('resolveIsRtl', () => {
    it('falls back to the device detection when the user has not made a choice', () => {
        expect(resolveIsRtl(undefined, true)).toBe(true);
        expect(resolveIsRtl(undefined, false)).toBe(false);
    });

    it('lets the user choice win over the device detection', () => {
        // user disabled RTL on an RTL device
        expect(resolveIsRtl(false, true)).toBe(false);
        // user forced RTL on an LTR device
        expect(resolveIsRtl(true, false)).toBe(true);
    });
});

describe('resolveDefaultLanguage', () => {
    it('uses the device language on first launch', () => {
        expect(resolveDefaultLanguage('', 'de')).toBe('de');
    });

    it('keeps the language chosen by the user on subsequent launches', () => {
        expect(resolveDefaultLanguage('fr', 'de')).toBe('fr');
    });
});
