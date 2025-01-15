import { IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useStoreState } from '../../store/storeTypes';
import useIsUniversityOpen from '../hooks/useIsUniversityOpen';
import useWindowDimensions from '../hooks/useWindowDimensions';
import AuthFlowPage from '../pages/AuthFlowPage';
import CEFRQuizzEndPage from '../pages/cefr-quizz/CEFRQuizzEndPage';
import CEFRQuizzLanguagePage from '../pages/cefr-quizz/CEFRQuizzLanguagePage';
import CEFRQuizzOtherLanguagesPage from '../pages/cefr-quizz/CEFRQuizzOtherLanguagesPage';
import ConnectPage from '../pages/ConnectPage';
import ConversationsPage from '../pages/ConversationsPage';
import EditInformationsPage from '../pages/EditInformationsPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ForgotPasswordSentPage from '../pages/ForgotPasswordSentPage';
import HomePage from '../pages/HomePage';
import JitsiPage from '../pages/Jitsi';
import LearningPage from '../pages/LearningPage';
import LoginPage from '../pages/LoginPage';
import ActivitiesPage from '../pages/mobile/ActivitiesPage';
import ChatPage from '../pages/mobile/ChatPage';
import CreateCustomGoalPage from '../pages/mobile/CreateCustomGoalPage';
import CreateSessionPage from '../pages/mobile/CreateSessionPage';
import EndSessionPage from '../pages/mobile/EndSessionPage';
import EventListPage from '../pages/mobile/EventListPage';
import EventShowPage from '../pages/mobile/EventShowPage';
import FlipcardsPage from '../pages/mobile/FlipcardsPage';
import GoalsListPage from '../pages/mobile/GoalsListPage';
import LearningBookPage from '../pages/mobile/LearningBookPage';
import MediaPage from '../pages/mobile/MediaPage';
import NewsListPage from '../pages/mobile/NewsListPage';
import NewsShowPage from '../pages/mobile/NewsShowPage';
import ReportPage from '../pages/mobile/ReportPage';
import SessionListPage from '../pages/mobile/SessionListPage';
import SettingsPage from '../pages/mobile/SettingsPage';
import ShowCustomGoalPage from '../pages/mobile/ShowCustomGoal';
import ShowSessionPage from '../pages/mobile/ShowSessionPage';
import TandemProfilePage from '../pages/mobile/TandemProfilePage';
import TandemStatusPage from '../pages/mobile/TandemStatusPage';
import UpdateCustomGoalPage from '../pages/mobile/UpdateCustomGoalPage';
import UpdateSessionPage from '../pages/mobile/UpdateSessionPage';
import VocabulariesPage from '../pages/mobile/VocabulariesPage';
import PairingConfirmLanguagePage from '../pages/PairingConfirmLanguagePage';
import PairingFinalPage from '../pages/PairingFinalPage';
import PairingLanguagesPage from '../pages/PairingLanguagesPage';
import PairingLevelPage from '../pages/PairingLevelPage';
import PairingLevelStartPage from '../pages/PairingLevelStartPage';
import PairingOptionsPage from '../pages/PairingOptionsPage';
import PairingOtherLanguageSelectedPage from '../pages/PairingOtherLanguageSelectedPage';
import PairingOtherLanguagesPage from '../pages/PairingOtherLanguagesPage';
import PairingPedagogyPage from '../pages/PairingPedagogyPage';
import PairingPreferencePage from '../pages/PairingPreferencePage';
import PairingQuizzEndPage from '../pages/PairingQuizzEndPage';
import PairingQuizzIntroductionPage from '../pages/PairingQuizzIntroductionPage';
import PairingSelectCEFRPage from '../pages/PairingSelectCEFRPage';
import PairingUnavailableLanguagePage from '../pages/PairingUnavailableLanguagePage';
import ProfilePage from '../pages/ProfilePage';
import QuizzPage from '../pages/QuizzPage';
import ReportsPage from '../pages/ReportsPage';
import ServiceClosePage from '../pages/ServiceClosePage';
import SignUpAvailabilitiesPage from '../pages/SignUpAvailabilitiesPage';
import SignUpBiographyPage from '../pages/SignUpBiographyPage';
import SignupFinalPage from '../pages/SignUpFinalPage';
import SignUpFrequencyPage from '../pages/SignUpFrequencyPage';
import SignUpGoalsPage from '../pages/SignUpGoalsPage';
import SignUpInformationsPage from '../pages/SignUpInformationsPage';
import SignUpInterestsPage from '../pages/SignUpInterestsPage';
import SignUpLanguagesPage from '../pages/SignUpLanguagesPage';
import SignUpPage from '../pages/SignUpPage';
import SuspendedPage from '../pages/SuspendedPage';
import ViewReportPage from '../pages/ViewReportPage';
import WelcomePage from '../pages/WelcomePage';
import { HYBRID_MAX_WIDTH } from '../utils';
import BottomBar from './BottomBar';
import MobileRoute from './MobileRoute';
import PrivateRoute from './PrivateRoute';

const OfflineRouter: React.FC = () => {
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;
    const profile = useStoreState((store) => store.profile);
    const { openDate, closeDate, isUniversityOpen } = useIsUniversityOpen(profile?.user.university.id, [
        profile?.user.university.id,
    ]);

    if (profile && (profile.user.status === 'BANNED' || profile.user.status === 'CANCELED')) {
        return <SuspendedPage status={profile.user.status} />;
    }

    if (!isUniversityOpen && openDate && closeDate) {
        return <ServiceClosePage openDate={openDate} closeDate={closeDate} />;
    }

    return (
        <IonRouterOutlet>
            <Switch>
                <Route exact path="/">
                    <WelcomePage />
                </Route>
                <Route exact path="/connect">
                    <ConnectPage />
                </Route>
                <Route exact path="/forgot-password">
                    <ForgotPasswordPage />
                </Route>
                <Route exact path="/forgot-password/sent">
                    <ForgotPasswordSentPage />
                </Route>
                <Route exact path="/login">
                    <LoginPage />
                </Route>
                <Route exact path="/signup">
                    <SignUpPage />
                </Route>
                <Route exact path="/auth">
                    <AuthFlowPage />
                </Route>
                <MobileRoute exact path={'/tandem-profil'}>
                    <TandemProfilePage />
                </MobileRoute>
                <MobileRoute exact path={'/profil'}>
                    <ProfilePage />
                </MobileRoute>
                <MobileRoute exact path={'/report'}>
                    <ReportPage />
                </MobileRoute>
                <MobileRoute exact path={'/activities'}>
                    <ActivitiesPage />
                </MobileRoute>
                <MobileRoute exact path={'/vocabularies'}>
                    <VocabulariesPage />
                </MobileRoute>
                <MobileRoute exact path={'/settings'}>
                    <SettingsPage />
                </MobileRoute>
                <MobileRoute exact path={'/tandem-status'}>
                    <TandemStatusPage />
                </MobileRoute>
                <MobileRoute exact path={'/chat'}>
                    <ChatPage />
                </MobileRoute>
                <MobileRoute exact path={'/media'}>
                    <MediaPage />
                </MobileRoute>
                <MobileRoute exact path={'/news'}>
                    <NewsListPage />
                </MobileRoute>
                <MobileRoute exact path={'/show-news'}>
                    <NewsShowPage />
                </MobileRoute>
                <MobileRoute exact path={'/events'}>
                    <EventListPage />
                </MobileRoute>
                <MobileRoute exact path={'/show-event'}>
                    <EventShowPage />
                </MobileRoute>
                <MobileRoute exact path={'/sessions'}>
                    <SessionListPage />
                </MobileRoute>
                <MobileRoute exact path={'/create-session'}>
                    <CreateSessionPage />
                </MobileRoute>
                <MobileRoute exact path={'/show-session'}>
                    <ShowSessionPage />
                </MobileRoute>
                <MobileRoute exact path={'/update-session'}>
                    <UpdateSessionPage />
                </MobileRoute>
                <MobileRoute exact path={'/end-session'}>
                    <EndSessionPage />
                </MobileRoute>
                <MobileRoute exact path={'/flipcards'}>
                    <FlipcardsPage />
                </MobileRoute>
                <MobileRoute exact path={'/learning-book'}>
                    <LearningBookPage />
                </MobileRoute>
                <MobileRoute exact path={'/goals'}>
                    <GoalsListPage />
                </MobileRoute>
                <MobileRoute exact path={'/create-custom-goal'}>
                    <CreateCustomGoalPage />
                </MobileRoute>
                <MobileRoute exact path={'/update-custom-goal'}>
                    <UpdateCustomGoalPage />
                </MobileRoute>
                <MobileRoute exact path={'/show-custom-goal'}>
                    <ShowCustomGoalPage />
                </MobileRoute>
                <PrivateRoute exact path="/jitsi">
                    <JitsiPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/languages">
                    <PairingLanguagesPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/options">
                    <PairingOptionsPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/pedagogy">
                    <PairingPedagogyPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/language/confirm">
                    <PairingConfirmLanguagePage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/end">
                    <PairingFinalPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/level">
                    <PairingLevelPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/level/start">
                    <PairingLevelStartPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/other-languages">
                    <PairingOtherLanguagesPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/other-languages/selected">
                    <PairingOtherLanguageSelectedPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/preference">
                    <PairingPreferencePage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/language/quizz/end">
                    <PairingQuizzEndPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/language/quizz/introduction">
                    <PairingQuizzIntroductionPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/language/quizz">
                    <QuizzPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/level/select">
                    <PairingSelectCEFRPage />
                </PrivateRoute>
                <PrivateRoute exact path="/pairing/unavailable-language">
                    <PairingUnavailableLanguagePage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/availabilities">
                    <SignUpAvailabilitiesPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/biography">
                    <SignUpBiographyPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/frequency">
                    <SignUpFrequencyPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/end">
                    <SignupFinalPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/goals">
                    <SignUpGoalsPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/interests">
                    <SignUpInterestsPage />
                </PrivateRoute>
                <PrivateRoute exact path="/signup/languages">
                    <SignUpLanguagesPage />
                </PrivateRoute>
                <Route exact path="/signup/informations">
                    <SignUpInformationsPage />
                </Route>
                <Route exact path="/edit/informations">
                    <EditInformationsPage />
                </Route>
                {/* Quizz route */}
                <PrivateRoute exact path="/cefr/languages">
                    <CEFRQuizzLanguagePage />
                </PrivateRoute>
                <PrivateRoute exact path="/cefr/languages/other">
                    <CEFRQuizzOtherLanguagesPage />
                </PrivateRoute>
                <PrivateRoute exact path="/cefr/quizz">
                    <QuizzPage />
                </PrivateRoute>
                <PrivateRoute exact path="/cefr/quizz/end">
                    <CEFRQuizzEndPage />
                </PrivateRoute>
                {/* Reports route */}
                <PrivateRoute exact path="/reports">
                    <ReportsPage />
                </PrivateRoute>
                <PrivateRoute exact path="/report-item">
                    <ViewReportPage />
                </PrivateRoute>
                {isHybrid ? (
                    <BottomBar />
                ) : (
                    <>
                        <PrivateRoute exact path="/home">
                            <HomePage />
                        </PrivateRoute>
                        <PrivateRoute exact path="/learning">
                            <LearningPage />
                        </PrivateRoute>
                        <PrivateRoute exact path="/conversations">
                            <ConversationsPage />
                        </PrivateRoute>
                        <PrivateRoute exact path="/profile">
                            <ProfilePage />
                        </PrivateRoute>
                    </>
                )}
            </Switch>
        </IonRouterOutlet>
    );
};

export default OfflineRouter;
