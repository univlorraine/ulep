import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Input, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button, Loading, useGetIdentity, useTranslate } from 'react-admin';
import { AdministratorFormPayload, KeycloakGroup } from '../../entities/Administrator';
import University from '../../entities/University';
import inputStyle from '../../theme/inputStyle';
import isPasswordValid from '../../utils/isPasswordValid';
import AdminGroupsPicker from '../AdminGroupsPicker';
import UniversityPicker from '../UniversityPicker';

interface AdministratorFormProps {
    id?: string;
    email?: string;
    firstname?: string;
    handleSubmit: (payload: AdministratorFormPayload) => void;
    lastname?: string;
    universityId?: string;
    groups?: KeycloakGroup[];
    type: string;
}

const AdministratorForm: React.FC<AdministratorFormProps> = ({
    id,
    email,
    firstname,
    handleSubmit,
    lastname,
    universityId,
    groups,
    type,
}) => {
    const translate = useTranslate();
    const [newEmail, setNewEmail] = useState<string>(email || '');
    const [password, setPassword] = useState<string>('');
    const [newFirstname, setNewFirstname] = useState<string>(firstname || '');
    const [newLastname, setNewLastname] = useState<string>(lastname || '');
    const [university, setUniversity] = useState<University>();
    const [newGroups, setNewGroups] = useState<KeycloakGroup[]>(groups || []);
    const { data: identity, isLoading: isLoadingIdentity } = useGetIdentity();

    // React-admin fetches the data after rendering the component, and does not re-render after it
    // Other fields are filled from the cache, so they don't need an update
    useEffect(() => {
        if (groups) {
            setNewGroups(groups);
        }
    }, [groups]);

    const addGroup = (newGroup: KeycloakGroup) => setNewGroups([...newGroups, newGroup]);
    const removeGroup = (groupToRemove: KeycloakGroup) => {
        setNewGroups(newGroups.filter((group) => group !== groupToRemove));
    };

    if (isLoadingIdentity || !identity) {
        return <Loading />;
    }

    const getUniversityId = (): string | undefined => {
        if (!identity.isCentralUniversity) {
            return identity.universityId;
        }

        return university?.parent ? university?.id : undefined;
    };

    const onCreatePressed = () => {
        let updatedGroups: KeycloakGroup[] = groups ?? [];
        if (newGroups.length !== 0) {
            updatedGroups = newGroups;
        }

        handleSubmit({
            id,
            email: newEmail,
            firstname: newFirstname,
            lastname: newLastname,
            password,
            universityId: getUniversityId(),
            groups: updatedGroups,
        });
    };

    return (
        <Box sx={{ m: 4 }}>
            <Typography variant="subtitle1">{translate(`administrators.${type}.email`)}</Typography>

            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Email"
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={translate('global.email')}
                    sx={inputStyle}
                    type="email"
                    value={newEmail}
                    disableUnderline
                    required
                />
            </Box>

            {identity?.isCentralUniversity && (
                <>
                    <Typography variant="subtitle1">{translate(`administrators.${type}.university`)}</Typography>
                    <UniversityPicker initialValue={universityId} onChange={setUniversity} value={university} />
                </>
            )}

            <Typography variant="subtitle1">{translate(`administrators.${type}.group`)}</Typography>
            <>
                <Table>
                    <TableBody>
                        {newGroups.map((group) => (
                            <TableRow key={group.name}>
                                <TableCell sx={{ width: 10 }}>
                                    <Button onClick={() => removeGroup(group)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                                <TableCell>{group.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box alignItems="center" display="flex" flexDirection="row">
                    <AdminGroupsPicker onChange={addGroup} value={newGroups} />
                </Box>
            </>

            <Typography variant="subtitle1">{translate('global.firstname')}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Firstname"
                    onChange={(e) => setNewFirstname(e.target.value)}
                    placeholder={translate('global.firstname')}
                    sx={inputStyle}
                    value={newFirstname}
                    disableUnderline
                    required
                />
            </Box>

            <Typography variant="subtitle1">{translate(`global.lastname`)}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Lastname"
                    onChange={(e) => setNewLastname(e.target.value)}
                    placeholder={translate('global.lastname')}
                    sx={inputStyle}
                    value={newLastname}
                    disableUnderline
                    required
                />
            </Box>

            <Typography variant="subtitle1">{translate(`administrators.${type}.password`)}</Typography>
            <Box alignItems="center" display="flex" flexDirection="row">
                <Input
                    name="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={translate('global.password')}
                    sx={inputStyle}
                    value={password}
                    disableUnderline
                    required
                />
            </Box>

            <Button
                color="primary"
                disabled={
                    (!university && identity.isCentralUniversity) ||
                    (email && !password ? false : !password || !isPasswordValid(password)) ||
                    !newFirstname ||
                    !newLastname ||
                    !newEmail
                }
                onClick={onCreatePressed}
                sx={{ mt: 4, width: '100%' }}
                type="button"
                variant="contained"
            >
                <span>{translate('global.save')}</span>
            </Button>
        </Box>
    );
};

export default AdministratorForm;
