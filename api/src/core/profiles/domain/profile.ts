import Aggregate from 'src/shared/types/aggregate';

export default class Profile extends Aggregate {
  constructor(private email: string) {
    super();
  }

  getEmail(): string {
    return this.email;
  }
}
