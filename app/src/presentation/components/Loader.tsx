import { Style, TailSpin } from 'react-loader-spinner';
import { useConfig } from '../../context/ConfigurationContext';

interface LoaderParams {
    color?: string;
    height?: string | number;
    width?: string | number;
    radius?: string | number;
    ariaLabel?: string;
    wrapperStyle?: Style;
    wrapperClass?: string;
    strokeWidth?: string | number;
}

const Loader = ({ height, width, radius, ariaLabel, wrapperStyle, wrapperClass, strokeWidth, color }: LoaderParams) => {
    const { configuration } = useConfig();

    return (
        <TailSpin
            color={color || configuration.primaryColor}
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
