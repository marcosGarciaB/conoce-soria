import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { useFilteredExperiences } from "@/hooks/useFilters";
import { ExperienciaDetailResponse } from "@/services/experienceService";
import LoadingScreen from "../common/Loading";

const GOOGLE_MAPS_APIKEY = "AIzaSyC3exACcTOit0r-gAPGn_YX_2hwKh79RrY";

const MapComponent = () => {
	const { filteredMarkers } = useFilteredExperiences();
	const [permissionGranted, setPermissionGranted] = useState(false);
	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(
		null
	);
	const mapRef = useRef<MapView>(null);

	const initialRegion: Region = {
		latitude: 41.65,
		longitude: -2.47,
		latitudeDelta: 0.6,
		longitudeDelta: 0.6,
	};

	useEffect(() => {
		(async () => {
			const { status } =
				await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.warn("Permiso de ubicación denegado");
				return;
			}
			setPermissionGranted(true);

			const location = await Location.getCurrentPositionAsync({});
			setUserLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});
		})();
	}, []);

	if (!permissionGranted) return <LoadingScreen />;

	const selectedMarker = filteredMarkers.find(
		(m) => m.id === selectedMarkerId
	);

	const goToSoriaGlobal = () => {
		mapRef.current?.animateToRegion(initialRegion, 500);
	};

	const goToUserLocation = () => {
		if (!userLocation) return;
		mapRef.current?.animateToRegion(
			{
				latitude: userLocation.latitude,
				longitude: userLocation.longitude,
				latitudeDelta: 0.05,
				longitudeDelta: 0.05,
			},
			500
		);
	};

	const onMarkerPress = (marker: ExperienciaDetailResponse) => {
		setSelectedMarkerId(marker.id);
		mapRef.current?.animateToRegion(
			{
				latitude: marker.ubicacionLat,
				longitude: marker.ubicacionLng,
				latitudeDelta: 0.05,
				longitudeDelta: 0.05,
			},
			500
		);
	};

	return (
		<MapView
			ref={mapRef}
			style={styles.map}
			initialRegion={initialRegion}
			provider={Platform.OS === "android" ? "google" : undefined}
			showsUserLocation
			showsMyLocationButton
		>
			{(filteredMarkers ?? []).map((item) => (
				<Marker
					key={item.id}
					coordinate={{
						latitude: item.ubicacionLat,
						longitude: item.ubicacionLng,
					}}
					onPress={() => onMarkerPress(item)}
					tracksViewChanges={false}
				>
					<Callout tooltip>
						<View style={styles.callout}>
							<Image
								source={{ uri: item.imagenPortadaUrl }}
								style={styles.markerImage}
							/>
							<Text style={styles.markerTitle}>
								{item.titulo}
							</Text>
						</View>
					</Callout>
				</Marker>
			))}

			{selectedMarker && userLocation && (
				<MapViewDirections
					origin={userLocation}
					destination={{
						latitude: selectedMarker.ubicacionLat,
						longitude: selectedMarker.ubicacionLng,
					}}
					apikey={GOOGLE_MAPS_APIKEY}
					strokeWidth={5}
					strokeColor="#008cffff"
					optimizeWaypoints
				/>
			)}
			<View style={styles.buttonsContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={goToSoriaGlobal}
				>
					<Text style={styles.buttonText}>Soria Global</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={goToUserLocation}
				>
					<Text style={styles.buttonText}>Mi Ubicación</Text>
				</TouchableOpacity>
			</View>
		</MapView>
	);
};

const styles = StyleSheet.create({
	map: {
		width: "100%",
		height: "100%",
	},
	callout: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 8,
		borderWidth: 1,
		borderColor: "#ddd",
		alignItems: "center",
		width: 140,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	markerImage: {
		width: 120,
		height: 80,
		borderRadius: 10,
		marginBottom: 6,
		resizeMode: "cover",
	},
	markerTitle: {
		color: "#333",
		fontWeight: "600",
		textAlign: "center",
		fontSize: 14,
	},
	buttonsContainer: {
		position: "absolute",
		bottom: 20,
		right: 20,
		flexDirection: "column",
	},
	button: {
		backgroundColor: "#eeeeeeff",
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 25,
		marginBottom: 10,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
	buttonText: { color: "#868686ff", fontWeight: "bold", fontSize: 14 },
});

export default MapComponent;