import React from 'react';
import { DateField, FunctionField, Loading, Show, SimpleShowLayout, TextField, useShowContext } from 'react-admin';
import LearningLanguage from '../../entities/LearningLanguage';

const LearningLanguageShow = () => {
    const { isLoading, isFetching, error, record } = useShowContext<LearningLanguage>();

    if (isLoading || isFetching) {
        return <Loading />;
    }
    if (error) {
        console.error(error);

        return <div>Error</div>;
    }

    return (
        <Show title="toto">
            <SimpleShowLayout>
                COUCOU show {record?.id}
                <FunctionField
                    label="Name"
                    render={(data: LearningLanguage) => (
                        <a href={`/profiles/${data?.profile.id}`}>
                            {data?.profile.user.firstname} {data?.profile.user.lastname}
                        </a>
                    )}
                    // TODO(NOW+1): see with Reference field
                />
                <DateField label="Date demande" source="createdAt" />
                <TextField label="Learning language" source="name" />
                <TextField label="level" source="level" />
                {/* PROPAL INDIV */}
            </SimpleShowLayout>
        </Show>
    );
};

export default LearningLanguageShow;
