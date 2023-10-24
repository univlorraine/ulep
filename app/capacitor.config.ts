import { CapacitorConfig } from '@capacitor/cli';

let config: CapacitorConfig;

const baseConfig: CapacitorConfig = {
    webDir: 'dist',
    server: {
        androidScheme: 'https',
    },
    plugins: {
        App: {
            customUrlScheme: 'ulep',
        },
    },
};

switch (process.env.ENV) {
    case 'prod':
        config = {
            ...baseConfig,
            appId: 'fr.univlorraine.ulep',
            appName: 'ULEP',
            ios: {
                scheme: 'prod',
            },
            android: {
                flavor: 'prod',
            },
        };
        break;
    case 'staging':
        config = {
            ...baseConfig,
            appId: 'fr.univlorraine.ulep.staging',
            appName: 'ULEP',
            ios: {
                scheme: 'staging',
            },
            android: {
                flavor: 'staging',
            },
        };
        break;
    default:
        config = {
            ...baseConfig,
            appId: 'fr.univlorraine.ulep.dev',
            appName: 'ULEP',
            ios: {
                scheme: 'dev',
            },
            android: {
                flavor: 'dev',
            },
        };
        break;
}

export default config;
