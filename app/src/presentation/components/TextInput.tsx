import { useState } from 'react';
import { EyeSvg } from '../../assets';
import style from './TextInput.module.css';
import { IonInput } from '@ionic/react';

export type AutocompleteTypes =
    | 'on'
    | 'off'
    | 'name'
    | 'honorific-prefix'
    | 'given-name'
    | 'additional-name'
    | 'family-name'
    | 'honorific-suffix'
    | 'nickname'
    | 'email'
    | 'username'
    | 'new-password'
    | 'current-password'
    | 'one-time-code'
    | 'organization-title'
    | 'organization'
    | 'street-address'
    | 'address-line1'
    | 'address-line2'
    | 'address-line3'
    | 'address-level4'
    | 'address-level3'
    | 'address-level2'
    | 'address-level1'
    | 'country'
    | 'country-name'
    | 'postal-code'
    | 'cc-name'
    | 'cc-given-name'
    | 'cc-additional-name'
    | 'cc-family-name'
    | 'cc-family-name'
    | 'cc-number'
    | 'cc-exp'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-csc'
    | 'cc-type'
    | 'transaction-currency'
    | 'transaction-amount'
    | 'language'
    | 'bday'
    | 'bday-day'
    | 'bday-month'
    | 'bday-year'
    | 'sex'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'tel-area-code'
    | 'tel-local'
    | 'tel-extension'
    | 'impp'
    | 'url'
    | 'photo';

interface TextInputProps {
    autocomplete?: AutocompleteTypes;
    customHeight?: number;
    errorMessage?: string | null;
    placeholder?: string | null;
    onChange: (text: string) => void;
    title: string;
    type?: 'email' | 'number' | 'password' | 'text' | 'text-area';
    value: string;
    maxLength?: number;
}

const TextInput: React.FC<TextInputProps> = ({
    autocomplete = 'off',
    customHeight,
    errorMessage,
    onChange,
    placeholder,
    title,
    type,
    value,
    maxLength,
}) => {
    const [showPasword, setShowPassword] = useState<boolean>(false);
    const inputId = `input-${title}}`;
    return (
        <div className={`${style.container} large-margin-bottom`}>
            <span className={style['input-label']}>{title}</span>
            {type !== 'text-area' ? (
                <div
                    className={`${style['input-wrapper']} ${errorMessage ? style['input-error'] : style['input-text']}`}
                >
                    <IonInput
                        id={inputId}
                        className={style.input}
                        onIonInput={(e: any) => onChange(e.target.value)}
                        placeholder={placeholder ?? ''}
                        style={{ height: customHeight }}
                        type={showPasword ? 'text' : type}
                        value={value}
                        required
                        autocomplete={autocomplete}
                        maxlength={maxLength ?? 100}
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
                    maxLength={maxLength ?? 200}
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
