import { Activity } from 'src/core/models/activity.model';
import { Vocabulary, VocabularyList } from 'src/core/models/vocabulary.model';
import { StorageInterface } from 'src/core/ports/storage.interface';

export const PDF_SERVICE = 'pdf.service';

export interface PdfServicePort {
  createVocabularyListPdf(
    vocabularyList: VocabularyList,
    vocabularies?: Vocabulary[],
  ): Promise<Buffer>;

  createActivityPdf(
    activity: Activity,
    storage: StorageInterface,
    language: string,
    primaryColor: string,
  ): Promise<Buffer>;
}
