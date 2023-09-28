import { useState } from 'react';
import { EyeSvg } from '../../assets';
import style from './TextInput.module.css';
import { IonInput } from '@ionic/react';

interface TextInputProps {
    customHeight?: number;
    errorMessage?: string | null;
    placeholder?: string | null;
    onChange: (text: string) => void;
    title: string;
    type?: 'email' | 'number' | 'password' | 'text' | 'text-area';
    value: string;
}

const TextInput: React.FC<TextInputProps> = ({
    customHeight,
    errorMessage,
    onChange,
    placeholder,
    title,
    type,
    value,
}) => {
    const [showPasword, setShowPassword] = useState<boolean>(false);
    return (
        <div className={`${style.container} large-margin-bottom`}>
            <span className={style['input-label']}>{title}</span>
            {type !== 'text-area' ? (
                <div
                    className={`${style['input-wrapper']} ${errorMessage ? style['input-error'] : style['input-text']}`}
                >
                    <IonInput
                        className={style.input}
                        onIonInput={(e: any) => onChange(e.target.value)}
                        placeholder={placeholder ?? ''}
                        style={{ height: customHeight }}
                        type={showPasword ? 'text' : type}
                        value={value}
                        required
                    />

                    {type === 'password' && (
                        <button
                            className={style['eye-button']}
                            type="button"
                            onClick={() => setShowPassword(!showPasword)}
                        >
                            <img alt="eye" src={EyeSvg} />
                        </button>
                    )}
                </div>
            ) : (
                <textarea
                    className={`${style['area-text']} ${
                        errorMessage ? style['area-text-error'] : style['area-text-text']
                    }`}
                    maxLength={200}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder ?? ''}
                    style={{ height: customHeight }}
                    value={value}
                    required
                />
            )}
            {errorMessage && <p className={style['input-label-error']}>{errorMessage}</p>}
        </div>
    );
};

export default TextInput;
