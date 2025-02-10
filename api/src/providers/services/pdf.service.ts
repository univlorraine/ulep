import { I18nService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PDFDocument } from 'pdf-lib';
import * as PDFKitDocument from 'pdfkit';
import { Env } from 'src/configuration';
import { MediaObject } from 'src/core/models';
import { Activity } from 'src/core/models/activity.model';
import { Vocabulary, VocabularyList } from 'src/core/models/vocabulary.model';
import { PdfServicePort } from 'src/core/ports/pdf.service';
import { StorageInterface } from 'src/core/ports/storage.interface';

@Injectable()
export class PdfService implements PdfServicePort {
  private readonly logger = new Logger(PdfService.name);

  private language: string;

  constructor(
    private readonly env: ConfigService<Env, true>,
    private readonly i18n: I18nService,
  ) {}

  async createVocabularyListPdf(
    vocabularyList: VocabularyList,
    vocabularies?: Vocabulary[],
  ): Promise<Buffer> {
    this.logger.log('Creating vocabulary list PDF');
    const doc = new PDFKitDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    doc.fontSize(18).text(`${vocabularyList.name}`, {
      align: 'center',
    });
    doc.moveDown();
    vocabularies.forEach((item) => {
      doc.fontSize(12).text(`${item.word} - ${item.translation}`);
    });

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
    });
  }

  async createActivityPdf(
    activity: Activity,
    storage: StorageInterface,
    language: string,
  ): Promise<Buffer> {
    this.logger.log('Creating activity PDF');
    const doc = new PDFKitDocument({
      margin: 30,
    });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    const pageWidth = doc.page.width - doc.x * 2;
    const imageHeight = 150;

    this.setLanguage(language);

    // Fit the image within the dimensions
    doc.image(await this.getImageByMediaObject(activity.image, storage), {
      fit: [pageWidth, imageHeight],
      align: 'center',
      valign: 'center',
    });

    doc
      .roundedRect(doc.x, doc.y + imageHeight, pageWidth, 200, 10)
      .fill('#FDEE66');

    doc.fill('#000');

    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(`${activity.title}`, doc.x + 20, doc.y + imageHeight + 20, {
        align: 'left',
        width: pageWidth - 40,
      });
    doc
      .font('Helvetica')
      .fontSize(12)
      .text(`${activity.description}`, {
        align: 'left',
        width: pageWidth - 40,
      });
    doc.moveDown();

    doc.lineWidth(1);

    doc
      .lineCap('butt')
      .moveTo(doc.x, doc.y)
      .lineTo(pageWidth, doc.y)
      .stroke('#00000020');
    doc.moveDown();

    const topCol = doc.y;

    // Language
    doc.text(
      this.translate('activity.show.language', 'Language'),
      doc.x,
      topCol,
      {
        align: 'left',
      },
    );
    doc
      .font('Helvetica-Bold')
      .text(
        this.translate(
          `languages_code.${activity.language.code}`,
          activity.language.name,
        ),
        {
          align: 'left',
        },
      );

    // Level
    doc
      .font('Helvetica')
      .text(
        this.translate('activity.show.level', 'Level'),
        pageWidth / 2,
        topCol,
        {
          align: 'left',
        },
      );
    doc.font('Helvetica-Bold').text(activity.languageLevel, {
      align: 'left',
    });

    // Theme
    doc
      .font('Helvetica')
      .text(
        this.translate('activity.show.theme', 'Theme'),
        pageWidth - 100,
        topCol,
        {
          align: 'left',
        },
      );
    doc.font('Helvetica-Bold').text(activity.activityTheme.content.content, {
      align: 'left',
    });

    doc.moveDown();
    doc
      .lineCap('butt')
      .moveTo(50, doc.y)
      .lineTo(pageWidth, doc.y)
      .stroke('#00000020');
    doc.moveDown(2);

    doc.font('Helvetica').text(
      this.translate('activity.show.creator', 'Created by', {
        name: `${activity.creator.user.firstname} ${activity.creator.user.lastname}`,
      }),
      50,
      doc.y,
      {
        align: 'left',
      },
    );

    doc.moveDown(3);

    if (activity.ressourceUrl) {
      doc
        .font('Helvetica')
        .fillColor('blue')
        .text(activity.ressourceUrl, doc.x, doc.y, {
          align: 'left',
          link: activity.ressourceUrl,
        });
      doc.moveDown(2);
    }

    activity.activityExercises.forEach((exercise, index) => {
      doc
        .font('Helvetica-Bold')
        .fillColor('#000')
        .text(
          this.translate('activity.show.exercise', 'Exercise', {
            index: index + 1,
          }),
          doc.x,
          doc.y,
          {
            align: 'left',
          },
        );
      doc.font('Helvetica').text(exercise.content, doc.x, doc.y, {
        align: 'left',
      });
      doc.moveDown();
      doc
        .lineCap('butt')
        .moveTo(doc.x, doc.y)
        .lineTo(pageWidth, doc.y)
        .stroke('#00000020');
      doc.moveDown();
    });

    doc.moveDown();

    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .fillColor('#000')
      .text(
        this.translate(
          'activity.show.vocabulary',
          'Vocabularies and expressions',
        ),
        doc.x,
        doc.y,
        {
          align: 'left',
        },
      );

    doc.moveDown();

    activity.activityVocabularies.forEach((vocabulary) => {
      doc
        .font('Helvetica')
        .fontSize(12)
        .text(vocabulary.content, doc.x, doc.y, {
          align: 'left',
        });
      doc.moveDown();
      doc
        .lineCap('butt')
        .moveTo(doc.x, doc.y)
        .lineTo(pageWidth, doc.y)
        .stroke('#00000020');
      doc.moveDown();
    });

    doc.end();

    const pdfData = await this.getPdfByDoc(doc, buffers);

    let resourceFileBuffer: Buffer | undefined;
    if (activity.ressourceFile) {
      resourceFileBuffer = await this.getImageByMediaObject(
        activity.ressourceFile,
        storage,
      );
    }

    if (resourceFileBuffer) {
      return this.mergePdf(pdfData, resourceFileBuffer);
    }

    return pdfData;
  }

  private async mergePdf(
    pdfABuffer: Buffer,
    pdfBBuffer: Buffer,
  ): Promise<Buffer> {
    const mergedPdf = await PDFDocument.create();

    const pdfA = await PDFDocument.load(pdfABuffer);
    const pdfB = await PDFDocument.load(pdfBBuffer);

    const copiedPagesA = await mergedPdf.copyPages(pdfA, pdfA.getPageIndices());
    copiedPagesA.forEach((page) => mergedPdf.addPage(page));

    const copiedPagesB = await mergedPdf.copyPages(pdfB, pdfB.getPageIndices());
    copiedPagesB.forEach((page) => mergedPdf.addPage(page));

    const mergedPdfFile = await mergedPdf.save();

    return Buffer.concat([mergedPdfFile]);
  }

  private async getPdfByDoc(
    doc: PDFKit.PDFDocument,
    buffers: Buffer[],
  ): Promise<Buffer> {
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
    });
  }

  private async getImageByMediaObject(
    mediaObject: MediaObject,
    storage: StorageInterface,
  ): Promise<Buffer> {
    const stream = await storage.read(mediaObject.bucket, mediaObject.name);
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  private setLanguage(language: string) {
    this.language = language;
  }

  private translate(key: string, defaultValue: string, data = {}): string {
    return (
      (this.i18n.translate(key, {
        lng: this.language,
        ns: this.translationNamespace,
        ...data,
      }) as string) ?? defaultValue
    );
  }

  private get translationNamespace() {
    return this.env.get('APP_TRANSLATION_NAMESPACE') || 'translation';
  }
}
