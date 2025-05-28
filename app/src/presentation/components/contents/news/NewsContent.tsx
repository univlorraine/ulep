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

import { IonButton, IonImg } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import News from '../../../../domain/entities/News';
import Profile from '../../../../domain/entities/Profile';
import { useStoreState } from '../../../../store/storeTypes';
import HeaderSubContent from '../../HeaderSubContent';
import LanguageTag from '../../LanguageTag';
import ChangeLanguageModal from '../../modals/ChangeLanguageModal';
import CreditModal from '../../modals/CreditModal';
import UniversityTag from '../../UniversityTag';
import styles from './NewsContent.module.css';

interface NewsContentProps {
    profile: Profile;
    news: News;
    onBackPressed: () => void;
}

export const NewsContent: React.FC<NewsContentProps> = ({ news, profile, onBackPressed }) => {
    const { t } = useTranslation();
    const language = useStoreState((state) => state.language);
    const [currentLanguage, setCurrentLanguage] = useState(news.languageCode);
    const [currentTitle, setCurrentTitle] = useState(news.title);
    const [currentContent, setCurrentContent] = useState(news.content);
    const [showChangeLanguage, setShowChangeLanguage] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const formattedDate = new Intl.DateTimeFormat(language || profile.nativeLanguage.code, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(news.startPublicationDate));

    const changeLanguage = (languageCode: string) => {
        if (languageCode === news.languageCode) {
            setCurrentLanguage(news.languageCode);
            setCurrentTitle(news.title);
            setCurrentContent(news.content);
        } else {
            setCurrentLanguage(languageCode);
            setCurrentTitle(
                news.translations.find((translation) => translation.languageCode === languageCode)?.title ?? ''
            );
            setCurrentContent(
                news.translations.find((translation) => translation.languageCode === languageCode)?.content ?? ''
            );
        }
        setShowChangeLanguage(false);
    };

    return (
        <div ref={contentRef}>
            <HeaderSubContent title={t('news.list.title')} onBackPressed={onBackPressed} />
            <div className={styles.container}>
                {news.imageUrl && <IonImg className={styles.image} src={news.imageUrl}></IonImg>}
                {news.creditImage && (
                    <IonButton fill="clear" className={styles['credit-view']} onClick={() => setShowCreditModal(true)}>
                        <span className={styles.credit}>©</span>
                    </IonButton>
                )}
                <div className={styles['primary-container']} style={{ marginTop: news.imageUrl ? 200 : 0 }}>
                    <h1 className={styles.title} lang={currentLanguage}>
                        {currentTitle}
                    </h1>
                    <span className={styles.date}>{formattedDate}</span>
                    <div className={styles.informations}>
                        <div className={styles['information-item']}>
                            <span className={styles.label}>{t('news.show.language')}</span>
                            <span>
                                <LanguageTag languageCode={currentLanguage} />
                                {news.translations.length > 0 && (
                                    <button
                                        aria-label={t('news.show.change_language') as string}
                                        className={styles['change-language-button']}
                                        onClick={() => setShowChangeLanguage(true)}
                                    >
                                        {t('news.show.change_language')}
                                    </button>
                                )}
                            </span>
                        </div>
                        <div className={styles['information-item']}>
                            <span className={styles.label}>{t('news.show.author')}</span>
                            <UniversityTag university={news.university} />
                        </div>
                    </div>
                    <p
                        lang={currentLanguage}
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: currentContent }}
                    />
                </div>
            </div>
            <ChangeLanguageModal
                isVisible={showChangeLanguage}
                onClose={() => setShowChangeLanguage(false)}
                onLanguageCodeChange={changeLanguage}
                currentLanguageCode={currentLanguage}
                allLanguagesCodes={[
                    news.languageCode,
                    ...news.translations.map((translation) => translation.languageCode),
                ]}
            />
            {news.creditImage && (
                <CreditModal
                    isVisible={showCreditModal}
                    onClose={() => setShowCreditModal(false)}
                    credit={news.creditImage}
                />
            )}
        </div>
    );
};

export default NewsContent;
