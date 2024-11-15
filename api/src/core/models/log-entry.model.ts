export enum LogEntryType {
  CONNECTION = 'CONNECTION',
  VISIO = 'VISIO',
  TANDEM_CHAT = 'TANDEM_CHAT',
  COMMUNITY_CHAT = 'COMMUNITY_CHAT',
  CUSTOM_ENTRY = 'CUSTOM_ENTRY',
  SHARING_LOGS = 'SHARING_LOGS',
  ADD_VOCABULARY = 'ADD_VOCABULARY',
  SHARE_VOCABULARY = 'SHARE_VOCABULARY',
  EDIT_ACTIVITY = 'EDIT_ACTIVITY',
  SUBMIT_ACTIVITY = 'SUBMIT_ACTIVITY',
  PLAYED_GAME = 'PLAYED_GAME',
}
export type LogEntries =
  | LogEntryAddVocabulary
  | LogEntryCommunityChat
  | LogEntryPlayedGame
  | LogEntryEditActivity
  | LogEntryConnection
  | LogEntryCustomEntry
  | LogEntryShareVocabulary
  | LogEntrySubmitActivity
  | LogEntryVisio
  | LogEntryTandemChat
  | LogEntrySharingLogs;

export type LogEntryProps = {
  id: string;
  createdAt: Date;
  type: LogEntryType;
  [key: string]: unknown;
};

export class LogEntry {
  id: string;
  createdAt: Date;
  type: LogEntryType;

  constructor(data: LogEntryProps) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.type = data.type;
  }
}

export class LogEntryConnection extends LogEntry {
  constructor(data: LogEntryProps) {
    super(data);
  }
}

export type LogEntryVisioProps = LogEntryProps & {
  duration: number;
  tandemFirstname: string;
  tandemLastname: string;
};

export class LogEntryVisio extends LogEntry {
  duration: number;
  tandemFirstname: string;
  tandemLastname: string;

  constructor(data: LogEntryVisioProps) {
    super(data);
    this.duration = data.duration;
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
  content: string;
};

export class LogEntryCustomEntry extends LogEntry {
  content: string;

  constructor(data: LogEntryCustomEntryProps) {
    super(data);
    this.content = data.content;
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
  updatedCount: number;
};

export class LogEntryEditActivity extends LogEntry {
  activityId: string;
  updatedCount: number;

  constructor(data: LogEntryEditActivityProps) {
    super(data);
    this.activityId = data.activityId;
    this.updatedCount = data.updatedCount;
  }
}

export type LogEntrySubmitActivityProps = LogEntryProps & {
  activityId: string;
};

export class LogEntrySubmitActivity extends LogEntry {
  activityId: string;

  constructor(data: LogEntrySubmitActivityProps) {
    super(data);
    this.activityId = data.activityId;
  }
}

export type LogEntryPlayedGameProps = LogEntryProps & {
  percentage?: number;
};

export class LogEntryPlayedGame extends LogEntry {
  percentage?: number;

  constructor(data: LogEntryPlayedGameProps) {
    super(data);
    this.percentage = data.percentage;
  }
}
