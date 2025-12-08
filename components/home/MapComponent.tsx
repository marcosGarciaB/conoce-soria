import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
	Image,
	Platform,
	StyleSheet,
	Text,
	View
} from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { useFilteredExperiences } from "@/hooks/useFilters";
import { ExperienciaDetailResponse } from "@/services/experienceService";
import LoadingScreen from "../common/Loading";
import ButtonLocation from "../map/ButtonLocation";
import Filters from "../seeker/FilterDropdown";

const GOOGLE_MAPS_APIKEY = " ";

const MapComponent = () => {
	const [permissionGranted, setPermissionGranted] = useState(false);
	const [userLocation, setUserLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(
		null
	);
	const mapRef = useRef<MapView>(null);
	const {
		filteredMarkers,
		selectedCat,
		setSelectedCat,
		buttonFilter,
		wordsFilter,
		categories,
	} = useFilteredExperiences();

	const initialRegion: Region = {
		latitude: 41.65,
		longitude: -2.47,
		latitudeDelta: 0.9,
		longitudeDelta: 0.9,
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
		<>
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={initialRegion}
				provider={Platform.OS === "android" ? "google" : undefined}
				showsUserLocation
				showsMyLocationButton
			>
				{filteredMarkers.map((item) => (
					<Marker
						key={item.id.toString()}
						coordinate={{
							latitude: item.ubicacionLat,
							longitude: item.ubicacionLng,
						}}
						onPress={() => onMarkerPress(item)}
						tracksViewChanges={true}
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
			</MapView>

			<ButtonLocation isGlobal={true} onPress={goToSoriaGlobal} />
			<ButtonLocation onPress={goToUserLocation} />

			<View style={styles.filtersContainer}>
				<Filters
					selectedCat={selectedCat}
					setSelectedCat={setSelectedCat}
					categories={categories}
					onFilterByText={wordsFilter}
					onFilterByCategory={buttonFilter}
					onlyButtons={true}
				/>
			</View>
		</>
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
	
	filtersContainer: {
		position: "absolute",
		top: 10,
		width: "100%",
		paddingHorizontal: 10,
		zIndex: 10,
	},
});

export default MapComponent;
