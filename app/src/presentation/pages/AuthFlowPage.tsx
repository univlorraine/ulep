import { IonPage } from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import { useEffect } from "react";
import { useConfig } from "../../context/ConfigurationContext";
import { TailSpin } from "react-loader-spinner";
import CenterLayout from "../components/layout/CenterLayout";

const AuthPage: React.FC = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const code = params.get("code");
    const { getTokenFromCodeUsecase } = useConfig();
    const history = useHistory();
    const { configuration } = useConfig();

    useEffect(() => {
        if (code) {
            getTokenFromCodeUsecase.execute(code).then((res) => {
                if ("accessToken" in res) {
                    // TODO(future): call connector here to initialize store with values from university ?
                    history.push("/signup/informations");
                }
            }).catch((err) => {
                console.error(err);
                window.alert("an error occured");
                // TODO: redirect on error page when exist
                history.push("/error");
            });
        }
    }, [code]);


    return (
        <IonPage>
            <CenterLayout>
                <TailSpin
                        height="150"
                        width="150"
                        color={configuration.primaryColor}
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
            </CenterLayout>
        </IonPage>
    );
};

export default AuthPage;