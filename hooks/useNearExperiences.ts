import { calculateDistance, formatDistance } from "@/components/utils/distanceUtils";
import { ExperienciaDetailResponse } from "@/services/experienceService";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useLoadMarkers } from "./useLoadMarkers";

export interface ExperienceWithDistance extends ExperienciaDetailResponse {
	distance: number;
	formattedDistance: string;
}

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

