import { useTranslation } from 'react-i18next';
import { TrophiePng } from '../../../../assets';
import styles from './FlipcardsFinished.module.css';
import { IonButton, IonImg, IonText } from '@ionic/react';
import { useHistory } from 'react-router';


interface FlipcardsFinishedProps {
    isNewLanguage?: boolean;
    totalVocabulariesCount: number;
    note: number;
    onRestartedQuiz: () => void;
}

const FlipcardsFinished: React.FC<FlipcardsFinishedProps> = ({
    totalVocabulariesCount,
    note,
    onRestartedQuiz
}) => {
    const { t } = useTranslation();
    const history = useHistory();

    const percentageScore = Math.round(note / totalVocabulariesCount * 100)

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <IonImg className={styles.image} src={TrophiePng} aria-hidden={true} />
                <div className={styles.titleContainer}>
                    <p className="subtitle">{t('flashcards.flipcards.finish.title')}</p>
                    <h1 className="title">{`${percentageScore}% (${note}/${totalVocabulariesCount})`}</h1>
                </div>
                <div className={styles.descriptionContainer}>
                    <p className={styles.description}>{t('flashcards.flipcards.finish.paragraph1')}</p>
                    <br />
                    <p className={styles.description}>{note === 100 ? t('flashcards.flipcards.finish.perfect_score') : t('flashcards.flipcards.finish.paragraph2')}</p>
                </div>
            </div>
            <div className={styles.buttonsContainer}>
                <IonButton 
                    fill="clear" 
                    className={"primary-button"} 
                    onClick={onRestartedQuiz}
                    size="small"
                >
                    <IonText>{t('flashcards.flipcards.buttons.restart')}</IonText>
                </IonButton>
                <IonButton 
                    fill="clear" 
                    className={"secondary-button"} 
                    onClick={() => history.goBack()}
                    size="small"
                >
                    <IonText>{t('flashcards.flipcards.buttons.close')}</IonText>
                </IonButton>
            </div>
        </div>
    );
};

export default FlipcardsFinished;
