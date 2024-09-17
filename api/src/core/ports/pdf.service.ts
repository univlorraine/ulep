import { Vocabulary, VocabularyList } from 'src/core/models/vocabulary.model';
export const PDF_SERVICE = 'pdf.service';

export interface PdfServicePort {
  createVocabularyListPdf(
    vocabularyList: VocabularyList,
    vocabularies?: Vocabulary[],
  ): Promise<Buffer>;
}
