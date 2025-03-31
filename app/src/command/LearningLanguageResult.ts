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

import CustomLearningGoal from '../domain/entities/CustomLearningGoal';
import LearningLanguage from '../domain/entities/LearningLanguage';
import MediaObject from '../domain/entities/MediaObject';
import { customLearningGoalCommandToDomain } from './CustomLearningGoalCommand';
import { mediaObjectCommandToDomain } from './MediaObjectCommand';
import ProfileCommand, { profileCommandToDomain } from './ProfileCommand';

export interface LearningLanguageResult {
    id: string;
    code: string;
    name: string;
    learningType: Pedagogy;
    level: CEFR;
    sameAge?: boolean;
    sameGender?: boolean;
    certificateOption?: boolean;
    specificProgram?: boolean;
    customLearningGoals?: CustomLearningGoal[];
    // Profile can be included but not always
    profile?: ProfileCommand;
    certificateFile?: MediaObject;
    sharedCertificate?: boolean;
    sharedLogsDate?: Date;
    sharedLogsForResearchDate?: Date;
    visioDuration?: number;
    countVocabularies?: number;
    countActivities?: number;
}

export const learningLanguageResultToDomain = (result: LearningLanguageResult) =>
    new LearningLanguage(
        result.id,
        result.code,
        result.name,
        result.level,
        result.learningType,
        result.sameAge,
        result.sameGender,
        result.certificateOption,
        result.specificProgram,
        result.profile ? profileCommandToDomain(result.profile) : undefined,
        result.customLearningGoals ? result.customLearningGoals.map(customLearningGoalCommandToDomain) : undefined,
        result.certificateFile ? mediaObjectCommandToDomain(result.certificateFile) : undefined,
        result.sharedCertificate,
        result.sharedLogsDate,
        result.sharedLogsForResearchDate,
        result.visioDuration,
        result.countVocabularies,
        result.countActivities
    );

export default learningLanguageResultToDomain;
