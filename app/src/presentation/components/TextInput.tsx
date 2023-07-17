import { useState } from 'react';
import style from './TextInput.module.css';

interface TextInputProps {
    errorMessage?: string | null;
    placeholder?: string | null;
    onChange: (text: string) => void;
    title: string;
    type?: 'email' | 'number' | 'password' | 'text' | 'text-area';
    value: string;
}

const TextInput: React.FC<TextInputProps> = ({ errorMessage, onChange, placeholder, title, type, value }) => {
    const [showPasword, setShowPassword] = useState<boolean>(false);
    return (
        <div className="large-margin-bottom">
            <p className={style['input-label']}>{title}</p>
            {type !== 'text-area' ? (
                <div
                    className={`${style['input-wrapper']} ${errorMessage ? style['input-error'] : style['input-text']}`}
                >
                    <input
                        autoComplete="off"
                        className={style.input}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder ?? ''}
                        type={showPasword ? 'text' : type}
                        value={value}
                        required
                    />
                </div>
            ) : (
                <textarea
                    className={`${style['area-text']} ${
                        errorMessage ? style['area-text-error'] : style['area-text-text']
                    }`}
                    maxLength={200}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder ?? ''}
                    value={value}
                    required
                />
            )}
            {type === 'password' && (
                <button className={style['eye-button']} type="button" onClick={() => setShowPassword(!showPasword)}>
                    <img src="/assets/eye.svg" />
                </button>
            )}
            {errorMessage && <p className={style['input-label-error']}>{errorMessage}</p>}
        </div>
    );
};

export default TextInput;
