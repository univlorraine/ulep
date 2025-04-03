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

import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigurationContext';
import EventObject from '../../domain/entities/Event';
import News from '../../domain/entities/News';
import Session from '../../domain/entities/Session';
import Tandem from '../../domain/entities/Tandem';
import { useStoreState } from '../../store/storeTypes';
import { LearningType } from '../pages/PairingPedagogyPage';

const useGetHomeData = (refresh?: boolean) => {
    const { getAllTandems, getAllSessions, getAllNews, getAllEvents } = useConfig();
    const profile = useStoreState((state) => state.profile);

    const [homeResult, setHomeResult] = useState<{
        tandems: Tandem[];
        sessions: Session[];
        news: News[];
        events: EventObject[];
        error: Error | undefined;
        isLoading: boolean;
    }>({
        tandems: [],
        sessions: [],
        news: [],
        events: [],
        error: undefined,
        isLoading: false,
    });

    if (!profile) return homeResult;

    useEffect(() => {
        const fetchData = async () => {
            setHomeResult({
                ...homeResult,
                isLoading: true,
            });
            const tandemsResult = await getAllTandems.execute(profile.id);
            const sessionsResult = await getAllSessions.execute(profile.id);
            const newsResult = await getAllNews.execute({
                limit: 3,
                page: 1,
            });
            const eventsResult = await getAllEvents.execute({
                limit: 3,
                page: 1,
            });
            if (tandemsResult instanceof Error) {
                setHomeResult({ ...homeResult, error: tandemsResult, isLoading: false });
            } else if (sessionsResult instanceof Error) {
                setHomeResult({ ...homeResult, error: sessionsResult, isLoading: false });
            } else if (newsResult instanceof Error) {
                setHomeResult({ ...homeResult, error: newsResult, isLoading: false });
            } else if (eventsResult instanceof Error) {
                setHomeResult({ ...homeResult, error: eventsResult, isLoading: false });
            } else {
                const waitingLearningLanguages: Tandem[] = [];
                profile?.learningLanguages.map((learningLanguage) => {
                    if (!tandemsResult.find((tandem) => tandem.learningLanguage.id === learningLanguage.id)) {
                        // TODO(futur) : Change this logic to get it from api ?
                        waitingLearningLanguages.push(
                            new Tandem(
                                learningLanguage.id,
                                'DRAFT',
                                learningLanguage,
                                learningLanguage,
                                'A0',
                                LearningType.TANDEM
                            )
                        );
                    }
                });
                setHomeResult({
                    tandems: [...tandemsResult, ...waitingLearningLanguages],
                    sessions: sessionsResult,
                    news: newsResult,
                    events: eventsResult,
                    error: undefined,
                    isLoading: false,
                });
            }
        };

        fetchData();
    }, [profile, refresh]);

    return homeResult;
};

export default useGetHomeData;
