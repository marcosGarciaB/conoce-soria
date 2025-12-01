import { ExperienciaDetailResponse } from "@/services/experienceService";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	Dimensions,
	FlatList,
	Image,
	StyleSheet,
	Text,
	View
} from "react-native";
import ItemButton from "./ItemButton";
const { width } = Dimensions.get("window");

interface CategoryItemProps {
	experiencias: ExperienciaDetailResponse[];
	onDelete: (id: number) => void;
	onEdit: (experiencia: ExperienciaDetailResponse) => void;
	loadMore: () => void;
	hasMore: boolean;
	loading: boolean;
}

const CategoryItem = ({ experiencias, onDelete, onEdit, loadMore, hasMore, loading }: CategoryItemProps) => {
	const url = "https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";

	const renderItem = ({ item }: { item: ExperienciaDetailResponse }) => (
		<View style={styles.expCard}>
			<Image source={{ uri: item.imagenPortadaUrl }} style={styles.expImage} />

			<View style={styles.imageOverlay}>
				<View style={styles.topRow}>
					<Text style={styles.overlayCategory}>
						{item.categoria
							.replace("_", " ")
							.toLowerCase()
							.replace(/\b\w/g, (l) => l.toUpperCase())}
					</Text>
					<Text
						style={[
							styles.overlayStatus,
							item.visible ? styles.active : styles.inactive,
						]}
					>
						{item.visible ? "Activo" : "Inactivo"}
					</Text>
				</View>
			</View>

			<View style={styles.expContent}>
				<Text style={styles.experinceTitle}>{item.titulo}</Text>
				<Text style={styles.description}>{item.descripcion}</Text>

				<View style={styles.row}>
					<Ionicons
						name="location-outline"
						size={18}
						color="orange"
					/>
					<Text style={styles.labelText}>{item.direccion}</Text>
				</View>

				<View style={styles.coordsContainer}>
					<Text style={styles.coordText}>Latitud: {item.ubicacionLat}</Text>
					<Text style={styles.coordText}>Longitud: {item.ubicacionLng}</Text>
				</View>
			</View>

			<View style={styles.userActions}>
				<ItemButton title="Editar" onPress={() => onEdit(item)} />
				<ItemButton title="Eliminar" onPress={() => onDelete(item.id)} />
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={experiencias}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
				scrollEnabled={true}
				showsVerticalScrollIndicator={false}
				numColumns={width > 600 ? 2 : 1}
				columnWrapperStyle={
					width > 600
						? { justifyContent: "space-between" }
						: undefined
				}
				contentContainerStyle={{ paddingBottom: 40 }}
				onEndReachedThreshold={0.01}
				onEndReached={() => {
					if (!loading && hasMore) {
						loadMore();
					}
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
	},
	// Experiencias
	expCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		marginVertical: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 3,
	},
	expImage: {
		width: "100%",
		height: 150,
		resizeMode: "cover",
	},
	// Overlay imagen
	imageOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		padding: 10,
		justifyContent: "space-between",
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	overlayCategory: {
		color: "#fff",
		fontWeight: "500",
		fontSize: 14,
		backgroundColor: "rgba(0,0,0,0.3)",
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 8,
		overflow: "hidden",
	},
	overlayStatus: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
		fontWeight: "700",
		fontSize: 12,
		color: "white",
	},
	active: {
		backgroundColor: "#28a745",
	},
	inactive: {
		backgroundColor: "#d9534f",
	},
	// Información
	experinceTitle: {
		color: "#000000ff",
		fontWeight: "700",
		fontSize: 16,
		flex: 1,
		flexWrap: "wrap",
	},
	expContent: {
		padding: 5,
	},
	description: {
		fontSize: 14,
		color: "#555",
		lineHeight: 20,
		marginBottom: 10,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
	},
	labelText: {
		marginLeft: 6,
		fontSize: 14,
		color: "#555",
	},
	userActions: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		margin: 10,
	},
	coordsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		flexWrap: "wrap",
		marginTop: 5,
		gap: 10,
	},
	coordText: {
		backgroundColor: "#eee",
		color: "#333",
		fontSize: 12,
		fontWeight: "500",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 6,
	}

});

export default CategoryItem;
