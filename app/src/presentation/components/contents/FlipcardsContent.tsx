import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import { BackgroundPurplePng } from '../../../assets';
import Profile from '../../../domain/entities/Profile';
import FlipcardsFinished from '../../components/flashcards/flipcards/FlipcardsFinished';
import FlipcardsQuiz from '../../components/flashcards/flipcards/FlipcardsQuiz';
import useGetVocabularyFromListsId from '../../hooks/useGetVocabularyFromListsId';
import { BACKGROUND_HYBRID_STYLE_INLINE } from '../../utils';
import HeaderSubContent from '../HeaderSubContent';
import styles from './FlipcardsContent.module.css';

type FlipcardsContentProps = {
    profile: Profile;
    selectedListsId: string[];
    onBackPressed: () => void;
};

const FlipcardsContent = ({ profile, selectedListsId, onBackPressed }: FlipcardsContentProps) => {
    const { t } = useTranslation();
    const [refresh, setRefresh] = useState<boolean>(false);
    const { vocabularies, error, isLoading } = useGetVocabularyFromListsId(selectedListsId, refresh);
    const [numberRightAnswers, setNumberRightAnswers] = useState<number>(0);
    const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
    const [showToast] = useIonToast();

    const onRestartedQuiz = () => {
        setIsQuizFinished(false);
        setNumberRightAnswers(0);
    };

    if (!profile) {
        return <Redirect to={'/'} />;
    }

    if (error) {
        showToast({ message: t(error.message), duration: 5000 });
    }

    const backgroundStyle = {
        backgroundImage: isQuizFinished ? `url('${BackgroundPurplePng}')` : 'none',
        backgroundColor: '#AC9DC9',
        ...BACKGROUND_HYBRID_STYLE_INLINE,
    };

    return (
        <div className={`subcontent-container content-wrapper`} style={{ padding: 0 }}>
            <HeaderSubContent title={t('vocabulary.list.flashcard.title')} onBackPressed={onBackPressed} />
            <div className={styles.container} style={backgroundStyle}>
                {!isQuizFinished && (
                    <FlipcardsQuiz
                        isLoading={isLoading}
                        vocabularies={vocabularies}
                        setNumberRightAnswers={setNumberRightAnswers}
                        numberRightAnswers={numberRightAnswers}
                        setIsQuizFinished={setIsQuizFinished}
                    />
                )}

                {isQuizFinished && (
                    <FlipcardsFinished
                        totalVocabulariesCount={vocabularies.length}
                        note={numberRightAnswers}
                        onRestartedQuiz={() => onRestartedQuiz()}
                        onBackToVocabularyList={onBackPressed}
                    />
                )}
            </div>
        </div>
    );
};

export default FlipcardsContent;
