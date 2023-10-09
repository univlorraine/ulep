import styles from "./CenterLayout.module.css";
import { ReactElement } from "react";

interface CenterLayoutProps {
    children: ReactElement;
}

const CenterLayout: React.FC<CenterLayoutProps> = ({children}) => (
    <div className={styles.layout}>
        {children}
    </div>
)

export default CenterLayout;