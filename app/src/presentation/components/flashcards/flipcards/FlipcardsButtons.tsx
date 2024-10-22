import { IonButton, IonIcon, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import styles from './FlipcardsButtons.module.css';
import Vocabulary from '../../../../domain/entities/Vocabulary';
import { searchOutline } from 'ionicons/icons';


interface FlipcardsButtonsProps {
    setShowAnswer: (boolean: boolean) => void;
    setCurrentVocabulary: (vocabulary: Vocabulary) => void;
    vocabularies: Vocabulary[];
    setVocabulariesCount: (count: number) => void;
    vocabulariesCount: number;
    setIsQuizFinished: (boolean: boolean) => void;
    setNumberRightAnswers: (count: number) => void;
    numberRightAnswers: number;
    showAnswer: boolean;
}

const FlipcardsButtons: React.FC<FlipcardsButtonsProps> = ({
    setShowAnswer,
    setCurrentVocabulary,
    vocabularies,
    setVocabulariesCount,
    vocabulariesCount,
    setIsQuizFinished,
    setNumberRightAnswers,
    numberRightAnswers,
    showAnswer
}) => {    
    const { t } = useTranslation();

    const onRightOrWrongAnswerPressed = (isRight:boolean) => {
        setShowAnswer(false)
        setCurrentVocabulary(vocabularies[vocabulariesCount])
        setVocabulariesCount(vocabulariesCount + 1)

        isRight && setNumberRightAnswers(numberRightAnswers + 1)

        if(vocabulariesCount === vocabularies.length) {
            setIsQuizFinished(true)
        }
    }

    const buttonsIsRight = [
        {
            id: 1,
            text: 'flashcards.flipcards.buttons.rightAnswer',
            isRight: true
        },
        {
            id: 2,
            text: 'flashcards.flipcards.buttons.wrongAnswer',
            isRight: false
        },
    ]

    return (
        <>
            {!showAnswer && (
                <div className={styles.buttonsContainer}>
                    <IonButton 
                        fill="clear" 
                        className={"tertiary-button"} 
                        onClick={() => setShowAnswer(true)}
                        size="small"
                    >
                        <IonIcon
                            className={styles.icon}
                            icon={searchOutline}
                            slot="start"
                        />
                        <IonText>{t('flashcards.flipcards.buttons.showResponse')}</IonText>
                    </IonButton>
                </div>
            )}
            
            {showAnswer && (
                <div className={styles.buttonsContainer}>
                    <p className={styles.description}>{t('flashcards.flipcards.rightAnswerQuestion')}</p>
                    <div className={styles.buttons}>
                        {buttonsIsRight.map( button => {
                            return(
                                <IonButton 
                                    fill="clear"
                                    size="small"
                                    className={"tertiary-button"} 
                                    onClick={() => onRightOrWrongAnswerPressed(button.isRight)}
                                    key={button.id}
                                >
                                    <IonIcon
                                        className={styles.icon}
                                        icon={searchOutline}
                                        slot="start"
                                    />
                                    <IonText>{t(button.text)}</IonText>
                                </IonButton>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

export default FlipcardsButtons;
