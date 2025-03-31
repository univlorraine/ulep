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

import { useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import { BackgroundPurplePng } from '../../../assets';
import { useConfig } from '../../../context/ConfigurationContext';
import { GameName, LogEntryType } from '../../../domain/entities/LogEntry';
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
    learningLanguageId: string;
};

const FlipcardsContent = ({ profile, selectedListsId, onBackPressed, learningLanguageId }: FlipcardsContentProps) => {
    const { t } = useTranslation();
    const { createLogEntry } = useConfig();
    const [refresh, setRefresh] = useState<boolean>(false);
    const { vocabularies, error, isLoading } = useGetVocabularyFromListsId(selectedListsId, refresh);
    const [numberRightAnswers, setNumberRightAnswers] = useState<number>(0);
    const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
    const [showToast] = useIonToast();

    const onQuizzFinished = async (isRight: boolean) => {
        setIsQuizFinished(true);
        let localNumberRightAnswers = numberRightAnswers;
        if (isRight) {
            localNumberRightAnswers += 1; // If the answer is right, increment the number of right answers
        }
        const percentage = Math.round((localNumberRightAnswers / vocabularies.length) * 100);
        await createLogEntry.execute({
            type: LogEntryType.PLAYED_GAME,
            learningLanguageId,
            metadata: {
                percentage,
                gameName: GameName.FLIPCARDS,
            },
        });
    };

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
        <div className={styles.container}>
            <HeaderSubContent title={t('vocabulary.list.flashcard.title')} onBackPressed={onBackPressed} />
            <div className={styles.content} style={backgroundStyle}>
                {!isQuizFinished && (
                    <FlipcardsQuiz
                        isLoading={isLoading}
                        vocabularies={vocabularies}
                        setNumberRightAnswers={setNumberRightAnswers}
                        numberRightAnswers={numberRightAnswers}
                        setIsQuizFinished={onQuizzFinished}
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
