import React from 'react';
import { Datagrid, DateField, FunctionField, List, TextField } from 'react-admin';
import UniversitiesPicker from '../../components/UniversitiesPicker';
import LearningLanguage from '../../entities/LearningLanguage';
import useLearningLanguagesStore from './useLearningLanguagesStore';

const LearningLanguageList = () => {
    // TODO(NOW): translations
    // TODO(NOW+2): manage different case user from university central / university partner
    const { selectedUniversityIds, setSelectedUniversityIds } = useLearningLanguagesStore();

    return (
        <>
            <div>
                <UniversitiesPicker onSelected={(ids) => setSelectedUniversityIds(ids)} value={selectedUniversityIds} />
            </div>
            <div>
                {selectedUniversityIds.length ? (
                    <List<LearningLanguage>
                        exporter={false}
                        filter={{ universityIds: selectedUniversityIds }}
                        title="TODO.Translate"
                    >
                        <Datagrid bulkActionButtons={false} rowClick="show">
                            <FunctionField
                                label="Name"
                                render={(record: LearningLanguage) => (
                                    <a href={`/profiles/${record.profile.id}`}>
                                        {record.profile.user.firstname} {record.profile.user.lastname}
                                    </a>
                                )}
                            />
                            <TextField label="learned language" sortable={false} source="name" />
                            <TextField label="level" sortable={false} source="level" />
                            <DateField label="Créé le" sortable={false} source="createdAt" />
                        </Datagrid>
                    </List>
                ) : (
                    <div>
                        <span>Merci de sélectionner une ou plusieurs universités pour voir les demandes</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default LearningLanguageList;
