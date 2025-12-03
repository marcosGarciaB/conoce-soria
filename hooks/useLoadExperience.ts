import { ExperienciaDetailResponse, experienciaService } from "@/services/experienceService";
import { useEffect, useState } from "react";

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