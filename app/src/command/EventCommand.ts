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

import EventObject, { EventType } from '../domain/entities/Event';
import { NewsTranslation } from '../domain/entities/News';
import LanguageCommand, { languageCommandToDomain } from './LanguageCommand';
import UniversityCommand, { universityCommandToDomain } from './UniversityCommand';

export interface EventCommand {
    id: string;
    title: string;
    content: string;
    translations: { languageCode: string; title: string; content: string }[];
    authorUniversity: UniversityCommand;
    languageCode: string;
    startDate: Date;
    endDate: Date;
    type: string;
    withSubscription: boolean;
    isUserSubscribed: boolean;
    diffusionLanguages: LanguageCommand[];
    imageURL?: string;
    imageCredit?: string;
    eventURL?: string;
    address?: string;
    addressName?: string;
    deepLink?: string;
}

export const eventCommandToDomain = (command: EventCommand) => {
    return new EventObject(
        command.id,
        command.title,
        command.content,
        command.translations.map(
            (translation) => new NewsTranslation(translation.languageCode, translation.title, translation.content)
        ),
        universityCommandToDomain(command.authorUniversity),
        command.languageCode,
        command.startDate,
        command.endDate,
        command.type as EventType,
        command.withSubscription,
        command.isUserSubscribed,
        command.diffusionLanguages.map(languageCommandToDomain),
        command.imageURL,
        command.imageCredit,
        command.eventURL,
        command.address,
        command.addressName,
        command.deepLink
    );
};
