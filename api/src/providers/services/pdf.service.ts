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

    doc.fontSize(18).text(`${vocabularyList.symbol} ${vocabularyList.name}`, {
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

    if (activity.creditImage) {
      doc.fontSize(8).fillColor('#666666').text(`© ${activity.creditImage}`, {
        align: 'right',
        width: pageWidth,
      });
    }

    // Marquer la position de début du rectangle jaune
    const startY = doc.y + imageHeight;

    // Calculer la hauteur du contenu sans l'écrire
    doc.fontSize(20).font('Helvetica-Bold');
    const titleHeight = doc.heightOfString(activity.title.replace(/Ɖ/g, ''), {
      width: pageWidth - 40,
    });

    doc.fontSize(12).font('Helvetica');
    const descriptionHeight = doc.heightOfString(
      activity.description.replace(/Ɖ/g, ''),
      {
        width: pageWidth - 40,
      },
    );

    const padding = 15;
    const endY = startY + titleHeight + descriptionHeight + padding * 3;

    // Dessiner d'abord le rectangle jaune
    doc
      .save()
      .roundedRect(doc.x, startY, pageWidth, endY - startY, 10)
      .fill('#FDEE66')
      .restore();

    // Maintenant écrire le texte par-dessus
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#000')
      .text(activity.title.replace(/Ɖ/g, ''), doc.x + 20, startY + padding, {
        align: 'left',
        width: pageWidth - 40,
      });

    doc
      .fontSize(12)
      .font('Helvetica')
      .text(
        activity.description.replace(/Ɖ/g, ''),
        doc.x + 20,
        doc.y + padding,
        {
          align: 'left',
          width: pageWidth - 40,
        },
      );

    // Repositionner le curseur après le rectangle
    doc.y = endY + padding;
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

    const creator = activity.creator
      ? `${activity.creator.user.firstname} ${activity.creator.user.lastname}`
      : activity.university.name;

    doc.font('Helvetica').text(
      this.translate('activity.show.creator', 'Created by', {
        name: creator,
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
