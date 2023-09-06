import React, { useState } from 'react';
import UniversitiesPicker from '../../components/UniversitiesPicker';

const LearningLanguageList = () => {
    // TODO(NOW+2): manage different case user from university central / university partner

    const [universityIds, setUniversityIds] = useState<string[]>();
    console.log('universityIds', universityIds);

    return (
        <div>
            <UniversitiesPicker onSelected={(ids) => setUniversityIds(ids)} />
        </div>
    );
};

export default LearningLanguageList;
