import * as Prisma from '@prisma/client';
import {
  TextContentRelations,
  TextContentSnapshot,
  textContentMapper,
} from './translation.mapper';
import {
  ProficiencyLevel,
  ProficiencyQuestion,
  ProficiencyTest,
} from 'src/core/models';

export const ProficiencyTestRelations = {
  Questions: {
    include: {
      TextContent: TextContentRelations,
    },
  },
};

export const ProficiencyQuestionRelations = {
  TextContent: TextContentRelations,
  ProficiencyTest: true,
};

export type ProficiencyTestSnapshot = Prisma.ProficiencyTests & {
  Questions: ProficiencyQuestionSnapshot[];
};

export type ProficiencyQuestionSnapshot = Prisma.ProficiencyQuestions & {
  TextContent: TextContentSnapshot;
  ProficiencyTest?: Prisma.ProficiencyTests;
};

export const proficiencyTestMapper = (
  snapshot: ProficiencyTestSnapshot,
): ProficiencyTest => {
  return {
    id: snapshot.id,
    level: snapshot.level as ProficiencyLevel,
    questions: snapshot.Questions.map(proficiencyQuestionMapper),
  };
};

export const proficiencyQuestionMapper = (
  snapshot: ProficiencyQuestionSnapshot,
): ProficiencyQuestion => {
  return {
    id: snapshot.id,
    text: textContentMapper(snapshot.TextContent),
    answer: snapshot.answer,
    level: snapshot.ProficiencyTest?.level as ProficiencyLevel,
  };
};
