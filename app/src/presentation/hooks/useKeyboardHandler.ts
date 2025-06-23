import { Device } from '@capacitor/device';
import { Keyboard } from '@capacitor/keyboard';
import { useEffect, useRef, useState } from 'react';

interface UseKeyboardHandlerProps {
    inputRef?: React.RefObject<HTMLElement>;
    scrollToInput?: boolean;
}

export const useKeyboardHandler = ({ inputRef, scrollToInput = true }: UseKeyboardHandlerProps = {}) => {
    const keyboardHeight = useRef(0);
    const [isXiaomiDevice, setIsXiaomiDevice] = useState(false);

    useEffect(() => {
        const detectXiaomiDevice = async () => {
            try {
                const info = await Device.getInfo();
                const isXiaomi =
                    info.manufacturer?.toLowerCase().includes('xiaomi') ||
                    info.model?.toLowerCase().includes('xiaomi') ||
                    (info.platform === 'android' && info.manufacturer?.toLowerCase().includes('redmi'));
                setIsXiaomiDevice(isXiaomi);
            } catch (error) {
                console.warn('Impossible de détecter le fabricant:', error);
            }
        };

        detectXiaomiDevice();
    }, []);

    useEffect(() => {
        const handleKeyboardShow = (info: { keyboardHeight: number }) => {
            keyboardHeight.current = info.keyboardHeight;

            if (scrollToInput && inputRef?.current) {
                const delay = isXiaomiDevice ? 500 : 100;

                setTimeout(() => {
                    inputRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }, delay);
            }
        };

        const handleKeyboardHide = () => {
            keyboardHeight.current = 0;
        };

        Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
        Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
        Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        return () => {
            Keyboard.removeAllListeners();
        };
    }, [inputRef, scrollToInput, isXiaomiDevice]);

    return {
        keyboardHeight: keyboardHeight.current,
        isXiaomiDevice,
    };
};
