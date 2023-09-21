import { CapacitorConfig } from '@capacitor/cli';

let config: CapacitorConfig;

const baseConfig: CapacitorConfig = {
    webDir: 'dist',
    server: {
        androidScheme: 'https',
    },
    plugins: {
        Keyboard: {
            resize: 'native',
        },
    },
};

switch (process.env.ENV) {
    case 'prod':
        config = {
            ...baseConfig,
            appId: 'com.ionic.etandem',
            appName: 'etandem',
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
            appId: 'com.ionic.etandem.staging',
            appName: 'etandem-staging',
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
            appId: 'com.ionic.etandem.dev',
            appName: 'etandem-dev',
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
