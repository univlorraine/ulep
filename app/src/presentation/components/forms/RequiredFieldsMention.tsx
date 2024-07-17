import { useTranslation } from 'react-i18next';
import RequiredField from './RequiredField';

const RequiredFieldsMention: React.FC = () => {
    const { t } = useTranslation();
    return (
        <p style={{ textAlign: 'center', marginTop: 0 }}>
            {t('global.required_fields_mention_part1')} <RequiredField /> {t('global.required_fields_mention_part2')}
        </p>
    );
};

export default RequiredFieldsMention;
