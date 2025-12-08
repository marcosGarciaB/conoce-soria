import React, {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from "react";
import {
    ExperienciaDetailResponse,
    experienciaService,
    ExperienciasResponse,
} from "../services/experienceService";

interface ExperienciaContextProps {
	experiencias: ExperienciasResponse[];
	loadExperiencias: () => Promise<void>;
}

export const ExperienciaContext = createContext({} as ExperienciaContextProps);

export const ExperienciaProvider = ({ children }: { children: ReactNode }) => {
	const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>(
		[]
	);

	const loadExperiencias = async () => {
		try {
			const data = await experienciaService.getExperiencias();
			setExperiencias(data);
		} catch (error) {
			console.error("Error cargando experiencias:", error);
		}
	};

	const addExperiencia = (experiencia: ExperienciaDetailResponse) => {
		const nuevaExperiencia: ExperienciasResponse = {
			id: experiencia.id,
			categoria: experiencia.categoria,
			imagenPortadaUrl: experiencia.imagenPortadaUrl,
			titulo: experiencia.titulo,
		};
		setExperiencias((prev) => [...prev, nuevaExperiencia]);
	};
	const updateExperiencia = (experiencia: ExperienciaDetailResponse) => {
		const experienciaActualizada: ExperienciasResponse = {
			id: experiencia.id,
			categoria: experiencia.categoria,
			imagenPortadaUrl: experiencia.imagenPortadaUrl,
			titulo: experiencia.titulo,
		};
		setExperiencias((prev) =>
			prev.map((exp) =>
				exp.id === experienciaActualizada.id
					? experienciaActualizada
					: exp
			)
		);
	};

	const value = useMemo(
		() => ({
			experiencias,
			loadExperiencias,
			addExperiencia,
			updateExperiencia,
		}),
		[experiencias]
	);

	return (
		<ExperienciaContext.Provider value={value}>
			{children}
		</ExperienciaContext.Provider>
	);
};

export const useExperiencias = () => useContext(ExperienciaContext);
