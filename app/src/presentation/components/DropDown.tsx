/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
        if (options.length > 0 && !compareArrays(options, prevOptions.current) && selectedOption && !value) {
            setSelectedOption(options[0]);
            prevOptions.current = options;
        }
    }, [placeholder, options]);

    useEffect(() => {
        if (value) {
            setSelectedOption(value);
        }
    }, [value]);

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
