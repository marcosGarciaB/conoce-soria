import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface RefreshContextProps {
    refreshPassport: () => void;
    refreshTop: () => void;
    refreshComments: (experienciaId: number) => void;
    subscribePassport: (callback: () => void) => () => void;
    subscribeTop: (callback: () => void) => () => void;
    subscribeComments: (experienciaId: number, callback: () => void) => () => void;
}


/**
 * Propiedades del contexto de refresco global.
 * @typedef {Object} RefreshContextProps
 * @property {() => void} refreshPassport - Notifica a todos los suscriptores del pasaporte que deben refrescar.
 * @property {() => void} refreshTop - Notifica a todos los suscriptores del ranking/top que deben refrescar.
 * @property {(experienciaId: number) => void} refreshComments - Notifica a los suscriptores de comentarios de una experiencia específica.
 * @property {(callback: () => void) => () => void} subscribePassport - Suscribe un callback para actualizaciones de pasaporte y devuelve una función de limpieza.
 * @property {(callback: () => void) => () => void} subscribeTop - Suscribe un callback para actualizaciones de ranking/top y devuelve una función de limpieza.
 * @property {(experienciaId: number, callback: () => void) => () => void} subscribeComments - Suscribe un callback para comentarios de una experiencia específica y devuelve una función de limpieza.
 */

/**
 * Contexto global para coordinar la actualización (refresh) de distintas secciones
 * de la aplicación sin acoplar directamente los componentes entre sí.
 *
 * Implementa un patrón pub/sub ligero para pasaporte, top y comentarios.
 */

export const RefreshContext = createContext({} as RefreshContextProps);

/**
 * Proveedor de RefreshContext que envuelve la app.
 * @param {Object} props
 * @param {ReactNode} props.children - Componentes hijos que recibirán el contexto
 */
export const RefreshProvider = ({ children }: { children: ReactNode }) => {
    const [passportListeners, setPassportListeners] = useState<Set<() => void>>(new Set());
    const [topListeners, setTopListeners] = useState<Set<() => void>>(new Set());
    const [commentsListeners, setCommentsListeners] = useState<Map<number, Set<() => void>>>(new Map());

    const refreshPassport = useCallback(() => {
        passportListeners.forEach(callback => callback());
    }, [passportListeners]);

    const refreshTop = useCallback(() => {
        topListeners.forEach(callback => callback());
    }, [topListeners]);

    const refreshComments = useCallback((experienciaId: number) => {
        const listeners = commentsListeners.get(experienciaId);
        if (listeners) {
            listeners.forEach(callback => callback());
        }
    }, [commentsListeners]);

    const subscribePassport = useCallback((callback: () => void) => {
        setPassportListeners(prev => new Set([...prev, callback]));
        return () => {
            setPassportListeners(prev => {
                const next = new Set(prev);
                next.delete(callback);
                return next;
            });
        };
    }, []);

    const subscribeTop = useCallback((callback: () => void) => {
        setTopListeners(prev => new Set([...prev, callback]));
        return () => {
            setTopListeners(prev => {
                const next = new Set(prev);
                next.delete(callback);
                return next;
            });
        };
    }, []);

    const subscribeComments = useCallback((experienciaId: number, callback: () => void) => {
        setCommentsListeners(prev => {
            const next = new Map(prev);
            const listeners = next.get(experienciaId) || new Set();
            listeners.add(callback);
            next.set(experienciaId, listeners);
            return next;
        });
        return () => {
            setCommentsListeners(prev => {
                const next = new Map(prev);
                const listeners = next.get(experienciaId);
                if (listeners) {
                    listeners.delete(callback);
                    if (listeners.size === 0) {
                        next.delete(experienciaId);
                    } else {
                        next.set(experienciaId, listeners);
                    }
                }
                return next;
            });
        };
    }, []);

    const value = {
        refreshPassport,
        refreshTop,
        refreshComments,
        subscribePassport,
        subscribeTop,
        subscribeComments,
    };

    return (
        <RefreshContext.Provider value={value}>
            {children}
        </RefreshContext.Provider>
    );
};

/**
 * Hook para acceder al contexto de refresco.
 *
 * @returns {RefreshContextProps} Funciones para refrescar pasaporte, top y comentarios, y suscribirse a cambios.
 *
 * @example
 * const { refreshPassport, subscribeTop } = useRefresh();
 * useEffect(() => {
 *   const unsubscribe = subscribeTop(() => loadRanking());
 *   return unsubscribe;
 * }, []);
 */
export const useRefresh = () => useContext(RefreshContext);

