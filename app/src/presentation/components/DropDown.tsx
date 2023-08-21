import { useEffect, useRef, useState } from 'react';
import { ArrowDownSvg } from '../../assets';
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
    const [selectedOption, setSelectedOption] = useState<DropDownItem<T> | undefined>(
        !placeholder ? options[0] : undefined
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        // Ajouter l'écouteur d'événement lors du montage du composant
        document.addEventListener('mousedown', handleClickOutside);

        // Supprimer l'écouteur d'événement lors du démontage du composant
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!placeholder && options.length > 0) {
            setSelectedOption(options[0]);
        }
    }, [placeholder, options]);

    const handleOptionClick = (item: DropDownItem<T>) => {
        setSelectedOption(item);
        onChange(item.value);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef}>
            <span className={styles.title}>{title}</span>
            <div className={styles.container}>
                <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
                    {selectedOption ? selectedOption.title : placeholder}
                    <img alt="arrow-down" src={ArrowDownSvg} />
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
