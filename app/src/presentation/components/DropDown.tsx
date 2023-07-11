import React, { useState } from 'react';
import styles from './DropDown.module.css';

interface DropDownItem {
    title: string;
    value: any;
}

interface DropdownProps {
    options: DropDownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ options }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<DropDownItem>(options[0]);

    const handleOptionClick = (item: DropDownItem) => {
        setSelectedOption(item);
        setIsOpen(false);
    };

    return (
        <div className={styles.container}>
            <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
                {selectedOption.title}
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
    );
};

export default Dropdown;
