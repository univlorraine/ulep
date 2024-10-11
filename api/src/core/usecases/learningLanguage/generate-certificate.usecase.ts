import { I18nService } from '@app/common';
import { KeycloakClient } from '@app/keycloak';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { formatInTimeZone } from 'date-fns-tz';
import { PDFDocument } from 'pdf-lib';
import { Env } from 'src/configuration';
import { RessourceDoesNotExist } from 'src/core/errors';
import { LearningLanguage, Tandem } from 'src/core/models';
import {
  LearningLanguageRepository,
  LEARNING_LANGUAGE_REPOSITORY,
} from 'src/core/ports/learning-language.repository';
import {
  StorageInterface,
  STORAGE_INTERFACE,
} from 'src/core/ports/storage.interface';
import {
  TandemRepository,
  TANDEM_REPOSITORY,
} from 'src/core/ports/tandem.repository';
import { File as FileType } from '../../ports/storage.interface';

export class GenerateCertificateCommand {
  learningJournal?: boolean;
  consultingInterview?: boolean;
  sharedCertificate?: boolean;
}

type Certificate = {
  language: string;
  file: FileType;
};

type FillCertificatePdfParams = {
  fileBuffer: Buffer;
  language: string;
  learningLanguage: LearningLanguage;
  tandem: Tandem;
  learningJournal: boolean;
  consultingInterview: boolean;
};

@Injectable()
export class GenerateCertificateUsecase {
  constructor(
    private readonly env: ConfigService<Env, true>,
    private readonly i18n: I18nService,
    private readonly keycloakClient: KeycloakClient,
    @Inject(STORAGE_INTERFACE)
    private readonly storage: StorageInterface,
    @Inject(LEARNING_LANGUAGE_REPOSITORY)
    private readonly learningLanguageRepository: LearningLanguageRepository,
    @Inject(TANDEM_REPOSITORY)
    private readonly tandemRepository: TandemRepository,
  ) {}

  async execute(
    id: string,
    command: GenerateCertificateCommand,
  ): Promise<Certificate> {
    const learningLanguage = await this.learningLanguageRepository.ofId(id);
    const tandem = await this.tandemRepository.getTandemForLearningLanguage(id);

    if (!learningLanguage) {
      throw new RessourceDoesNotExist();
    }

    const certificateModel =
      learningLanguage.profile.user.university.defaultCertificateFile;

    if (!certificateModel) {
      throw new RessourceDoesNotExist(
        `Certificate model does not exist for ${learningLanguage.profile.user.university.name}`,
      );
    }

    const readableStream = await this.storage.read(
      certificateModel.bucket,
      certificateModel.name,
    );

    const language: string = this.i18n.translate(
      `languages_code.${learningLanguage.language.code}`,
      {
        lng: learningLanguage.profile.user.university.nativeLanguage.code,
        ns: this.translationNamespace,
      },
    ) as string;

    const pdfBytes = await this.fillCertificatePdf({
      fileBuffer: await this.streamToBuffer(readableStream),
      language,
      learningLanguage,
      tandem,
      learningJournal: command.learningJournal,
      consultingInterview: command.consultingInterview,
    });

    const fileName = `certificate_${language}_${learningLanguage.id}.pdf`;
    const file = {
      fieldname: 'certificate',
      originalname: fileName,
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: pdfBytes,
      size: pdfBytes.length,
    } as FileType;

    return { language, file };
  }

  private async fillCertificatePdf({
    fileBuffer,
    language,
    learningLanguage,
    tandem,
    learningJournal,
    consultingInterview,
  }: FillCertificatePdfParams) {
    const pdfDoc = await PDFDocument.load(fileBuffer);

    const form = pdfDoc.getForm();

    const tandemTypeField = form.getTextField('TandemType');
    tandemTypeField.setText(tandem.learningType);

    const studentNameField = form.getTextField('StudentName');
    studentNameField.setText(
      `${learningLanguage.profile.user.firstname} ${learningLanguage.profile.user.lastname}`,
    );

    const studentEmailField = form.getTextField('LearningLanguageName');
    studentEmailField.setText(language);

    const universityOpenDateField = form.getTextField('UniversityOpenDate');
    universityOpenDateField.setText(
      formatInTimeZone(
        learningLanguage.profile.user.university.openServiceDate,
        learningLanguage.profile.user.university.timezone,
        'dd/MM/yyyy',
      ),
    );

    const universityClosedDateField = form.getTextField('UniversityClosedDate');
    universityClosedDateField.setText(
      formatInTimeZone(
        learningLanguage.profile.user.university.closeServiceDate,
        learningLanguage.profile.user.university.timezone,
        'dd/MM/yyyy',
      ),
    );

    const todayDateField = form.getTextField('TodayDate');
    todayDateField.setText(
      formatInTimeZone(
        new Date(),
        learningLanguage.profile.user.university.timezone,
        'dd/MM/yyyy',
      ),
    );

    if (learningLanguage.profile.user.contactId) {
      const contactNameField = form.getTextField('ContactName');
      const contact = await this.keycloakClient.getUserById(
        learningLanguage.profile.user.contactId,
      );
      contactNameField.setText(`${contact.firstName} ${contact.lastName}`);
    }

    const learningJournalBooleanField = form.getTextField(
      'LearningJournalBoolean',
    );
    learningJournalBooleanField.setText(learningJournal ? 'Oui' : 'Non');

    const consultingInterviewBooleanField = form.getTextField(
      'ConsultingInterviewBoolean',
    );
    consultingInterviewBooleanField.setText(
      consultingInterview ? 'Oui' : 'Non',
    );

    const visioTimeField = form.getTextField('VisioTime');
    visioTimeField.setText('50');

    form.flatten();
    return pdfDoc.save();
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  private get translationNamespace() {
    return this.env.get('APP_TRANSLATION_NAMESPACE') || 'translation';
  }
}
