import EmailContent from '../models/email-content.model';

export const EMAIL_TEMPLATE_REPOSITORY = 'email-template.repository';

export interface EmailTemplateRepository {
  getEmail(
    templateId: string,
    languageCode: string,
    interpolationValues?: { [key: string]: string },
  ): Promise<EmailContent>;
}
