import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './TextInput.module.css';

interface TextInputProps {
    errorMessage?: string | null;
    placeholder?: string | null;
    onChange: (text: string) => void;
    title: string;
    type?: 'email' | 'number' | 'password' | 'text';
    value: string;
}

const TextInput: React.FC<TextInputProps> = ({ errorMessage, onChange, placeholder, title, type, value }) => {
    const { t } = useTranslation();
    const [showPasword, setShowPassword] = useState<boolean>(false);
    return (
        <div className="large-margin-bottom">
            <p className={style['input-label']}>{title}</p>
            <div className={`${style['input-wrapper']} ${errorMessage ? style['input-error'] : style['input-text']}`}>
                <input
                    className={style.input}
                    name="newPassword"
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder ?? ''}
                    type={showPasword ? 'text' : type}
                    value={value}
                    required
                />
                {type === 'password' && (
                    <button className={style['eye-button']} type="button" onClick={() => setShowPassword(!showPasword)}>
                        <img src="/assets/eye.svg" />
                    </button>
                )}
            </div>
            {errorMessage && <p className={style['input-label-error']}>{errorMessage}</p>}
        </div>
    );
};

export default TextInput;
