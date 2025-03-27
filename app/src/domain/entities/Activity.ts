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

import Language from './Language';
import { OGUrl } from './OGUrl';
import Profile from './Profile';
import University from './University';

export enum ActivityStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    IN_VALIDATION = 'IN_VALIDATION',
    REJECTED = 'REJECTED',
}

export type ActivityProps = {
    id: string;
    title: string;
    description: string;
    status: ActivityStatus;
    imageUrl: string;
    creator?: Profile;
    university: University;
    languageLevel: CEFR;
    language: Language;
    activityTheme: ActivityTheme;
    vocabularies: ActivityVocabulary[];
    exercises: ActivityExercises[];
    creditImage?: string;
    ressourceUrl?: string;
    ressourceFileUrl?: string;
    ressourceOgUrl?: any;
};

export class Activity {
    public readonly id: string;
    public readonly title: string;
    public readonly description: string;
    public readonly status: ActivityStatus;
    public readonly imageUrl: string;
    public readonly creator?: Profile;
    public readonly university: University;
    public readonly languageLevel: CEFR;
    public readonly language: Language;
    public readonly activityTheme: ActivityTheme;
    public readonly vocabularies: ActivityVocabulary[];
    public readonly exercises: ActivityExercises[];
    public readonly creditImage?: string;
    public readonly ressourceUrl?: string;
    public readonly ressourceFileUrl?: string;
    public readonly ressourceOgUrl?: OGUrl;
    constructor(props: ActivityProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.status = props.status;
        this.imageUrl = props.imageUrl;
        this.creator = props.creator;
        this.languageLevel = props.languageLevel;
        this.language = props.language;
        this.university = props.university;
        this.activityTheme = props.activityTheme;
        this.vocabularies = props.vocabularies;
        this.exercises = props.exercises;
        this.creditImage = props.creditImage;
        this.ressourceUrl = props.ressourceUrl;
        this.ressourceFileUrl = props.ressourceFileUrl;
        this.ressourceOgUrl = props.ressourceOgUrl;
    }
}

export class ActivityTheme {
    constructor(
        public readonly id: string,
        public readonly content: string
    ) {}
}

export class ActivityThemeCategory {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly themes: ActivityTheme[]
    ) {}
}

export class ActivityVocabulary {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly pronunciationUrl: string
    ) {}
}

export class ActivityExercises {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly order: number
    ) {}
}
