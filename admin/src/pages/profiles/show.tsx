import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TextField, Show, TabbedShowLayout, Tab, useDataProvider, useRecordContext, useGetRecordId } from 'react-admin';

interface Match {
    profile: {
      id: string;
      firstname: string;
      lastname: string;
      age: number;
      gender: string;
      role: string;
      learningLanguage: {
        code: string;
        level: string;
      };
      goals: string[];
    };
    score: {
        level: number;
        age: number;
        status: number;
        goals: number;
        interests: number;
        gender: number;
        university: number;
        total: number;
    };
  }

interface MatchTableProps {
    matchs: Match[];
}

const MatchTable: React.FC<MatchTableProps> = ({ matchs }) => (
    <Table size="small">
        <TableHead>
            <TableRow>
                <TableCell>Score</TableCell>
                <TableCell>Firstname</TableCell>
                <TableCell>Lastname</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Goal</TableCell>
                <TableCell>level</TableCell>
                <TableCell>age</TableCell>
                <TableCell>status</TableCell>
                <TableCell>goals</TableCell>
                <TableCell>interests</TableCell>
                <TableCell>gender</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {matchs.map((match: Match) => (
                <TableRow key={match.profile.id}>
                    <TableCell>{match.score.total.toFixed(3)}</TableCell>
                    <TableCell>{match.profile.firstname}</TableCell>
                    <TableCell>{match.profile.lastname}</TableCell>
                    <TableCell>{match.profile.age}</TableCell>
                    <TableCell>{match.profile.gender}</TableCell>
                    <TableCell>{match.profile.role}</TableCell>
                    <TableCell>{match.profile.learningLanguage.level}</TableCell>
                    <TableCell>{match.profile.goals}</TableCell>
                    <TableCell>{match.score.level.toFixed(3)}</TableCell>
                    <TableCell>{match.score.age.toFixed(3)}</TableCell>
                    <TableCell>{match.score.status.toFixed(3)}</TableCell>
                    <TableCell>{match.score.goals.toFixed(3)}</TableCell>
                    <TableCell>{match.score.interests.toFixed(3)}</TableCell>
                    <TableCell>{match.score.gender.toFixed(3)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

const Title = () => {
    const record = useRecordContext();

    if (!record) { return null; }

    return <span>{record.firstname} {record.lastname}</span>;
};

const ProfileShow = (props: any) => {
    const id = useGetRecordId();
    const dataProvider = useDataProvider();
    const [matchs, setMatchs] = useState<Match[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dataProvider.getMatchs(id).then((data: Match[]) => {
            setMatchs(data);
            setLoading(false);
        }).catch((e: Error) => {
            setLoading(false);
            setError(e.message);
        });
    }, []);

    if (loading) { return <div>Loading...</div>; }
    if (error) { return <div>{error}</div>; }
    if (!matchs) { return null; }

    return (
        <Show title={<Title />} {...props}>
            <TabbedShowLayout>
                <TabbedShowLayout.Tab label="summary">
                    <TextField source="email" />
                    <TextField source="firstname" />
                    <TextField source="lastname" />
                    <TextField source="age" />
                    <TextField source="gender" />
                    <TextField source="university.name" />
                    <TextField source="role" />
                    <TextField source="goals" />
                    <TextField source="nativeLanguage.code" />
                    <TextField source="learningLanguage.code" />
                    <TextField source="learningLanguage.level" />
                    <TextField source="meetingFrequency" />
                    <TextField source="interests" />
                </TabbedShowLayout.Tab>
                <Tab label="Matches">
                    <MatchTable matchs={matchs} />
                </Tab>
            </TabbedShowLayout>
        </Show>
    );
};

export default ProfileShow;
