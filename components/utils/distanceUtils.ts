/**
 * Utilidades para calcular y formatear distancias entre coordenadas geográficas
 */

/**
 * Calcula la distancia entre dos coordenadas usando la fórmula de Haversine
 * @param lat1 Latitud del primer punto
 * @param lon1 Longitud del primer punto
 * @param lat2 Latitud del segundo punto
 * @param lon2 Longitud del segundo punto
 * @returns Distancia en kilómetros
 */
export const calculateDistance = (
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number => {
	const R = 6371; // Radio de la Tierra en kilómetros
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) *
			Math.cos(toRad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;

	return distance;
};

/**
 * Convierte grados a radianes
 */
const toRad = (degrees: number): number => {
	return degrees * (Math.PI / 180);
};

/**
 * Formatea la distancia para mostrar
 * - Si es menor a 1km, muestra en metros (ej: "850 m")
 * - Si es mayor o igual a 1km, muestra en kilómetros con un decimal (ej: "2.5 km")
 * @param distanceInKm Distancia en kilómetros
 * @returns String formateado con la distancia
 */
export const formatDistance = (distanceInKm: number): string => {
	if (distanceInKm < 1) {
		const meters = Math.round(distanceInKm * 1000);
		return `${meters} m`;
	}
	return `${distanceInKm.toFixed(1)} km`;
};

