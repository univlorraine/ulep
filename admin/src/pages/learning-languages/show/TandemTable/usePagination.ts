import { useState } from 'react';

// TODO(NOW): option pagination (e.g. nb item per page)

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

const usePagination = <T>(rows: T[]): Pagination<T> => {
    const [page, setPage] = useState<number>(0);
    const handleChangePage = (value: number) => {
        setPage(value);
    };

    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const handleChangeRowsPerPage = (value: number) => {
        setRowsPerPage(value);
        setPage(0);
    };

    const resetPage = () => {
        setPage(0);
    };

    const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const count = rows.length;
    const rowsPerPageOptions = [5, 10, 25, 50];

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
