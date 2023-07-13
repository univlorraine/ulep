import { useEffect, useState } from 'react';
import styles from './DropDown.module.css';

export interface DropDownItem<T> {
    title: string;
    value: T;
}

interface DropdownProps<T> {
    onChange: (value: T) => void;
    options: DropDownItem<T>[];
    placeholder?: string | null;
    title?: string | null;
}

const Dropdown = <T,>({ onChange, options, placeholder, title }: DropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<DropDownItem<any> | undefined>(
        !placeholder ? options[0] : undefined
    );

    useEffect(() => {
        if (!placeholder && options.length > 0) {
            setSelectedOption(options[0]);
        }
    }, [placeholder, options]);

    const handleOptionClick = (item: DropDownItem<any>) => {
        setSelectedOption(item);
        onChange(item.value);
        setIsOpen(false);
    };

    return (
        <div>
            <p className={styles.title}>{title}</p>
            <div className={styles.container}>
                <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
                    {selectedOption ? selectedOption.title : placeholder}
                    <img alt="arrow-down" src="/assets/arrow-down.svg" />
                </button>
                {isOpen && (
                    <div className={styles.menu}>
                        {options.map((option) => {
                            return (
                                <div key={option.title} className={styles.submenu}>
                                    <button className={styles.item} onClick={() => handleOptionClick(option)}>
                                        {option.title}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
