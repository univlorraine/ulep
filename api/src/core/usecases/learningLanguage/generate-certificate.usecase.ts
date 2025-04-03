/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
      throw new RessourceDoesNotExist('Learning language not found');
    }

    if (!tandem) {
      throw new RessourceDoesNotExist('Tandem not found');
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

    if (form.getFieldMaybe('TandemType')) {
      const tandemTypeField = form.getTextField('TandemType');
      tandemTypeField.setText(tandem.learningType);
    }

    if (form.getFieldMaybe('StudentName')) {
      const studentNameField = form.getTextField('StudentName');
      studentNameField.setText(
        `${learningLanguage.profile.user.firstname} ${learningLanguage.profile.user.lastname}`,
      );
    }

    if (form.getFieldMaybe('LearningLanguageName')) {
      const studentEmailField = form.getTextField('LearningLanguageName');
      studentEmailField.setText(language);
    }

    if (form.getFieldMaybe('UniversityOpenDate')) {
      const universityOpenDateField = form.getTextField('UniversityOpenDate');
      universityOpenDateField.setText(
        formatInTimeZone(
          learningLanguage.profile.user.university.openServiceDate,
          learningLanguage.profile.user.university.timezone,
          'dd/MM/yyyy',
        ),
      );
    }

    if (form.getFieldMaybe('UniversityClosedDate')) {
      const universityClosedDateField = form.getTextField(
        'UniversityClosedDate',
      );
      universityClosedDateField.setText(
        formatInTimeZone(
          learningLanguage.profile.user.university.closeServiceDate,
          learningLanguage.profile.user.university.timezone,
          'dd/MM/yyyy',
        ),
      );
    }

    if (form.getFieldMaybe('TodayDate')) {
      const todayDateField = form.getTextField('TodayDate');
      todayDateField.setText(
        formatInTimeZone(
          new Date(),
          learningLanguage.profile.user.university.timezone,
          'dd/MM/yyyy',
        ),
      );
    }
    if (form.getFieldMaybe('ContactName')) {
      if (learningLanguage.profile.user.contactId) {
        const contactNameField = form.getTextField('ContactName');
        const contact = await this.keycloakClient.getUserById(
          learningLanguage.profile.user.contactId,
        );
        contactNameField.setText(`${contact.firstName} ${contact.lastName}`);
      }
    }

    if (form.getFieldMaybe('GoalName1')) {
      const goalName1Field = form.getTextField('GoalName1');
      goalName1Field.setText(
        learningLanguage.customLearningGoals[0]
          ? learningLanguage.customLearningGoals[0].title
          : '',
      );
    }

    if (form.getFieldMaybe('GoalName2')) {
      const goalName2Field = form.getTextField('GoalName2');
      goalName2Field.setText(
        learningLanguage.customLearningGoals[1]
          ? learningLanguage.customLearningGoals[1].title
          : '',
      );
    }

    if (form.getFieldMaybe('GoalName3')) {
      const goalName3Field = form.getTextField('GoalName3');
      goalName3Field.setText(
        learningLanguage.customLearningGoals[2]
          ? learningLanguage.customLearningGoals[2].title
          : '',
      );
    }

    if (form.getFieldMaybe('GoalComment1')) {
      const goalComment1Field = form.getTextField('GoalComment1');
      goalComment1Field.setText(
        learningLanguage.customLearningGoals[0]
          ? learningLanguage.customLearningGoals[0].description
          : '',
      );
    }

    if (form.getFieldMaybe('GoalComment2')) {
      const goalComment2Field = form.getTextField('GoalComment2');
      goalComment2Field.setText(
        learningLanguage.customLearningGoals[1]
          ? learningLanguage.customLearningGoals[1].description
          : '',
      );
    }

    if (form.getFieldMaybe('GoalComment3')) {
      const goalComment3Field = form.getTextField('GoalComment3');
      goalComment3Field.setText(
        learningLanguage.customLearningGoals[2]
          ? learningLanguage.customLearningGoals[2].description
          : '',
      );
    }

    const checkboxYesValue: string = this.i18n.translate(
      'certificate.boolean_yes_value',
      {
        lng: learningLanguage.profile.user.university.nativeLanguage.code,
        ns: this.translationNamespace,
      },
    ) as string;

    const checkboxNoValue: string = this.i18n.translate(
      'certificate.boolean_no_value',
      {
        lng: learningLanguage.profile.user.university.nativeLanguage.code,
        ns: this.translationNamespace,
      },
    ) as string;

    if (form.getFieldMaybe('LearningJournalBoolean')) {
      const learningJournalBooleanField = form.getTextField(
        'LearningJournalBoolean',
      );
      learningJournalBooleanField.setText(
        learningJournal ? checkboxYesValue : checkboxNoValue,
      );
    }

    if (form.getFieldMaybe('ConsultingInterviewBoolean')) {
      const consultingInterviewBooleanField = form.getTextField(
        'ConsultingInterviewBoolean',
      );
      consultingInterviewBooleanField.setText(
        consultingInterview ? checkboxYesValue : checkboxNoValue,
      );
    }

    if (form.getFieldMaybe('VisioTime')) {
      const visioTimeField = form.getTextField('VisioTime');
      visioTimeField.setText(
        Math.round(learningLanguage.visioDuration / 60).toString(),
      );
    }

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
