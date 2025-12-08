import { useCallback, useState } from "react";

interface PaginatedFetchProps<T> {
    fetchFunction: (page: number, pageSize: number) => Promise<T[]>;
    pageSize?: number;
}

/**
 * Hook para manejar la carga paginada de datos de manera genérica.
 *
 * Este hook:
 * - Permite cargar datos de manera paginada usando una función de fetch personalizada.
 * - Mantiene el estado de los datos cargados, la página actual, si hay más datos y si está cargando.
 * - Permite reiniciar la carga desde la primera página usando el parámetro `reset`.
 *
 * Comportamiento:
 * - Evita llamadas concurrentes mientras se está cargando.
 * - Actualiza automáticamente si la cantidad de datos obtenidos es menor al tamaño de página (`pageSize`) para indicar que no hay más datos.
 *
 * @template T Tipo de los datos que se van a cargar.
 * @param {object} params
 * @param {(page: number, pageSize: number) => Promise<T[]>} params.fetchFunction Función asíncrona que obtiene los datos, recibiendo el número de página y el tamaño de página.
 * @param {number} [params.pageSize=10] Cantidad de elementos por página.
 * @returns {object} Contiene los datos cargados, la función para cargar más, el estado de carga y si hay más datos.
 * @property {T[]} data Array con los datos cargados hasta el momento.
 * @property {(reset?: boolean) => Promise<void>} loadData Función para cargar la siguiente página o reiniciar la carga si `reset` es `true`.
 * @property {boolean} loading Indica si actualmente se están cargando datos.
 * @property {boolean} hasMore Indica si hay más datos por cargar según la última llamada.
 */
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
