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

import { ReactElement, useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    children: ReactElement;
    className?: string;
    hideWhiteBackground?: boolean;
    isVisible: boolean;
    onClose: () => void;
    position?: 'center' | 'flex-end' | 'flex-start';
    classNameModal?: string;
}

const Modal: React.FC<ModalProps> = ({
    children,
    className,
    classNameModal,
    hideWhiteBackground,
    isVisible,
    onClose,
    position = 'center',
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        const modalContent = document.getElementById('modal-content');

        if (modalContent && !modalContent.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isVisible && modalRef.current) {
            const modalElement = modalRef.current;
            //add any focusable HTML element you want to include to this string
            const focusableElements = modalElement.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (firstElement) {
                firstElement.focus();
            }

            const handleTabKeyPress = (event: KeyboardEvent) => {
                if (event.key === 'Tab') {
                    if (event.shiftKey && document.activeElement === firstElement && lastElement) {
                        event.preventDefault();
                        lastElement.focus();
                    } else if (!event.shiftKey && document.activeElement === lastElement && firstElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            const handleEscapeKeyPress = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };

            modalElement.addEventListener('keydown', handleTabKeyPress);
            modalElement.addEventListener('keydown', handleEscapeKeyPress);

            return () => {
                modalElement.removeEventListener('keydown', handleTabKeyPress);
                modalElement.removeEventListener('keydown', handleEscapeKeyPress);
            };
        }
    }, [isVisible, onClose]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={`${styles.modal} ${classNameModal}`}
            style={{ justifyContent: position }}
            ref={modalRef}
            role="alertdialog"
            aria-modal="true"
        >
            {!hideWhiteBackground && (
                <div id="modal-content" className={`${styles['modal-content']} ${className}`}>
                    {children}
                </div>
            )}
            {hideWhiteBackground && children}
        </div>
    );
};

export default Modal;
