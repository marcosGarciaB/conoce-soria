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

/**
 * Interface que define las propiedades y funciones que expone el contexto de experiencias.
 */
interface ExperienciaContextProps {
	/** Lista de experiencias resumidas */
	experiencias: ExperienciasResponse[];
	/** Función para cargar las experiencias desde el servicio */
	loadExperiencias: () => Promise<void>;
}

/**
 * Contexto para gestionar las experiencias de la aplicación.
 * Permite acceder a la lista de experiencias y recargarla.
 */
export const ExperienciaContext = createContext({} as ExperienciaContextProps);

/**
 * Proveedor del contexto de experiencias.
 * Envuelve componentes que necesiten acceder o modificar la lista de experiencias.
 */
export const ExperienciaProvider = ({ children }: { children: ReactNode }) => {
	const [experiencias, setExperiencias] = useState<ExperienciasResponse[]>(
		[]
	);

	/**
	 * Carga las experiencias desde el servicio y actualiza el estado.
	 * Maneja errores internamente.
	 */
	const loadExperiencias = async () => {
		try {
			const data = await experienciaService.getExperiencias();
			setExperiencias(data);
		} catch (error) {
			console.error("Error cargando experiencias:", error);
		}
	};

	/**
	 * Agrega una nueva experiencia al estado a partir de su detalle completo.
	 * @param experiencia - Objeto de detalle completo de la experiencia
	 */
	const addExperiencia = (experiencia: ExperienciaDetailResponse) => {
		const nuevaExperiencia: ExperienciasResponse = {
			id: experiencia.id,
			categoria: experiencia.categoria,
			imagenPortadaUrl: experiencia.imagenPortadaUrl,
			titulo: experiencia.titulo,
		};
		setExperiencias((prev) => [...prev, nuevaExperiencia]);
	};

	/**
	 * Actualiza una experiencia existente en el estado a partir de su detalle completo.
	 * @param experiencia - Objeto de detalle completo de la experiencia
	 */
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

	/**
	 * Memoiza el valor del contexto para evitar renders innecesarios.
	 */
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

/**
 * Hook para consumir el contexto de experiencias de forma sencilla.
 */
export const useExperiencias = () => useContext(ExperienciaContext);
