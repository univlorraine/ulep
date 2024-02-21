import { useState } from 'react';

// TODO(NOW): option pagination (e.g. nb item per page)

const usePagination = <T>(rows: T[]) => {
    const [page, setPage] = useState<number>(0);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return {
        page,
        handleChangePage,
        rowsPerPage,
        handleChangeRowsPerPage,
        visibleRows,
    };
};

export default usePagination;
