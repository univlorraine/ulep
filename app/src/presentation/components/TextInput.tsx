import { IonInput, IonItem } from '@ionic/react';
import React, { useState } from 'react';
import { EyeSvg } from '../../assets';
import RequiredField from './forms/RequiredField';
import style from './TextInput.module.css';

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
    id?: string;
    autocomplete?: AutocompleteTypes;
    customHeight?: number;
    disabled?: boolean;
    errorMessage?: JSX.Element | string | null;
    placeholder?: string | null;
    onChange: (text: string) => void;
    title?: string;
    type?: 'email' | 'number' | 'password' | 'text' | 'text-area';
    value: string;
    maxLength?: number;
    fieldInfo?: JSX.Element;
    required?: boolean;
    beforeInput?: React.ReactNode;
    showLimit?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    id,
    autocomplete = 'off',
    customHeight,
    disabled,
    errorMessage,
    onChange,
    placeholder,
    title,
    type = 'text',
    value,
    maxLength,
    fieldInfo = null,
    required = false,
    beforeInput,
    showLimit = false,
}) => {
    const [showPasword, setShowPassword] = useState<boolean>(false);
    return (
        <div className={`${style.container} large-margin-bottom`}>
            {title && (
                <span className={style['input-label']}>
                    {title} {required && <RequiredField />}
                </span>
            )}
            {fieldInfo}
            {type !== 'text-area' ? (
                <IonItem
                    lines="none"
                    className={`${style['input-wrapper']} ${errorMessage ? style['input-error'] : style['input-text']}`}
                >
                    {beforeInput && <div>{beforeInput}</div>}
                    <IonInput
                        id={id}
                        aria-label={title}
                        disabled={disabled}
                        class={style.input}
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
                            aria-label="Show password"
                            className={style['eye-button']}
                            type="button"
                            onClick={() => setShowPassword(!showPasword)}
                        >
                            <img alt="" src={EyeSvg} aria-hidden={true} />
                        </button>
                    )}
                </IonItem>
            ) : (
                <textarea
                    aria-label={title}
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
            {showLimit && (
                <div className={style.limitContainer}>
                    <span className={style.limit}>{`${value.length} / ${maxLength}`}</span>
                </div>
            )}
            {errorMessage && <p className={style['input-label-error']}>{errorMessage}</p>}
        </div>
    );
};

export default TextInput;
