export interface CampusProps {
  id: string;
  name: string;
  universityId: string;
}

export class Campus {
  readonly id: string;
  readonly name: string;
  readonly universityId: string;

  constructor({ id, name, universityId }: CampusProps) {
    this.id = id;
    this.name = name;
    this.universityId = universityId;
  }
}
