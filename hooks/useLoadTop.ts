import { useRefresh } from "@/contexts/RefreshContext";
import { topService, UsuarioRankingDTO } from "@/services/topService";
import { useEffect, useState } from "react";
import { useLoadUser } from "./useLoadUser";

/**
 * Hook para cargar el ranking global de usuarios y la posición del usuario actual.
 *
 * Este hook:
 * - Obtiene la lista completa de usuarios ordenada por ranking usando `topService.getRankingData`.
 * - Calcula la posición del usuario actual en el ranking si se encuentra definido (`user`).
 * - Maneja el estado de carga (`loading`) mientras se obtienen los datos.
 * - Permite recargar el ranking manualmente mediante `reloadTop`.
 *
 * Comportamiento:
 * - Actualiza el ranking automáticamente cada vez que cambia el usuario actual (`user`).
 * - En caso de error al cargar el ranking, lo registra en consola pero no interrumpe la aplicación.
 *
 * @returns {Object} Contiene datos del ranking, posición del usuario y funciones relacionadas.
 * @property {UserCredentials | undefined} user - Usuario actual (puede estar indefinido).
 * @property {UsuarioRankingDTO[]} topUsuarios - Lista completa de usuarios con su ranking.
 * @property {number | null} userRank - Posición del usuario actual en el ranking, o `null` si no está en la lista.
 * @property {() => Promise<void>} reloadTop - Función para recargar manualmente el ranking.
 */

export const useLoadTop = () => {
	const { user } = useLoadUser();
	const [loading, setLoading] = useState(true);
	const [userRank, setUserRank] = useState<number | null>(null);
	const [topUsuarios, setTopUsuarios] = useState<UsuarioRankingDTO[]>([]);

	const loadRanking = async () => {
		try {
			setLoading(true);
			const top = await topService.getRankingData();
			setTopUsuarios(top);

			if (user) {
				const pos = top.findIndex(
					(u) => u.nombre === user.nombre || u.email === user.email
				);
				setUserRank(pos >= 0 ? pos + 1 : null);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadRanking();
	}, [user]);

	const { subscribeTop } = useRefresh();
	useEffect(() => {
		const unsubscribe = subscribeTop(() => {
			loadRanking();
		});
		return unsubscribe;
	}, [subscribeTop]);

	return {
		user,
		topUsuarios,
		userRank,
		reloadTop: loadRanking,
	};
};
