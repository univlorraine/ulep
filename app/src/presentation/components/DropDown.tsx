import { IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownSvg, ArrowUpSvg } from '../../assets';
import { useConfig } from '../../context/ConfigurationContext';
import { compareArrays } from '../utils';
import styles from './DropDown.module.css';
import RequiredField from './forms/RequiredField';

export interface DropDownItem<T> {
    label: string;
    value: T;
}
interface DropdownProps<T> {
    onChange: (value: T) => void;
    options: DropDownItem<T>[];
    placeholder?: string | null;
    title?: string | null;
    ariaLabel?: string | null;
    value?: DropDownItem<T>;
    required?: boolean;
    disabled?: boolean;
}

const Dropdown = <T,>({
    onChange,
    options,
    placeholder,
    value,
    title,
    ariaLabel,
    required = false,
    disabled = false,
    ...props
}: DropdownProps<T>) => {
    const { deviceAdapter } = useConfig();
    const [selectedOption, setSelectedOption] = useState<DropDownItem<T> | undefined>(
        value ? value : !placeholder ? options[0] : undefined
    );
    const prevOptions = useRef<DropDownItem<T>[]>(options);

    useEffect(() => {
        if (options.length > 0 && !compareArrays(options, prevOptions.current) && selectedOption) {
            setSelectedOption(options[0]);
            prevOptions.current = options;
        }
    }, [placeholder, options]);

    const handleOptionClick = (item: DropDownItem<T>) => {
        setSelectedOption(item);
        onChange(item.value);
    };

    return (
        <div className={styles.container}>
            <span className={styles.title}>
                {title} {required && <RequiredField />}
            </span>
            <IonItem lines="none" className={`ion-no-padding ${styles.item}`}>
                <IonSelect
                    interface={deviceAdapter.isIos() ? 'alert' : 'popover'}
                    aria-label={ariaLabel || title || undefined}
                    className={styles.select}
                    placeholder={placeholder ? placeholder : undefined}
                    toggle-icon={ArrowDownSvg}
                    expanded-icon={ArrowUpSvg}
                    labelPlacement="stacked"
                    onIonChange={(e) => handleOptionClick(e.detail.value)}
                    selectedText={selectedOption?.label ?? value?.label}
                    disabled={disabled}
                    {...props}
                >
                    {options.map((option) => (
                        <IonSelectOption key={option.label} value={option}>
                            {option.label}
                        </IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
        </div>
    );
};

export default Dropdown;
