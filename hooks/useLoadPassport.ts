import { useAuth } from "@/contexts/AuthContext";
import { useRefresh } from "@/contexts/RefreshContext";
import { authService } from "@/services/authService";
import { passportService } from "@/services/passportService";
import { topService } from "@/services/topService";
import { useEffect, useState } from "react";

/**
 * Hook para cargar y gestionar los datos del pasaporte de un usuario autenticado.
 *
 * Este hook:
 * - Utiliza el contexto de autenticación (`useAuth`) para verificar si el usuario está logueado y obtener su token.
 * - Carga el "mini pasaporte" con los primeros registros y el total de puntos.
 * - Carga el "pasaporte completo", incluyendo todos los registros con puntos otorgados.
 * - Calcula la posición del usuario en el ranking global usando `topService`.
 * - Permite recargar los datos mediante `reloadPassport`.
 * - Maneja automáticamente el estado de carga (`loadingPassport`).
 *
 * Comportamiento:
 * - Solo realiza la carga si el usuario está autenticado y tiene token válido.
 * - En caso de errores durante la carga de datos, los registra en consola pero no interrumpe la aplicación.
 *
 * @returns {Object} Contiene los datos y funciones relacionadas con el pasaporte.
 * @property {any[]} passportPreview - Primeros registros del pasaporte (mini pasaporte).
 * @property {number} passportPoints - Total de puntos acumulados por el usuario.
 * @property {boolean} loadingPassport - Indica si los datos del pasaporte están en curso de carga.
 * @property {number | null} ranking - Posición del usuario en el ranking global, o `null` si no está en el ranking.
 * @property {any[]} registros - Registros completos del pasaporte con puntos otorgados.
 * @property {() => Promise<void>} reloadPassport - Función para recargar los datos del pasaporte manualmente.
 */

export const useLoadPassport = () => {
	const { status, token } = useAuth();
	const isLogged = status === "authenticated";
	const [loadingPassport, setLoadingPassport] = useState(true);

	// Para el mini pasaporte
	const [passportPreview, setPassportPreview] = useState<any[]>([]);
	const [passportPoints, setPassportPoints] = useState(0);
	// Para pasaporte completo
	const [ranking, setRanking] = useState<number | null>(null);
	const [registros, setRegistros] = useState<any[]>([]);

	const loadData = async () => {
		if (!token) return;
		try {
			const passportData = await passportService.getPasaporte(token);
			setPassportPreview(passportData.registros.slice(0, 4));
			setLoadingPassport(false);
		} catch (error) {
			console.log("Error cargando datos del pasaporte:", error);
		}
	};

	const loadPassport = async () => {
		if (!token) return;

		try {
			const data = await passportService.getPasaporte(token);
			const filtrado = data.registros.filter(
				(r: any) => r.puntosOtorgados > 0
			);

			setRegistros(filtrado);
			setPassportPoints(Number(data.puntosTotales ?? 0));

			const user = await authService.getUserData(token);
			const top = await topService.getRankingData();

			const pos = top.findIndex(
				(u: any) => u.nombre === user.nombre || u.email === user.email
			);

			setRanking(pos >= 0 ? pos + 1 : null);
		} catch (err) {
			console.log("Error cargando pasaporte:", err);
		} finally {
			setLoadingPassport(false);
		}
	};

	const reloadPassport = async () => {
		if (!isLogged || !token) return;
		setLoadingPassport(true);
		await Promise.all([loadData(), loadPassport()]);
	};

	const { subscribePassport } = useRefresh();

	useEffect(() => {
		if (!isLogged || !token) return;
		loadPassport();
		loadData();
	}, [isLogged, token]);

	useEffect(() => {
		const unsubscribe = subscribePassport(() => {
			reloadPassport();
		});
		return unsubscribe;
	}, [subscribePassport, isLogged, token]);

	return {
		passportPreview,
		passportPoints,
		loadingPassport,
		ranking,
		registros,
		reloadPassport,
	};
};
