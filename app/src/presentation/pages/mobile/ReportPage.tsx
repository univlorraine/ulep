import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import ReportContent from '../../components/contents/ReportContent';

const ReportPage: React.FC = () => {
    const history = useHistory();
    return (
        <IonPage>
            <ReportContent onGoBack={history.goBack} onReportSent={history.goBack} />
        </IonPage>
    );
};

export default ReportPage;
