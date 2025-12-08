import { calculateDistance, formatDistance } from "@/components/utils/distanceUtils";
import { ExperienciaDetailResponse } from "@/services/experienceService";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useLoadMarkers } from "./useLoadMarkers";

export interface ExperienceWithDistance extends ExperienciaDetailResponse {
	distance: number;
	formattedDistance: string;
}

/**
 * Hook para obtener experiencias cercanas al usuario, calculando la distancia desde su ubicación actual.
 *
 * Este hook:
 * - Solicita permisos de ubicación al usuario.
 * - Obtiene la ubicación actual del dispositivo.
 * - Calcula la distancia entre el usuario y cada experiencia disponible (`detail`) usando `calculateDistance`.
 * - Formatea la distancia para mostrarla de manera legible usando `formatDistance`.
 * - Ordena las experiencias de más cercana a más lejana.
 * - Actualiza la ubicación del usuario automáticamente cada 2 minutos.
 *
 * Comportamiento:
 * - Si el usuario no otorga permisos de ubicación, se marca `permissionGranted` como `false` y no se calculan distancias.
 * - Maneja el estado de carga mientras obtiene la ubicación y calcula las distancias.
 *
 * @returns {object} Contiene la experiencia más cercana, todas las experiencias cercanas y estados relacionados con la ubicación y carga.
 * @property {ExperienceWithDistance | null} nearestExperience - La experiencia más cercana al usuario, o `null` si no hay datos.
 * @property {ExperienceWithDistance[]} nearExperiences - Lista de experiencias ordenadas por proximidad.
 * @property {boolean} loading - Indica si todavía se están cargando datos o calculando distancias.
 * @property {boolean} permissionGranted - Indica si el usuario otorgó permisos de ubicación.
 * @property {{ latitude: number; longitude: number } | null} userLocation - Ubicación actual del usuario, o `null` si no está disponible.
 */
export const useNearExperiences = () => {
	const { detail, loading: loadingExperiences } = useLoadMarkers();
	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [permissionGranted, setPermissionGranted] = useState(false);
	const [nearExperiences, setNearExperiences] = useState<ExperienceWithDistance[]>([]);
	const [loading, setLoading] = useState(true);

	const updateLocation = async () => {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setPermissionGranted(false);
				setLoading(false);
				return;
			}

			setPermissionGranted(true);
			const location = await Location.getCurrentPositionAsync({});
			setUserLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});
		} catch (error) {
			console.error("Error obteniendo ubicación:", error);
			setPermissionGranted(false);
			setLoading(false);
		}
	};

	const calculateNearExperiences = () => {
		if (!userLocation || detail.length === 0) {
			setLoading(false);
			return;
		}

		const experiencesWithDistance: ExperienceWithDistance[] = detail
			.filter((exp) => exp.ubicacionLat && exp.ubicacionLng)
			.map((exp) => {
				const distance = calculateDistance(
					userLocation.latitude,
					userLocation.longitude,
					exp.ubicacionLat,
					exp.ubicacionLng
				);
				return {
					...exp,
					distance,
					formattedDistance: formatDistance(distance),
				};
			})
			.sort((a, b) => a.distance - b.distance);

		setNearExperiences(experiencesWithDistance);
		setLoading(false);
	};

	useEffect(() => {
		updateLocation();
	}, []);

	useEffect(() => {
		if (!permissionGranted) return;

		const interval = setInterval(() => {
			updateLocation();
		}, 120000); // 2 minutos

		return () => clearInterval(interval);
	}, [permissionGranted]);

	useEffect(() => {
		if (userLocation && !loadingExperiences) {
			calculateNearExperiences();
		}
	}, [userLocation, detail, loadingExperiences]);

	const nearestExperience = nearExperiences.length > 0 ? nearExperiences[0] : null;

	return {
		nearestExperience,
		nearExperiences,
		loading: loading || loadingExperiences,
		permissionGranted,
		userLocation,
	};
};

