import React, { createContext, useState, useEffect, ReactNode, useMemo, useContext } from 'react';
import { experienciaService, ExperienciasResponse } from '../services/experienceService';

interface ExperienciaContextProps {
    experiencias: ExperienciasResponse[];
    loadExperiencias: () => Promise<void>;
}

export const ExperienciaContext = createContext({} as ExperienciaContextProps);

export const ExperienciaProvider = ({ children }: { children: ReactNode }) => {
    const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>([]);

    const loadExperiencias = async () => {
        try {
            const data = await experienciaService.getExperiencias();
            setExperiencias(data);
        } catch (error) {
            console.error('Error cargando experiencias:', error);
        }
    };

    const value = useMemo(() => ({
        experiencias,
        loadExperiencias,
    }), [experiencias]);

    return (
        <ExperienciaContext.Provider value={value}>
            {children}
        </ExperienciaContext.Provider>
    );
};

export const useExperiencias = () => useContext(ExperienciaContext);
