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
