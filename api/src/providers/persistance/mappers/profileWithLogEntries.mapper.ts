import { NotFoundException } from '@nestjs/common';
import * as Prisma from '@prisma/client';
import { LearningLanguageWithLogEntries } from 'src/core/models/learning-language.model';
import { ProfileWithLogEntries } from 'src/core/models/profileWithLogEntries.model';
import {
  learningLanguageMapper,
  LearningLanguageRelations,
  LearningLanguageSnapshot,
} from './learningLanguage.mapper';
import { logEntryMapper } from './log-entry.mapper';
import { userMapper, UserRelations, UserSnapshot } from './user.mapper';

export type ProfileWithLogEntriesSnapshot = Prisma.Profiles & {
  User: UserSnapshot;
  LearningLanguages: (LearningLanguageSnapshot & {
    LogEntriesByDate: Prisma.LogEntry[];
  })[];
};

export const ProfilesRelationsWithLogEntries = {
  User: {
    include: UserRelations,
  },
  LearningLanguages: {
    include: {
      ...LearningLanguageRelations,
      LogEntriesByDate: {
        include: {
          LearningLanguage: {
            include: LearningLanguageRelations,
          },
        },
      },
    },
  },
};
//
export const profileWithLogEntriesMapper = (
  instance: ProfileWithLogEntriesSnapshot,
) => {
  if (!instance) {
    throw new NotFoundException('Profile not found');
  }
  const profile = new ProfileWithLogEntries({
    id: instance.id,
    user: userMapper(instance.User),
    learningLanguages: instance.LearningLanguages.map((learningLanguage) => {
      return {
        ...learningLanguageMapper(learningLanguage),
        logEntries: learningLanguage.LogEntriesByDate.map(logEntryMapper),
      } as LearningLanguageWithLogEntries;
    }),
  });

  return profile;
};
