type Instance = {
    name: string;
    email: string;
    ressourceUrl: string;
    cguUrl: string;
    confidentialityUrl: string;
    primaryColor: string;
    primaryBackgroundColor: string;
    primaryDarkColor: string;
    secondaryColor: string;
    secondaryBackgroundColor: string;
    secondaryDarkColor: string;
    isInMaintenance: boolean;
    daysBeforeClosureNotification: number;
};

export interface InstanceFormPayload {
    name: string;
    email: string;
    ressourceUrl: string;
    cguUrl: string;
    confidentialityUrl: string;
    primaryColor: string;
    primaryBackgroundColor: string;
    primaryDarkColor: string;
    secondaryColor: string;
    secondaryBackgroundColor: string;
    secondaryDarkColor: string;
    isInMaintenance: boolean;
    daysBeforeClosureNotification: number;
    defaultCertificateFile: File | undefined;
}

export default Instance;
