import { createContext, useContext } from 'react';
import { ConfigContextValueType } from './configurationContextTypes';
import getConfigContextValue from './getConfigurationContextValue';

export const ConfigContext = createContext<ConfigContextValueType>(getConfigContextValue());

export const useConfig = () => useContext(ConfigContext);
