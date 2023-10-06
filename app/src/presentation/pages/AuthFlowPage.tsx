import { IonPage } from "@ionic/react";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useConfig } from "../../context/ConfigurationContext";

const AuthPage: React.FC = () => {    
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const code = params.get("code");
    const { getTokenFromCodeUsecase } = useConfig();

    useEffect(() => {
        if (code) {
            getTokenFromCodeUsecase.execute(code).then((res) => {
                if ("accessToken" in res) {
                    console.log("SUCCESS, should redirect");
                    // TODO(NOW): redirect
                }
            }).catch((err) => {
                console.error(err);
                // TODO(NOW): redirect error page
            });
        }
    }, [code]);


    return (
        <IonPage>
            <div style={{color: "red"}}>
                {/* TODO(NOW): real loader */}
                Loading auth
            </div>
        </IonPage>
    );
};

export default AuthPage;