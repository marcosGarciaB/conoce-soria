import { ExperienciaDetailResponse, experienciaService } from "@/services/experienceService";
import { useEffect, useState } from "react";

/**
 * Hook para cargar y gestionar el detalle de una experiencia específica.
 *
 * Este hook:
 * - Recibe un ID numérico de la experiencia.
 * - Obtiene los datos completos de la experiencia desde `experienciaService.getExperiencia`.
 * - Maneja automáticamente el estado de carga (`loading`).
 * - Permite actualizar manualmente el detalle mediante `setDetalle`.
 *
 * Comportamiento:
 * - Realiza la carga inicial cuando el hook se monta o cambia el ID.
 * - En caso de error durante la carga, lo registra en consola pero no interrumpe la aplicación.
 *
 * @param {number} id - Identificador de la experiencia a cargar.
 * @returns {object} Contiene el detalle de la experiencia, estado de carga y setter.
 * @property {ExperienciaDetailResponse | null} detalle - Detalle de la experiencia cargada, o `null` si aún no se ha cargado.
 * @property {(detalle: ExperienciaDetailResponse | null) => void} setDetalle - Setter para actualizar manualmente el detalle de la experiencia.
 * @property {boolean} loading - Indica si la carga de la experiencia está en curso.
 */
export const useLoadExperience = (id: number) => {
    const [detalle, setDetalle] = useState<ExperienciaDetailResponse | null>(
        null
    );
    const [loading, setLoading] = useState(true);


    const loadExperiencia = async () => {
        try {
            const data = await experienciaService.getExperiencia(id);
            setDetalle(data);
        } catch (error) {
            console.error("Error cargando experiencia:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExperiencia();
    }, [id]);

    return {
        detalle,
        setDetalle,
        loading,
    }
}