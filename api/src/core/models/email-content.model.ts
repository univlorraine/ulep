export enum EMAIL_TEMPLATE_IDS {
  TANDEM_BECOME_ACTIVE = 'tandemBecomeActive',
  TANDEM_TO_REVIEW = 'notifyUniversityAdminTandemToReview',
}

interface EmailContentProps {
  subject: string;
  content: string;
  textContent?: string;
}

export default class EmailContent {
  readonly subject: string;
  readonly content: string;
  readonly textContent: string;

  constructor({ subject, content, textContent }: EmailContentProps) {
    this.subject = subject;
    this.content = content;
    this.textContent = textContent ?? content;
  }
}
