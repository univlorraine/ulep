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

import { LearningLanguage } from 'src/core/models/learning-language.model';

export enum LogEntryType {
  VISIO = 'VISIO',
  TANDEM_CHAT = 'TANDEM_CHAT',
  COMMUNITY_CHAT = 'COMMUNITY_CHAT',
  CUSTOM_ENTRY = 'CUSTOM_ENTRY',
  SHARING_LOGS = 'SHARING_LOGS',
  ADD_VOCABULARY = 'ADD_VOCABULARY',
  SHARE_VOCABULARY = 'SHARE_VOCABULARY',
  EDIT_ACTIVITY = 'EDIT_ACTIVITY',
  SUBMIT_ACTIVITY = 'SUBMIT_ACTIVITY',
  PUBLISH_ACTIVITY = 'PUBLISH_ACTIVITY',
  PLAYED_GAME = 'PLAYED_GAME',
}
export type LogEntries =
  | LogEntryAddVocabulary
  | LogEntryCommunityChat
  | LogEntryPlayedGame
  | LogEntryEditActivity
  | LogEntryCustomEntry
  | LogEntryShareVocabulary
  | LogEntrySubmitActivity
  | LogEntryPublishActivity
  | LogEntryVisio
  | LogEntryTandemChat
  | LogEntrySharingLogs;

export type LogEntryProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: LogEntryType;
  learningLanguage: LearningLanguage;
  [key: string]: unknown;
};

export class LogEntry {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  learningLanguage: LearningLanguage;
  type: LogEntryType;

  constructor(data: LogEntryProps) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.type = data.type;
    this.learningLanguage = data.learningLanguage;
  }
}

export type LogEntryVisioProps = LogEntryProps & {
  duration: number;
  partnerTandemId: string;
  tandemFirstname?: string;
  tandemLastname?: string;
  roomName: string;
};

export class LogEntryVisio extends LogEntry {
  duration: number;
  partnerTandemId: string;
  tandemFirstname?: string;
  tandemLastname?: string;
  roomName: string;
  constructor(data: LogEntryVisioProps) {
    super(data);
    this.duration = data.duration;
    this.partnerTandemId = data.partnerTandemId;
    this.roomName = data.roomName;
    this.tandemFirstname = data.tandemFirstname;
    this.tandemLastname = data.tandemLastname;
  }
}

export type LogEntryTandemChatProps = LogEntryProps & {
  conversationId: string;
  tandemFirstname: string;
  tandemLastname: string;
};

export class LogEntryTandemChat extends LogEntry {
  conversationId: string;
  tandemFirstname: string;
  tandemLastname: string;

  constructor(data: LogEntryTandemChatProps) {
    super(data);
    this.conversationId = data.conversationId;
    this.tandemFirstname = data.tandemFirstname;
    this.tandemLastname = data.tandemLastname;
  }
}

//TODO: Update this when community chat will be implemented
export type LogEntryCommunityChatProps = LogEntryProps & {
  conversationId: string;
};

export class LogEntryCommunityChat extends LogEntry {
  conversationId: string;

  constructor(data: LogEntryCommunityChatProps) {
    super(data);
    this.conversationId = data.conversationId;
  }
}

export type LogEntryCustomEntryProps = LogEntryProps & {
  content?: string;
  title: string;
};

export class LogEntryCustomEntry extends LogEntry {
  content?: string;
  title: string;
  constructor(data: LogEntryCustomEntryProps) {
    super(data);
    this.content = data.content;
    this.title = data.title;
  }
}

export type LogEntrySharingLogsProps = LogEntryProps;

export class LogEntrySharingLogs extends LogEntry {
  constructor(data: LogEntrySharingLogsProps) {
    super(data);
  }
}

export type LogEntryAddVocabularyProps = LogEntryProps & {
  vocabularyListName: string;
  vocabularyListId: string;
  entryNumber: number;
};

export class LogEntryAddVocabulary extends LogEntry {
  vocabularyListName: string;
  vocabularyListId: string;
  entryNumber: number;

  constructor(data: LogEntryAddVocabularyProps) {
    super(data);
    this.vocabularyListName = data.vocabularyListName;
    this.vocabularyListId = data.vocabularyListId;
    this.entryNumber = data.entryNumber;
  }
}

export type LogEntryShareVocabularyProps = LogEntryProps & {
  vocabularyListId: string;
  vocabularyListName: string;
};

export class LogEntryShareVocabulary extends LogEntry {
  vocabularyListId: string;
  vocabularyListName: string;

  constructor(data: LogEntryShareVocabularyProps) {
    super(data);
    this.vocabularyListId = data.vocabularyListId;
    this.vocabularyListName = data.vocabularyListName;
  }
}

export type LogEntryEditActivityProps = LogEntryProps & {
  activityId: string;
  activityTitle: string;
  updatedCount: number;
};

export class LogEntryEditActivity extends LogEntry {
  activityId: string;
  activityTitle: string;
  updatedCount: number;

  constructor(data: LogEntryEditActivityProps) {
    super(data);
    this.activityId = data.activityId;
    this.activityTitle = data.activityTitle;
    this.updatedCount = data.updatedCount;
  }
}

export type LogEntrySubmitActivityProps = LogEntryProps & {
  activityId: string;
  activityTitle: string;
};

export class LogEntrySubmitActivity extends LogEntry {
  activityId: string;
  activityTitle: string;

  constructor(data: LogEntrySubmitActivityProps) {
    super(data);
    this.activityId = data.activityId;
    this.activityTitle = data.activityTitle;
  }
}

export type LogEntryPublishActivityProps = LogEntryProps & {
  activityId: string;
  activityTitle: string;
};

export class LogEntryPublishActivity extends LogEntry {
  activityId: string;
  activityTitle: string;

  constructor(data: LogEntryPublishActivityProps) {
    super(data);
    this.activityId = data.activityId;
    this.activityTitle = data.activityTitle;
  }
}

export enum GameName {
  FLIPCARDS = 'Flipcards',
}

export type LogEntryPlayedGameProps = LogEntryProps & {
  percentage?: number;
  gameName: string;
};

export class LogEntryPlayedGame extends LogEntry {
  percentage?: number;
  gameName: string;
  constructor(data: LogEntryPlayedGameProps) {
    super(data);
    this.percentage = data.percentage;
    this.gameName = data.gameName;
  }
}
