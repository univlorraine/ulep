interface RefusedTandemProps {
  id: string;
  learningLanguageIds: string[];
  universityId: string;
}

export class RefusedTandem {
  readonly id: string;
  readonly learningLanguageIds: string[];
  readonly universityId: string;

  constructor({ id, learningLanguageIds, universityId }: RefusedTandemProps) {
    this.id = id;
    this.learningLanguageIds = learningLanguageIds;
    this.universityId = universityId;
  }
}
