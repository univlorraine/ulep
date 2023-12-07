import { createContext, useContext } from 'react';
import Configuration from '../domain/entities/Confirguration';
import { ConfigContextValueType } from './configurationContextTypes';
import getConfigContextValue from './getConfigurationContextValue';

export const ConfigContext = createContext<ConfigContextValueType>(
    getConfigContextValue({
        apiUrl: '',
        languageCode: '',
        accessToken:'',
        refreshToken:'',
        setProfile: () => null,
        setTokens: () => null,
        setUser: () => null,
        configuration: new Configuration(
            'Université de Lorraine',
            'Université de Lorraine',
            'contact@email.com',
            'url',
            'url',
            'url',
            '#FDEE66',
            '#B6AA43',
            '#EDDF5E',
            '#8BC4C4',
            '#4B7676',
            '#7CB8B8',
            false
        )
        })
);

export const useConfig = () => useContext(ConfigContext);
