import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FlagIcon from '@mui/icons-material/Flag';
import InterestsIcon from '@mui/icons-material/Interests';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import React from 'react';
import { useTranslate, Menu, usePermissions } from 'react-admin';
import { ADMIN_PERMISSION } from '../../providers/authProvider';

const CustomMenu = () => {
    const translate = useTranslate();

    const { permissions } = usePermissions();

    return (
        <Menu sx={{ display: 'flex' }}>
            <Menu.Item leftIcon={<PersonIcon />} primaryText={translate('profiles.label')} to="/profiles" />
            <Menu.Item
                leftIcon={<PersonIcon />}
                primaryText={translate('learning_languages.label')}
                to="/learning-languages"
            />
            {permissions === ADMIN_PERMISSION && (
                // Note: div is mandatory to group these Menu.Item as Fragment throw an error from MUI component
                <div>
                    <Menu.Item
                        leftIcon={<SettingsIcon />}
                        primaryText={translate('instance.label')}
                        to="/instance/config/show"
                    />
                    <Menu.Item
                        leftIcon={<SchoolIcon />}
                        primaryText={translate('universities.label')}
                        to="/universities"
                    />
                    <Menu.Item leftIcon={<SchoolIcon />} primaryText={translate('campus.label')} to="/campus" />
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
                    <Menu.Item
                        leftIcon={<QuizIcon />}
                        primaryText={translate('questions.label')}
                        to="proficiency/questions"
                    />
                    <Menu.Item
                        leftIcon={<EmojiEventsIcon />}
                        primaryText={translate('objectives.label')}
                        to="/objectives"
                    />
                    <Menu.Item leftIcon={<FlagIcon />} primaryText={translate('reports.label')} to="/reports" />
                    <Menu.Item
                        leftIcon={<FlagIcon />}
                        primaryText={translate('report_categories.label')}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        to="/reports/categories"
                    />
                </div>
            )}
        </Menu>
    );
};

export default CustomMenu;
