import { Logger } from '@nestjs/common';
import { configuration } from 'src/configuration';
import EmailContent, {
  EMAIL_TEMPLATE_IDS,
} from 'src/core/models/email-content.model';
import { EmailTemplateRepository } from 'src/core/ports/email-template.repository';
import getMailFromTemplate from './templates/tandemBecomeActive';

const config = configuration();

const DEFAULT_TRANSLATIONS = {
  [EMAIL_TEMPLATE_IDS.TANDEM_BECOME_ACTIVE]: {
    subject: "Your tandem's partner is ready to start",
    title: "Your tandem's partner is ready to start",
    content: {
      introduction: 'Dear {{firstname}},',
      paragraphs: {
        '1': "We are happy to inform you that you're tandem's partner has been found and is ready to start learning language with you ! Your partner is {{partnerFirstname}} {{partnerLastname}}, student from {universityName} who shares you passion for learning languages and is excited to start this linguistic adventure with you. We recommend that you take time to introduce yourself to your partner and planify your first conversation session. We remind you that Tandem's program is designed to be a fair trade, so don't hesitate to share you knowledge and fully involve inthe program. If you meet problems or challenge, feel free to contact Tandem's team of Université  de Lorraine to get some help. We are here to help you succeed in your learning and are happy to be part of your learning journey.",
        '2': 'Best regards,',
      },
      signature: "Tandem's team of Lorraine university",
    },
  },
  [EMAIL_TEMPLATE_IDS.TANDEM_TO_REVIEW]: {
    subject: 'You have suggested or pending tandems',
    title: 'You have suggested or pending tandems',
    content: {
      introduction: 'Hi,',
      paragraphs: {
        // TODO(NOW): best regards
        '1': 'You have tandem suggested by global routine or pending validation. Connect to the back-office to arbitrate these tandems.',
      },
      signature: "L'équipe Tandem de l'Université de Lorraine",
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
    this.#translations = {
      en: DEFAULT_TRANSLATIONS,
    };
    this.fetchTranslations('en');
  }

  private isLastTranslationExpired(languageCode: string): boolean {
    const lastFetchTranslationsOfLanguage =
      this.#lastTranslationsFetch[languageCode];
    if (!lastFetchTranslationsOfLanguage) {
      return true;
    }

    const msSinceLastSuccessfullFetch =
      Date.now() - lastFetchTranslationsOfLanguage.getTime();
    if (
      msSinceLastSuccessfullFetch * 1000 >
      config.emailTranslations.cacheInSec
    ) {
      return true;
    }

    return false;
  }

  private async fetchTranslations(languageCode: string): Promise<void> {
    const url = `${config.emailTranslations.endpoint}/${languageCode}/${config.emailTranslations.component}.json`;
    const res = await fetch(url);

    if (!res.ok) {
      this.logger.error(
        `Fail to fetch email translations ${url} : `,
        res.statusText,
      );
      throw new Error(`Error ${res.status} while fetching emails translations`);
    }

    const content = await res.json();

    this.#lastTranslationsFetch[languageCode] = new Date();
    this.#translations[languageCode] = content;
  }

  async getEmail(
    templateId: EMAIL_TEMPLATE_IDS,
    languageCode: string,
    interpolationValues?: { [key: string]: string },
  ): Promise<EmailContent> {
    // TODO(NOW): sanitize ?
    // TODO(NOW): interpolation
    // TODO(NOW): use i18n + backend ?

    if (this.isLastTranslationExpired(languageCode)) {
      try {
        await this.fetchTranslations(languageCode);
      } catch (err) {
        // Do nothing as error already logged
      }
    }

    const translations =
      this.#translations[languageCode]?.[templateId] ??
      this.#translations.en[templateId];

    const content = getMailFromTemplate({
      title: translations.title,
      content: {
        introduction: translations.content.introduction,
        paragraphs: Object.values(translations.content.paragraphs),
        signature: translations.content.signature,
      },
    });

    return new EmailContent({
      subject: translations.subject,
      content: content,
    });
  }
}
