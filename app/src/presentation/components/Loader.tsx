import { TailSpin } from 'react-loader-spinner';
import { useConfig } from '../../context/ConfigurationContext';
import { Style } from 'react-loader-spinner/dist/type';

interface LoaderParams {
    height?: string | number;
    width?: string | number;
    radius?: string | number;
    ariaLabel?: string;
    wrapperStyle?: Style;
    wrapperClass?: string;
    strokeWidth?: string | number;
}

const Loader = ({ height, width, radius, ariaLabel, wrapperStyle, wrapperClass, strokeWidth }: LoaderParams) => {
    const { configuration } = useConfig();

    return (
        <TailSpin
            color={configuration.primaryColor}
            radius={radius || '1'}
            visible={true}
            strokeWidth={strokeWidth}
            height={height}
            width={width}
            ariaLabel={ariaLabel || 'loader'}
            wrapperStyle={wrapperStyle}
            wrapperClass={wrapperClass}
        />
    );
};

export default Loader;
