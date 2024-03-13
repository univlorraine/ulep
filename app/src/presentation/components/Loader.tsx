import { TailSpin } from 'react-loader-spinner';
import { useConfig } from '../../context/ConfigurationContext';

// TODO(NOW+1): refactor

const Loader = () => {
    const { configuration } = useConfig();

    return <TailSpin color={configuration.primaryColor} ariaLabel="tail-spin-loading" radius="1" visible={true} />;
};

export default Loader;
