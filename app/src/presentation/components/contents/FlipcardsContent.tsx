import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import { BACKGROUND_HYBRID_STYLE_INLINE } from '../../utils';
import useGetVocabularyFromListsId from '../../hooks/useGetVocabularyFromListsId';
import { BackgroundPurplePng, CloseBlackSvg } from '../../../assets';
import FlipcardsFinished from '../../components/flashcards/flipcards/FlipcardsFinished';
import FlipcardsQuiz from '../../components/flashcards/flipcards/FlipcardsQuiz';
import Profile from '../../../domain/entities/Profile';
import styles from './FlipcardsContent.module.css';
import { t } from 'i18next';

type FlipcardsContentProps = {
    profile: Profile;
    selectedListsId: string[];
};

const FlipcardsContent = ({ profile, selectedListsId }: FlipcardsContentProps) => {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const { vocabularies, error, isLoading } = useGetVocabularyFromListsId(selectedListsId, refresh);
    const [numberRightAnswers, setNumberRightAnswers] = useState<number>(0);
    const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
    const [showToast] = useIonToast();

    const onRestartedQuiz = () => {
        setIsQuizFinished(false)
        setNumberRightAnswers(0)
    }
    
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
        <div style={backgroundStyle} className={styles.container}>
            <IonButton 
                size="small"
                fill="clear" 
                className={`tertiary-button ${styles.closeButton}`} 
                onClick={() => history.goBack()}
            >
                <IonIcon
                    icon={CloseBlackSvg}
                    slot="icon-only"
                />
            </IonButton>
            
            {!isQuizFinished &&
                <FlipcardsQuiz
                    isLoading={isLoading}
                    vocabularies={vocabularies}
                    setNumberRightAnswers={setNumberRightAnswers}
                    numberRightAnswers={numberRightAnswers}
                    setIsQuizFinished={setIsQuizFinished}
                />
            }

            {isQuizFinished &&
                <FlipcardsFinished
                    totalVocabulariesCount={vocabularies.length}
                    note={numberRightAnswers}
                    onRestartedQuiz={() => onRestartedQuiz()}
                />
            }
        </div>
    );
};

export default FlipcardsContent;
