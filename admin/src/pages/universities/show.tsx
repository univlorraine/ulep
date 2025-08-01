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

import { Box } from '@mui/material';
import {
    ArrayField,
    ChipField,
    DateField,
    EditButton,
    FunctionField,
    Show,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
    TopToolbar,
    useTranslate,
} from 'react-admin';
import ReferenceUploadFileField from '../../components/field/ReferenceUploadFileField';
import ReferenceUploadField from '../../components/field/ReferenceUploadImageField';
import UniversitiesPagesHeader from '../../components/tabs/UniversitiesPagesHeader';
import Language from '../../entities/Language';
import University from '../../entities/University';
import useLimitedFeatures from '../../utils/useLimitedFeatures';

const UniversityShowAction = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const UniversityShow = (props: any) => {
    const translate = useTranslate();
    const limitedFeatures = useLimitedFeatures();

    return (
        <>
            <UniversitiesPagesHeader />
            <Show actions={<UniversityShowAction />} title={translate('universities.label')} {...props}>
                <Box sx={{ display: 'flex' }}>
                    <SimpleShowLayout sx={{ m: 3, display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <ReferenceUploadField label={translate('universities.show.logo')} source="logo.id" />
                        <TextField label={translate('universities.show.name')} source="name" />
                        <TextField label={translate('universities.show.country')} source="country.name" />
                        <FunctionField
                            label={translate('universities.show.defaultContact')}
                            render={(record: University) =>
                                record.defaultContact
                                    ? `${record.defaultContact.firstname} ${record.defaultContact.lastname}`
                                    : translate('universities.show.noDefaultContact')
                            }
                        />
                        <FunctionField
                            label={translate('universities.show.language')}
                            render={(record: University) => translate(`languages_code.${record.nativeLanguage.code}`)}
                        />
                        <TextField label={translate('universities.show.timezone')} source="timezone" />
                        <TextField
                            label={translate('universities.show.max_tandems_per_user')}
                            source="maxTandemsPerUser"
                        />
                        <ArrayField label={translate('universities.show.sites')} sortable={false} source="sites">
                            <SingleFieldList linkType={false}>
                                <ChipField source="name" />
                            </SingleFieldList>
                        </ArrayField>
                        <TextField label={translate('universities.show.codes')} source="codes">
                            <SingleFieldList>
                                <ChipField source="id" />
                            </SingleFieldList>
                        </TextField>
                        <TextField label={translate('universities.show.domains')} source="domains">
                            <SingleFieldList>
                                <ChipField source="id" />
                            </SingleFieldList>
                        </TextField>
                        <TextField label={translate('universities.show.website')} source="website" />
                        <FunctionField
                            label={translate('universities.show.pairingMode')}
                            render={(data: University) =>
                                translate(`universities.pairing_mode.${data.pairingMode.toLowerCase()}`)
                            }
                        />
                        <TextField label={translate('universities.show.id')} source="id" />
                        <TextField
                            label={translate('universities.show.notificationEmail')}
                            source="notificationEmail"
                        />
                        <ArrayField
                            label={translate('universities.show.specificLanguages')}
                            sortable={false}
                            source="specificLanguagesAvailable"
                        >
                            <SingleFieldList>
                                <FunctionField
                                    render={(record: Language) => (
                                        <ChipField
                                            record={{ name: translate(`languages_code.${record.code}`) }}
                                            source="name"
                                        />
                                    )}
                                />
                            </SingleFieldList>
                        </ArrayField>
                        {!limitedFeatures && (
                            <ReferenceUploadFileField
                                label={translate('universities.show.defaultCertificateFile')}
                                source="defaultCertificateFile.id"
                            />
                        )}
                    </SimpleShowLayout>

                    <SimpleShowLayout sx={{ m: 3, display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <DateField
                            label={translate('universities.show.admission_start')}
                            options={{
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            }}
                            source="admissionStart"
                        />
                        <DateField
                            label={translate('universities.show.admission_end')}
                            options={{
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            }}
                            source="admissionEnd"
                        />
                        <DateField
                            label={translate('universities.show.open_service')}
                            options={{
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            }}
                            source="openServiceDate"
                        />
                        <DateField
                            label={translate('universities.show.close_service')}
                            options={{
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            }}
                            source="closeServiceDate"
                        />
                    </SimpleShowLayout>
                </Box>
            </Show>
        </>
    );
};

export default UniversityShow;
