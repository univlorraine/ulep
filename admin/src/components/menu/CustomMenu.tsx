import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FlagIcon from '@mui/icons-material/Flag';
import InterestsIcon from '@mui/icons-material/Interests';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';
import React from 'react';
import { useTranslate, Menu } from 'react-admin';

const CustomMenu = () => {
    const translate = useTranslate();

    return (
        <Menu sx={{ display: 'flex' }}>
            <Menu.Item leftIcon={<SchoolIcon />} primaryText={translate('universities.label')} to="/universities" />
            <Menu.Item leftIcon={<SchoolIcon />} primaryText={translate('campus.label')} to="/campus" />

            <Menu.Item leftIcon={<PersonIcon />} primaryText={translate('profiles.label')} to="/profiles" />
            <Menu.Item
                leftIcon={<PersonIcon />}
                primaryText={translate('TODO.learning-languages.label')}
                // TODO(NOW): manage too long text
                to="/learning-languages"
            />
            <Menu.Item leftIcon={<PublicIcon />} primaryText={translate('countries.label')} to="/countries" />

            <Menu.Item leftIcon={<LanguageIcon />} primaryText={translate('languages.label')} to="/languages" />
            <Menu.Item
                leftIcon={<LanguageIcon />}
                primaryText={translate('suggested_languages.label')}
                to="languages/requests"
            />
            <Menu.Item
                leftIcon={<LanguageIcon />}
                primaryText={translate('count_suggested_languages.label')}
                to="languages/requests/count"
            />
            <Menu.Item
                leftIcon={<InterestsIcon />}
                primaryText={translate('interests.label')}
                to="/interests/categories"
            />
            <Menu.Item leftIcon={<QuizIcon />} primaryText={translate('questions.label')} to="proficiency/questions" />
            <Menu.Item leftIcon={<EmojiEventsIcon />} primaryText={translate('objectives.label')} to="/objectives" />
            <Menu.Item leftIcon={<FlagIcon />} primaryText={translate('reports.label')} to="/reports" />
            <Menu.Item
                leftIcon={<FlagIcon />}
                primaryText={translate('report_categories.label')}
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                to="/reports/categories"
            />
        </Menu>
    );
};

export default CustomMenu;
