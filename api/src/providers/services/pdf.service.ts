import { Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Vocabulary, VocabularyList } from 'src/core/models/vocabulary.model';
import { PdfServicePort } from 'src/core/ports/pdf.service';

@Injectable()
export class PdfService implements PdfServicePort {
  private readonly logger = new Logger(PdfService.name);

  async createVocabularyListPdf(
    vocabularyList: VocabularyList,
    vocabularies?: Vocabulary[],
  ): Promise<Buffer> {
    this.logger.log('Creating vocabulary list PDF');
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

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
}
