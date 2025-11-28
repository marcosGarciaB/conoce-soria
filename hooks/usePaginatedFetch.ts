import { useCallback, useState } from "react";

interface PaginatedFetchProps<T> {
    fetchFunction: (page: number, pageSize: number) => Promise<T[]>;
    pageSize?: number;
}

export const usePaginatedFetch = <T>({ fetchFunction, pageSize = 10 }: PaginatedFetchProps<T>) => {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadData = useCallback(async (reset = false) => {
        if (loading) return;
        if (!hasMore && !reset) return;

        setLoading(true);
        try {
            const currentPage = reset ? 0 : page ;
            const newData = await fetchFunction(currentPage, pageSize);

            if (reset) {
                setData(newData);
                setPage(1);
            } else {
                setData(prev => [...prev, ...newData]);
                setPage(prev => prev + 1);
            }

            setHasMore(newData.length === pageSize);
        } catch (error) {
            console.error("Error cargando datos paginados:", error);
        }
        setLoading(false);
    }, [fetchFunction, page, pageSize, hasMore, loading]);

    return { data, loadData, loading, hasMore };
};
