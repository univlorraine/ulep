import { createContext, useContext } from 'react';
import Configuration from '../domain/entities/Confirguration';
import { ConfigContextValueType } from './configurationContextTypes';
import getConfigContextValue from './getConfigurationContextValue';

export const ConfigContext = createContext<ConfigContextValueType>(
    getConfigContextValue(
        '',
        '',
        '',
        () => null,
        () => null,
        () => null,
        new Configuration(
            'Université de Lorraine',
            'Université de Lorraine',
            'contact@email.com',
            '#FDEE66',
            '#B6AA43',
            '#EDDF5E',
            '#8BC4C4',
            '#4B7676',
            '#7CB8B8'
        )
    )
);

export const useConfig = () => useContext(ConfigContext);
