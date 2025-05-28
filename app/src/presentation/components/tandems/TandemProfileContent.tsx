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

import React from 'react';
import { useTranslation } from 'react-i18next';
import Language from '../../../domain/entities/Language';
import LearningLanguage from '../../../domain/entities/LearningLanguage';
import Profile from '../../../domain/entities/Profile';
import { Availabilites } from '../../../domain/entities/ProfileSignUp';
import { useStoreState } from '../../../store/storeTypes';
import { codeLanguageToFlag } from '../../utils';
import AvailabilityLine from '../AvailabilityLine';
import TandemCard from './TandemCard';
import styles from './TandemProfileContent.module.css';

interface TandemProfileContentProps {
    learningLanguage: LearningLanguage;
    level: CEFR;
    pedagogy: Pedagogy;
    partnerProfile: Profile;
    partnerLearningLanguage: Language;
    className?: string;
}

const TandemProfileContent: React.FC<TandemProfileContentProps> = ({
    learningLanguage,
    level,
    pedagogy,
    partnerProfile,
    partnerLearningLanguage,
    className,
}) => {
    const { t } = useTranslation();
    const meProfile = useStoreState((state) => state.profile);
    if (!meProfile) {
        return null;
    }

    return (
        <div className={`${styles.content} ${className ? className : ''}`}>
            <h1 className="title extra-large-margin-bottom large-margin-top">
                {t(`home_page.tandem_validated.title`)}
            </h1>
            <TandemCard profile={partnerProfile} language={learningLanguage} />
            <h2 className={styles.category}>{t(`global.email`)}</h2>
            <div className={styles['text-container']}>{partnerProfile.user.email}</div>

            <h2 className={styles.category}>{t(`home_page.tandem_validated.goals`)}</h2>
            <div className={styles['text-container']}>
                <span>{`${t(`home_page.tandem_validated.type.${pedagogy}`)} ( ${level} ) ${codeLanguageToFlag(
                    partnerLearningLanguage.code
                )}`}</span>{' '}
                <br />
                {partnerProfile.goals.map((goal) => (
                    <React.Fragment key={goal.id}>
                        {goal.name}
                        <br />
                    </React.Fragment>
                ))}
            </div>

            <h2 className={styles.category}>{t(`home_page.tandem_validated.languages`)}</h2>
            <div className={styles['text-container']}>
                <>
                    {partnerProfile.nativeLanguage.name} <br />
                    {partnerProfile.masteredLanguages.map((masteredLangauge) => (
                        <div key={masteredLangauge.id}>
                            {masteredLangauge.name}
                            <br />
                        </div>
                    ))}
                </>
            </div>
            <h2 className={styles.category}>{t(`home_page.tandem_validated.interests`)}</h2>
            <div className={styles.interests} role="list">
                {partnerProfile.interests.map((interest) => {
                    return (
                        <div key={interest.id} className={styles.interest} role="listitem">
                            {interest.name}
                        </div>
                    );
                })}
            </div>
            <h2 className={styles.category}>{t(`home_page.tandem_validated.power`)}</h2>
            <blockquote className={styles['text-container']}>{partnerProfile.biography.superpower}</blockquote>
            <h2 className={styles.category}>{t(`home_page.tandem_validated.incredible`)}</h2>
            <blockquote className={styles['text-container']}>{partnerProfile.biography.anecdote}</blockquote>
            <h2 className={styles.category}>{t(`home_page.tandem_validated.place`)}</h2>
            <blockquote className={styles['text-container']}>{partnerProfile.biography.favoritePlace}</blockquote>
            <h2 className={styles.category}>{t(`home_page.tandem_validated.travel`)}</h2>
            <blockquote className={styles['text-container']}>{partnerProfile.biography.experience}</blockquote>
            <h2 className={styles.category}>{t(`home_page.tandem_validated.availabilities`)}</h2>
            <div className={styles['text-container']}>{partnerProfile.user.university.timezone}</div>
            <span className={styles.category}>{t(`global.frequency.title`)}</span>
            <div className={styles['text-container']}>{t(`global.frequency.${partnerProfile.frequency}`)}</div>
            <div className={styles.separator} />
            {Object.keys(partnerProfile.availabilities).map((availabilityKey) => {
                return (
                    <AvailabilityLine
                        key={availabilityKey}
                        availability={partnerProfile.availabilities[availabilityKey as keyof Availabilites]}
                        day={availabilityKey}
                    />
                );
            })}
            {!partnerProfile.availabilitiesNotePrivacy && (
                <>
                    <h2 className={styles.category}>{t(`home_page.tandem_validated.availabilities_note`)}</h2>
                    <div className={styles['text-container']}>{partnerProfile.availabilitiesNote}</div>
                </>
            )}
        </div>
    );
};

export default TandemProfileContent;
