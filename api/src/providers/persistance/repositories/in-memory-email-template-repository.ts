import EmailContent from 'src/core/models/email-content.model';
import { EmailTemplateRepository } from 'src/core/ports/email-template.repository';

export class InMemoryEmailTemplateRepository
  implements EmailTemplateRepository
{
  getEmail(
    templateId: string,
    languageCode: string,
    interpolationValues?: { [key: string]: string },
  ): Promise<EmailContent> {
    return Promise.resolve(
      new EmailContent({
        subject: `${templateId} ${languageCode} subject`,
        content: `<html>Content of ${templateId} ${languageCode} with values ${
          interpolationValues ? JSON.stringify(interpolationValues) : '-'
        }</html>`,
      }),
    );
  }
}
