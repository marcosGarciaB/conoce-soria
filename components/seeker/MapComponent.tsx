import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapComponent = () => {
	return (
		//Hacer render como en ManageExperience para poder coger lat, lon, id y title
		<MapView
			style={{ width: "100%", height: "100%" }}
			initialRegion={{
				latitude: 41.65,
				longitude: -2.47,
				latitudeDelta: 0.6,
				longitudeDelta: 0.6,
			}}
		>
			<Marker
				key="marker1"
				coordinate={{ latitude: 41.6532, longitude: -2.42457 }}
				title="Soria 1"
			/>

			<Marker
				key="marker2"
				coordinate={{ latitude: 41.645, longitude: -2.4784 }}
				title="Soria 2"
			/>

			<Marker
				key="marker3"
				coordinate={{ latitude: 41.463, longitude: -2.5252 }}
				title="Soria 3"
			/>
		</MapView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: "100%",
		height: "100%",
		borderRadius: 15,
	},
});

export default MapComponent;
