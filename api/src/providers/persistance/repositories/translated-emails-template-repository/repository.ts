/* eslint-disable @typescript-eslint/no-var-requires */
import { Logger } from '@nestjs/common';
// TODO(NOW): check typing errors
import * as i18n from 'i18next';
import * as HttpBackend from 'i18next-http-backend';
import * as ChainedBackend from 'i18next-chained-backend';
import * as resourcesToBackend from 'i18next-resources-to-backend';
import { configuration } from 'src/configuration';
import EmailContent, {
  EMAIL_TEMPLATE_IDS,
} from 'src/core/models/email-content.model';
import { EmailTemplateRepository } from 'src/core/ports/email-template.repository';
import getMailFromTemplate from './templates/tandemBecomeActive';

// TODO(NOW): clean config

const config = configuration();

const LANGUAGES = ['en', 'fr', 'cn'];

const fallbackResources = {
  cn: {
    translation: {
      [EMAIL_TEMPLATE_IDS.TANDEM_BECOME_ACTIVE]: {
        subject: "Your tandem's partner is ready to start",
        title: "Your tandem's partner is ready to start",
        content: {
          introduction: 'Dear {{firstname}},',
          paragraphs: [
            "We are happy to inform you that you're tandem's partner has been found and is ready to start learning language with you ! Your partner is {{partnerFirstname}} {{partnerLastname}}, student from {{universityName}} who shares you passion for learning languages and is excited to start this linguistic adventure with you. We recommend that you take time to introduce yourself to your partner and planify your first conversation session. We remind you that Tandem's program is designed to be a fair trade, so don't hesitate to share you knowledge and fully involve inthe program. If you meet problems or challenge, feel free to contact Tandem's team of Université  de Lorraine to get some help. We are here to help you succeed in your learning and are happy to be part of your learning journey.",
            'Best regards,',
          ],
          signature: "Tandem's team of Lorraine university",
        },
        paragraphTest: ['We are happy', 'best regards'],
      },
      [EMAIL_TEMPLATE_IDS.TANDEM_TO_REVIEW]: {
        subject: 'You have suggested or pending tandems',
        title: 'You have suggested or pending tandems',
        content: {
          introduction: 'Hi,',
          paragraphs: [
            'You have tandem suggested by global routine or pending validation. Connect to the back-office to arbitrate these tandems.',
            'Best regards,',
          ],
          signature: "L'équipe Tandem de l'Université de Lorraine",
        },
      },
    },
  },
};

export default class TranslatedEmailTemplateRepository
  implements EmailTemplateRepository
{
  private readonly logger = new Logger(TranslatedEmailTemplateRepository.name);

  #lastTranslationsFetch: { [locale: string]: Date } = {};
  #translations: { [locale: string]: any };

  constructor() {
    const url = `${config.emailTranslations.endpoint}/{{lng}}/${config.emailTranslations.component}.json`;
    const fallbackBackend = (resourcesToBackend as any)(fallbackResources);
    i18n.use(ChainedBackend as any).init<ChainedBackend.ChainedBackendOptions>({
      fallbackLng: LANGUAGES,
      // debug: true, // TODO(NOW): enable debug
      backend: {
        backends: [HttpBackend, fallbackBackend],
        backendOptions: [
          {
            loadPath: url,
            crossDomain: true,
          },
        ],
      },
    });
  }

  async getEmail(
    templateId: EMAIL_TEMPLATE_IDS,
    languageCode: string,
    interpolationValues?: { [key: string]: string },
  ): Promise<EmailContent> {
    const lng = languageCode;
    if (!LANGUAGES.includes(lng)) {
      this.logger.warn(`Non supported language ${lng} for translations`);
    }

    // TODO(NOW): see what can be done with typing
    const emailText: any = i18n.t(templateId, {
      lng,
      returnObjects: true,
      ...interpolationValues,
    });

    return new EmailContent({
      subject: emailText.subject,
      content: getMailFromTemplate({
        title: emailText.title,
        content: {
          introduction: emailText.content.introduction,
          paragraphs: emailText.content.paragraphs,
          signature: emailText.content.signature,
        },
      }),
    });
  }
}
