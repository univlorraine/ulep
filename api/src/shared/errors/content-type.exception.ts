export class ContentTypeException extends Error {
  name = 'ContentTypeException';

  constructor(type: string) {
    super();
    this.message = `Unallowed content type: ${type}`;
  }
}
