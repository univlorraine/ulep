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

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { AdvicePng } from '../../../assets';
import TestedLanguage from '../../../domain/entities/TestedLanguage';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { codeLanguageToFlag, HYBRID_MAX_WIDTH } from '../../utils';
import LearningCard from './LearningCard';
import styles from './ProficiencyTestCard.module.css';

interface ProficiencyTestCardProps {
    testedLanguages: TestedLanguage[];
    currentColor?: string;
}

const ProficiencyTestCard: React.FC<ProficiencyTestCardProps> = ({ testedLanguages, currentColor }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { width } = useWindowDimensions();
    const isHybrid = width < HYBRID_MAX_WIDTH;

    return (
        <LearningCard
            title={t('proficiency_test.title')}
            buttonText={t('proficiency_test.button') as string}
            onButtonPressed={() => history.push('/cefr/languages')}
        >
            <div className={styles.container} style={{ backgroundColor: currentColor }}>
                <div className={styles['container-content']}>
                    <div className={styles['container-image']}>
                        <img alt="" className={styles.image} src={AdvicePng} aria-hidden={true} />
                    </div>
                    {testedLanguages.length > 0 && <TestedLanguageComponent testedLanguages={testedLanguages} />}
                </div>
                {isHybrid && (
                    <div className={styles['card-button']}>
                        <button className={`primary-button`} onClick={() => history.push('/cefr/languages')}>
                            {t('proficiency_test.button')}
                        </button>
                    </div>
                )}
            </div>
        </LearningCard>
    );
};

const TestedLanguageComponent: React.FC<ProficiencyTestCardProps> = ({ testedLanguages }) => {
    const { t } = useTranslation();

    if (Array.isArray(testedLanguages) && testedLanguages.length > 1) {
        return (
            <div>
                <span className={styles.subtitle}>{t('proficiency_test.subtitle')}</span>
                <ul className={styles['tested-languages-list']}>
                    {testedLanguages.map((testedLanguage, index) => (
                        <li
                            className={styles['tested-languages']}
                            role="img"
                            aria-label={`${testedLanguage.level} ${testedLanguage.name}`}
                            key={index}
                        >{`${codeLanguageToFlag(testedLanguage.code)} ( ${testedLanguage.level} )${
                            index !== testedLanguages.length - 1 ? ', ' : ''
                        }`}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className={styles['tested-languages-list']}>
            <span className={styles.subtitle}>{`${testedLanguages[0]?.level}  ( ${t(
                `languages_code.${testedLanguages[0]?.code}`
            )} ${codeLanguageToFlag(testedLanguages[0]?.code)} )`}</span>
        </div>
    );
};

export default ProficiencyTestCard;
