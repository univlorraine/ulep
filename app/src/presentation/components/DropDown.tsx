import React, { useState } from 'react';
import styles from './DropDown.module.css';

interface DropDownItem {
    title: string;
    value: any;
}

interface DropdownProps {
    onChange: (value: any) => void;
    options: DropDownItem[];
    placeholder?: string | null;
    title?: string | null;
}

const Dropdown: React.FC<DropdownProps> = ({ onChange, options, placeholder, title }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<DropDownItem | undefined>(
        !placeholder ? options[0] : undefined
    );

    const handleOptionClick = (item: DropDownItem) => {
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
                    <img alt="arrow-down" src="/public/assets/arrow-down.svg" />
                </button>
                {isOpen && (
                    <div className={styles.menu}>
                        {options.map((option) => {
                            return (
                                <div key={option.value} className={styles.submenu}>
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
