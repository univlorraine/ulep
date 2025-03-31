import { Inject, Injectable } from '@nestjs/common';
import { PdfServicePort, PDF_SERVICE } from 'src/core/ports/pdf.service';
import {
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';

export class GetVocabularyListPdfCommand {
  vocabularyListId: string;
}

@Injectable()
export class GetVocabularyListPdfUsecase {
  constructor(
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(PDF_SERVICE)
    private readonly pdfService: PdfServicePort,
  ) {}

  async execute(command: GetVocabularyListPdfCommand) {
    const vocabularyLists =
      await this.vocabularyRepository.findVocabularyListById(
        command.vocabularyListId,
      );

    const vocabularies =
      await this.vocabularyRepository.findAllVocabularyfromListId(
        vocabularyLists.id,
      );

    const pdf = await this.pdfService.createVocabularyListPdf(
      vocabularyLists,
      vocabularies,
    );

    return pdf;
  }
}
