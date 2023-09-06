import React, { useState } from 'react';
import { Datagrid, List, TextField } from 'react-admin';
import UniversitiesPicker from '../../components/UniversitiesPicker';

const LearningLanguageList = () => {
    // TODO(NOW+2): manage different case user from university central / university partner

    const [universityIds, setUniversityIds] = useState<string[]>([]);

    return (
        <>
            <div>
                <UniversitiesPicker onSelected={(ids) => setUniversityIds(ids)} />
            </div>
            <div>
                {universityIds.length ? (
                    <List exporter={false} filter={{ universityIds }} title="TODO.Translate">
                        <Datagrid bulkActionButtons={false}>
                            <TextField label="ID" sortable={false} source="id" />
                            <TextField label="Name" sortable={false} source="name" />
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
