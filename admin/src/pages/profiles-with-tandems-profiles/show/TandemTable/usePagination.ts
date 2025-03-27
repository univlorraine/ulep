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

import { useState } from 'react';

export interface Pagination<T> {
    count: number;
    page: number;
    handleChangePage: (value: number) => void;
    rowsPerPage: number;
    handleChangeRowsPerPage: (value: number) => void;
    visibleRows: T[];
    resetPage: () => void;
    rowsPerPageOptions: number[];
}

interface UsePaginationOpts {
    defaultRowPerPage?: number;
    rowsPerPageOptions?: number[];
}

const usePagination = <T>(rows: T[], opts?: UsePaginationOpts): Pagination<T> => {
    const [page, setPage] = useState<number>(0);
    const handleChangePage = (value: number) => {
        setPage(value);
    };

    const rowsPerPageOptions = opts?.rowsPerPageOptions || [5, 10, 25, 50];
    if (opts?.defaultRowPerPage && !rowsPerPageOptions.includes(opts.defaultRowPerPage)) {
        throw new Error('Default row per page is not part of rowsPerPage options');
    }
    const [rowsPerPage, setRowsPerPage] = useState<number>(opts?.defaultRowPerPage || rowsPerPageOptions[0]);
    const handleChangeRowsPerPage = (value: number) => {
        setRowsPerPage(value);
        setPage(0);
    };

    const resetPage = () => {
        setPage(0);
    };

    const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const count = rows.length;

    return {
        count,
        page,
        handleChangePage,
        rowsPerPage,
        handleChangeRowsPerPage,
        visibleRows,
        resetPage,
        rowsPerPageOptions,
    };
};

export default usePagination;
