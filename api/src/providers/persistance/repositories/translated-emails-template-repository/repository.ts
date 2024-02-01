/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Logger } from '@nestjs/common';
import * as i18n from 'i18next';
import * as HttpBackend from 'i18next-http-backend';
import * as ChainedBackend from 'i18next-chained-backend';
import * as resourcesToBackend from 'i18next-resources-to-backend';
import { Env, getTranslationsEndpoint } from 'src/configuration';
import EmailContent, {
  EMAIL_TEMPLATE_IDS,
} from 'src/core/models/email-content.model';
import { EmailTemplateRepository } from 'src/core/ports/email-template.repository';
import getMailFromTemplate from './mailTemplate';
import { ConfigService } from '@nestjs/config';

const LANGUAGES = ['en', 'fr'];

const fallbackResources = {
  en: {
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
        footer: {
          unsubscribe: 'You can unsubscribe by connecting to your account.',
          downloadApps: 'Download our apps',
        },
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
          signature: "Tandem's team of Lorraine university",
        },
        footer: {
          unsubscribe: 'You can unsubscribe by connecting to your account.',
          downloadApps: 'Download our apps',
        },
      },
      [EMAIL_TEMPLATE_IDS.WELCOME]: {
        subject: 'Welcome on ULEP',
        title: 'Welcome on ULEP',
        content: {
          introduction: 'Dear {{firstname}},',
          paragraphs: [
            "We're delighted to welcome you to the Université de Lorraine Tandem program! You are now registered to learn a new language with a student partner who shares your passion for language learning. In the next few days, you will receive an e-mail notification informing you that you have been matched with your Tandem partner",
            'We recommend that you take the time to introduce yourself to your partner and plan your first conversation session. We encourage you to be open-minded and fully involved in the program to get the most out of it.',
            "If you have any questions or concerns, please don't hesitate to contact us. We're here to help you succeed in your language learning journey and we're delighted to be part of your learning journey.",
            'Best regards,',
          ],
          signature: "Tandem's team of Lorraine University",
        },
        footer: {
          unsubscribe: 'You can unsubscribe by connecting to your account.',
          downloadApps: 'Download our apps',
        },
      },
      [EMAIL_TEMPLATE_IDS.RESET_PASSWORD_SSO]: {
        subject: 'Reset ULEP account',
        title: 'Reset ULEP account',
        content: {
          introduction: 'Dear {{firstname}},',
          paragraphs: [
            'You have requested a password reset. Your account is configured as single sign on, you can use the "Authenticate me" button from the login page',
            '<a href="{{loginUrl}}">Go to login page</a>',
            'Best regards,',
          ],
          signature: "Tandem's team of Lorraine University",
        },
        footer: {
          unsubscribe: 'You can unsubscribe by connecting to your account.',
          downloadApps: 'Download our apps',
        },
      },
    },
  },
};

@Injectable()
export default class TranslatedEmailTemplateRepository
  implements EmailTemplateRepository
{
  private readonly logger = new Logger(TranslatedEmailTemplateRepository.name);

  constructor(private readonly env: ConfigService<Env, true>) {
    const url = getTranslationsEndpoint(
      '{{lng}}',
      env.get<string>('EMAIL_TRANSLATIONS_COMPONENT'),
    );
    const fallbackBackend = (resourcesToBackend as any)(fallbackResources);
    i18n.use(ChainedBackend as any).init<ChainedBackend.ChainedBackendOptions>({
      fallbackLng: LANGUAGES,
      debug: false,
      backend: {
        backends: [HttpBackend, fallbackBackend],
        backendOptions: [
          {
            loadPath: url,
            crossDomain: true,
            customHeaders: {
              'PRIVATE-TOKEN': env.get('TRANSLATIONS_TOKEN'),
            },
          },
        ],
      },
    });
  }

  private getImageUrl(imageName: string): string {
    const endpoint = this.env.get<string>('EMAIL_ASSETS_PUBLIC_ENDPOINT');
    return `${endpoint}/instance/emails/images/${imageName}`;
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

    const emailText: any = i18n.t(templateId, {
      lng,
      returnObjects: true,
      ...interpolationValues,
    });
    if (
      !(
        emailText.subject &&
        emailText.title &&
        emailText.content &&
        emailText.content.introduction &&
        emailText.content.paragraphs &&
        emailText.content.signature &&
        emailText.footer &&
        emailText.footer.unsubscribe &&
        emailText.footer.downloadApps
      )
    ) {
      this.logger.error(`No valid email content for language ${lng}`);
      throw new Error(`Can't build valid email for language ${lng}`);
    }

    return new EmailContent({
      subject: emailText.subject,
      content: getMailFromTemplate({
        title: emailText.title,
        content: emailText.content,
        footer: emailText.footer,
        imageUrls: {
          background: this.getImageUrl('background.png'),
          logo: this.getImageUrl('logo.png'),
          bubble: this.getImageUrl('bonjour-bubble.png'),
          playStore: this.getImageUrl('play-store.png'),
          appleStore: this.getImageUrl('apple-store.png'),
        },
        links: {
          appleStore: this.env.get<string>('APP_LINK_APPLE_STORE'),
          playStore: this.env.get<string>('APP_LINK_PLAY_STORE'),
        },
      }),
    });
  }
}
