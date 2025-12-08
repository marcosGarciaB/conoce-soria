import { useRefresh } from "@/contexts/RefreshContext";
import {
	ComentariosResponse,
	comentariosService,
} from "@/services/commentService";
import { useEffect, useState } from "react";

/**
 * Hook para cargar y gestionar los comentarios asociados a una experiencia o elemento.
 *
 * Este hook:
 * - Recibe un ID numérico del recurso (experiencia, post, etc.).
 * - Obtiene los comentarios desde `comentariosService.getComentarios`.
 * - Maneja automáticamente el estado de carga (`loading`).
 * - Permite recargar los comentarios manualmente mediante `reload`.
 * - Expone también el setter de comentarios para actualizaciones locales.
 * - Se integra con `RefreshContext` para refrescar comentarios desde eventos globales.
 *
 * Comportamiento:
 * - Realiza la carga inicial de comentarios cuando el hook se monta o cambia el ID.
 * - Se suscribe a `refreshComments(id)` para recargar automáticamente los comentarios.
 * - En caso de error durante la carga, lo registra en consola pero no interrumpe la aplicación.
 *
 * @param {number} id - Identificador numérico del recurso del cual se obtendrán los comentarios.
 * @returns {object} Contiene la lista de comentarios, estados y funciones de control.
 * @property {ComentariosResponse[]} comentarios - Lista actual de comentarios cargados.
 * @property {(comments: ComentariosResponse[]) => void} setComentarios - Setter para actualizar manualmente los comentarios.
 * @property {boolean} loading - Indica si la carga está en progreso.
 * @property {() => Promise<void>} reload - Función para recargar los comentarios desde el servidor.
 */


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

	const { subscribeComments } = useRefresh();
	useEffect(() => {
		const unsubscribe = subscribeComments(id, () => {
			loadComentarios();
		});
		return unsubscribe;
	}, [id, subscribeComments]);

	return {
		comentarios,
		setComentarios,
		loading,
		reload: loadComentarios,
	};
};
