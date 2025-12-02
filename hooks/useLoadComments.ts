import { ComentariosResponse, comentariosService } from "@/services/commentService";
import { useEffect, useState } from "react";

export const useLoadComments = (id: number) => {
    const [comentarios, setComentarios] = useState<ComentariosResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const loadComentarios = async () => {
        try {
            const data = await comentariosService.getComentarios(id.toString());
            setComentarios(data);
            console.log(data);
        } catch (error) {
            console.error("Error cargando comentarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComentarios();
    }, [id]);

    return {
        comentarios,
        setComentarios,
        loading,
        reload: loadComentarios,
    };
};
