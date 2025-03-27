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
import { Trans, useTranslation } from 'react-i18next';
import { AvatarPlaceholderPng, Star2Png, VocabularyPng } from '../../../assets';
import styles from './VisioWelcomeContent.module.css';

const VisioWelcomeContent: React.FC<{ setSelectedMenuItem: (item: string) => void }> = ({ setSelectedMenuItem }) => {
    const { t } = useTranslation();

    const sections = [
        {
            id: 'vocabulary',
            icon: VocabularyPng,
            text: (
                <Trans
                    i18nKey="visio.sections.vocabulary"
                    components={{
                        linkOnClick: (
                            <span
                                className={styles.link}
                                onClick={() => {
                                    setSelectedMenuItem('vocabulary');
                                }}
                            />
                        ),
                    }}
                />
            ),
        },
        {
            id: 'activity',
            icon: Star2Png,
            text: (
                <Trans
                    i18nKey="visio.sections.activity"
                    components={{
                        linkOnClick: (
                            <span
                                className={styles.link}
                                onClick={() => {
                                    setSelectedMenuItem('activity');
                                }}
                            />
                        ),
                    }}
                />
            ),
        },
        {
            id: 'profile',
            icon: AvatarPlaceholderPng,
            text: (
                <Trans
                    i18nKey="visio.sections.profile"
                    components={{
                        linkOnClick: (
                            <span
                                className={styles.link}
                                onClick={() => {
                                    setSelectedMenuItem('profile');
                                }}
                            />
                        ),
                    }}
                />
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <h1 className={`${styles.title} title`}>{t('visio.hello')}</h1>
            <h2 className={styles.subtitle}>{t('visio.welcome')}</h2>
            <p className={styles.intro}>{t('visio.sections.intro')}</p>
            <div className={styles.sections}>
                {sections.map((section) => (
                    <div className={styles.section} key={section.id}>
                        <IonImg className={styles.icon} src={section.icon} />
                        <p className={styles.text}>{section.text}</p>
                    </div>
                ))}
            </div>
            <p>{t('visio.stay_polite')}</p>
            <p>{t('visio.contact_animator')}</p>
        </div>
    );
};

export default VisioWelcomeContent;
