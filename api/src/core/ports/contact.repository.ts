export const CONTACT_REPOSITORY = 'contact.repository';

export interface ContactRepository {
  delete(id: string): Promise<void>;
}
