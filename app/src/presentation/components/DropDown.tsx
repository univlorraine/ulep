import { IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownSvg, ArrowUpSvg } from '../../assets';
import { compareArrays } from '../utils';
import styles from './DropDown.module.css';

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
}

const Dropdown = <T,>({ onChange, options, placeholder, value, title, ariaLabel, ...props }: DropdownProps<T>) => {
    const [selectedOption, setSelectedOption] = useState<DropDownItem<T> | undefined>(
        value ? value : !placeholder ? options[0] : undefined
    );
    const prevOptions = useRef<DropDownItem<T>[]>(options);

    useEffect(() => {
        if (!placeholder && options.length > 0 && !compareArrays(options, prevOptions.current)) {
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
            <span className={styles.title}>{title}</span>
            <IonItem lines="none" className={`ion-no-padding ${styles.item}`}>
                <IonSelect
                    interface="popover"
                    aria-label={ariaLabel || title || undefined}
                    class={styles.select}
                    placeholder={placeholder ? placeholder : undefined}
                    toggle-icon={ArrowDownSvg}
                    expanded-icon={ArrowUpSvg}
                    labelPlacement="stacked"
                    onIonChange={(e) => handleOptionClick(e.detail.value)}
                    selectedText={selectedOption?.label ?? value?.label}
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
