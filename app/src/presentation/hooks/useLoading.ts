import React, { useCallback, useEffect, useState } from 'react';

const useLoading = (componentDidMount: Function, deps: React.DependencyList = []): boolean => {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(
        useCallback(() => {
            const onMount = async () => {
                setLoading(true);
                await componentDidMount();
                setLoading(false);
            };
            onMount();
        }, deps)
    );

    return loading;
};

export default useLoading;
