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

import { IonImg } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import News from '../../../domain/entities/News';
import Profile from '../../../domain/entities/Profile';
import { useStoreState } from '../../../store/storeTypes';
import LanguageTag from '../LanguageTag';
import UniversityTag from '../UniversityTag';
import styles from './NewsLine.module.css';

interface NewsLineProps {
    news: News;
    profile: Profile;
    onClick: () => void;
}

const NewsLine: React.FC<NewsLineProps> = ({ news, profile, onClick }) => {
    const { t } = useTranslation();
    const language = useStoreState((state) => state.language);

    const formattedDate = new Intl.DateTimeFormat(language || profile.nativeLanguage.code, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(news.startPublicationDate));

    return (
        <button aria-label={t('news.open', { title: news.title }) as string} onClick={onClick}>
            <div className={styles.container}>
                {news.imageUrl && <IonImg className={styles.image} src={news.imageUrl} />}
                <div className={styles.content}>
                    <div className={styles.tags}>
                        <LanguageTag languageCode={news.languageCode} />
                        <UniversityTag university={news.university} />
                    </div>
                    <span className={styles.date}>{formattedDate}</span>
                    <br />
                    <span className={styles.title}>{news.title}</span>
                </div>
            </div>
        </button>
    );
};

export default NewsLine;
