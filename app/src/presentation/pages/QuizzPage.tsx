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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useConfig } from '../../context/ConfigurationContext';
import Language from '../../domain/entities/Language';
import Question from '../../domain/entities/Question';
import { useStoreActions, useStoreState } from '../../store/storeTypes';
import QuizzContent from '../components/contents/QuizzContent';
import QuizzSelectionContent from '../components/contents/QuizzSelectionContent';
import QuizzValidatedContent from '../components/contents/QuizzValidatedContent';
import SuccessLayout from '../components/layout/SuccessLayout';
import WebLayoutCentered from '../components/layout/WebLayoutCentered';
import Loader from '../components/Loader';
import { getNextLevel, getPreviousLevel } from '../utils';
import styles from './css/SignUp.module.css';

type QuizzPageProps = {
    initialCefr?: CEFR;
    isQuizzTest?: boolean;
    language?: Language;
};

const QuizzPage: React.FC = () => {
    const { configuration, getQuizzByLevel, deviceAdapter } = useConfig();
    const history = useHistory();
    const [showToast] = useIonToast();
    const { t } = useTranslation();
    const location = useLocation<QuizzPageProps>();
    const { initialCefr, isQuizzTest, language } = location.state || {
        initialCefr: undefined,
        isQuizzTest: false,
        language: undefined,
    };
    const updateProfileSignUp = useStoreActions((state) => state.updateProfileSignUp);
    const profileSignUp = useStoreState((state) => state.profileSignUp);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuizz, setCurrentQuizz] = useState<CEFR | undefined>();
    const [displayNextQuizz, setDisplayNextQuizz] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(Boolean(initialCefr));

    if (!profileSignUp.learningLanguage && !language) {
        return <Redirect to={`/pairing/languages`} />;
    }

    const askQuizz = async (level: CEFR | undefined) => {
        if (!level) {
            return;
        }
        setIsLoading(true);

        const result = await getQuizzByLevel.execute(level);

        if (result instanceof Error) {
            return await showToast({ message: t(result.message), duration: 5000 });
        }

        setQuestions(result);
        setDisplayNextQuizz(false);
        setIsLoading(false);
        return setCurrentQuizz(level);
    };

    const onQuizzOver = (percentage: number) => {
        if (!currentQuizz) {
            return;
        }

        if (percentage >= 80 && currentQuizz !== 'C2') {
            return setDisplayNextQuizz(true);
        }

        let level = currentQuizz;

        if (percentage < 10 && currentQuizz === 'A1') {
            level = 'A0';
        } else if (percentage < 80) {
            level = getPreviousLevel(currentQuizz);
        }

        if (isQuizzTest) {
            return history.push(`/cefr/quizz/end`, { initialCefr, language, level });
        }

        updateProfileSignUp({ learningLanguageLevel: level });

        return history.push(`/pairing/language/quizz/end`);
    };

    useEffect(() => {
        if (initialCefr) {
            askQuizz(initialCefr !== 'A0' ? initialCefr : 'A1');
        }
    }, [initialCefr]);

    if (displayNextQuizz && currentQuizz) {
        return (
            <SuccessLayout
                backgroundColorCode={configuration.secondaryDarkColor}
                backgroundIconColor={configuration.secondaryBackgroundImageColor}
                colorCode={configuration.secondaryColor}
            >
                <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                    <QuizzValidatedContent
                        language={profileSignUp.learningLanguage || language!}
                        onNextQuizz={() => askQuizz(getNextLevel(currentQuizz))}
                        quizzLevel={currentQuizz}
                    />
                </div>
            </SuccessLayout>
        );
    }

    return (
        <WebLayoutCentered
            backgroundIconColor={configuration.secondaryBackgroundImageColor}
            headerColor={configuration.secondaryColor}
            headerPercentage={initialCefr ? 100 : 60}
            headerTitle={initialCefr ? t('global.cefr_quizz_title') : t('global.pairing_title')}
        >
            <div className={`${styles.body} ${deviceAdapter.isNativePlatform() ? styles['native-platform'] : ''}`}>
                {isLoading ? (
                    <div className={styles.loader}>
                        <Loader />
                    </div>
                ) : (
                    <>
                        {questions.length === 0 && <QuizzSelectionContent onQuizzSelected={askQuizz} />}
                        {questions.length > 0 && currentQuizz && (
                            <QuizzContent onQuizzOver={onQuizzOver} questions={questions} quizzLevel={currentQuizz} />
                        )}
                    </>
                )}
            </div>
        </WebLayoutCentered>
    );
};

export default QuizzPage;
