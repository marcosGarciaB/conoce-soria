import React, { createContext, ReactNode, useContext, useState, useCallback } from 'react';

interface RefreshContextProps {
    refreshPassport: () => void;
    refreshTop: () => void;
    refreshComments: (experienciaId: number) => void;
    subscribePassport: (callback: () => void) => () => void;
    subscribeTop: (callback: () => void) => () => void;
    subscribeComments: (experienciaId: number, callback: () => void) => () => void;
}

export const RefreshContext = createContext({} as RefreshContextProps);

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

export const useRefresh = () => useContext(RefreshContext);

