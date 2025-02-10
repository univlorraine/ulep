import React from 'react';
import {
    DeleteButton,
    TopToolbar,
    EditButton,
    useTranslate,
    Show,
    SimpleShowLayout,
    TextField,
    FunctionField,
    useRecordContext,
    usePermissions,
    useGetIdentity,
    Loading,
} from 'react-admin';
import ReferenceUploadField from '../../components/field/ReferenceUploadImageField';
import ConfigPagesHeader from '../../components/tabs/ConfigPagesHeader';
import Administrator, { AdminGroup, Role } from '../../entities/Administrator';

const InterestShowAction = () => {
    const record = useRecordContext();
    const { permissions } = usePermissions();
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    if (
        !permissions.checkRole(Role.SUPER_ADMIN) &&
        (record.universityId !== identity.universityId || record.group.name === AdminGroup.SUPER_ADMIN)
    ) {
        return null;
    }

    return (
        <TopToolbar>
            <EditButton />
            <DeleteButton redirect="/users/administrators" />
        </TopToolbar>
    );
};

const InterestShow = () => {
    const translate = useTranslate();

    return (
        <>
            <ConfigPagesHeader />
            <Show actions={<InterestShowAction />}>
                <SimpleShowLayout sx={{ m: 3 }}>
                    <ReferenceUploadField label={translate('administrators.show.image')} source="image.id" />
                    <TextField label={translate('administrators.show.university')} source="university.name" />
                    <TextField label={translate('administrators.show.lastname')} source="lastname" />
                    <TextField label={translate('administrators.show.firstname')} source="firstname" />
                    <TextField label={translate('administrators.show.email')} source="email" />
                    <FunctionField
                        label={translate('administrators.show.group.label')}
                        render={(record: Administrator) => translate(`administrators.show.group.${record.group.name}`)}
                        source="university.name"
                    />
                    <FunctionField
                        label={translate('administrators.show.language.label')}
                        render={(record: Administrator) => {
                            if (record.language) {
                                return record.language.name;
                            }

                            return translate('administrators.show.language.noLanguage');
                        }}
                    />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

export default InterestShow;
