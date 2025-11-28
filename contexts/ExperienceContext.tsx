import React, { createContext, useState, useEffect, ReactNode, useMemo, useContext } from 'react';
import { experienciaService, ExperienciasResponse } from '../services/experienceService';

// ------------------- TIPOS ------------------- //
interface ExperienciaContextProps {
    experiencias: ExperienciasResponse[];
    loadExperiencias: () => Promise<void>;
}

// ------------------- CREAR CONTEXTO ------------------- //
export const ExperienciaContext = createContext({} as ExperienciaContextProps);

// ------------------- PROVEEDOR ------------------- //
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

// ------------------- HOOK PARA USAR EL CONTEXTO ------------------- //
export const useExperiencias = () => useContext(ExperienciaContext);
