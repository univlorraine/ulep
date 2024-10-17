import { IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import News from '../../../domain/entities/News';
import University from '../../../domain/entities/University';
import { codeLanguageToFlag } from '../../utils';

interface NewsLanguageTagProps {
    languageCode: string;
}

const NewsLanguageTag: React.FC<NewsLanguageTagProps> = ({ languageCode }) => {
    const { t } = useTranslation();
    return (
        <div>
            <span>{`${t(`language_codes.news.${languageCode}`)} ${codeLanguageToFlag(languageCode)}`}</span>
        </div>
    );
};

interface NewsUniversityTagProps {
    university: University;
}

const NewsUniversityTag: React.FC<NewsUniversityTagProps> = ({ university }) => {
    return (
        <div>
            <span>{university.name}</span>
        </div>
    );
};

interface NewsLineProps {
    news: News;
}

const NewsLine: React.FC<NewsLineProps> = ({ news }) => {
    return (
        <div>
            <IonImg src={news.imageUrl} />
            <div>
                <div>
                    <NewsLanguageTag languageCode={news.languageCode} />
                    <NewsUniversityTag university={news.university} />
                </div>
                <span>{news.startPublicationDate.toLocaleDateString()}</span>
                <span>{news.title}</span>
            </div>
        </div>
    );
};

export default NewsLine;
