import { ExperienciaDetailResponse } from "@/services/experienceService";

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useStaggeredItemAnimation } from "../animations/staggeredItemAnimation";
import ItemButton from "./ItemButton";
import StatusItem from "./StatusItem";

const { width } = Dimensions.get("window");

interface CategoryItemProps {
	experiencias: ExperienciaDetailResponse[];
	onDelete: (id: number) => void;
	onEdit: (experiencia: ExperienciaDetailResponse) => void;
	onManageUIDs?: (experiencia: ExperienciaDetailResponse) => void;
	loadMore: () => void;
	hasMore: boolean;
	loading: boolean;
}

const CategoryItem = ({
	experiencias,
	onDelete,
	onEdit,
	onManageUIDs,
	loadMore,
	hasMore,
	loading,
}: CategoryItemProps) => {

	const handleLoadMore = () => {
		if (!loading && hasMore) {
			loadMore();
		};
	};

	const renderItem = ({
		item,
		index,
	}: {
		item: ExperienciaDetailResponse;
		index: number;
	}) => {
		const { entering } = useStaggeredItemAnimation(index);
		return (
			<Animated.View entering={entering} style={styles.expCard}>
				<Image
					source={{ uri: item.imagenPortadaUrl }}
					style={styles.expImage}
				/>

				<View style={styles.imageOverlay}>
					<View style={styles.topRow}>
						<Text style={styles.overlayCategory}>
							{item.categoria
								.replace("_", " ")
								.toLowerCase()
								.replace(/\b\w/g, (l) => l.toUpperCase())}
						</Text>
						<StatusItem isActive={item.activo} />
					</View>
				</View>

				<View style={styles.expContent}>
					<Text style={styles.experinceTitle}>{item.titulo}</Text>
					<Text style={styles.description}>{item.descripcion}</Text>

					<View style={styles.row}>
						<Ionicons
							name="location-sharp"
							size={18}
							color="orange"
						/>
						<Text style={styles.labelText}>{item.direccion}</Text>
					</View>

					<View style={styles.coordsContainer}>
						<Text style={styles.coordText}>
							Latitud: {item.ubicacionLat}
						</Text>
						<Text style={styles.coordText}>
							Longitud: {item.ubicacionLng}
						</Text>
						<Text style={styles.overlayPoints}>
							Puntos: {item.puntosOtorgados}
						</Text>
					</View>
				</View>

				<View style={styles.userActions}>
					<ItemButton title="Editar" onPress={() => onEdit(item)} />
					{onManageUIDs && (
						<TouchableOpacity
							style={styles.uidButton}
							onPress={() => onManageUIDs(item)}
						>
							<Ionicons
								name="qr-code-outline"
								size={20}
								color="white"
							/>
							<Text style={styles.buttonText}>UIDs</Text>
						</TouchableOpacity>
					)}
					<ItemButton
						title="Eliminar"
						onPress={() => onDelete(item.id)}
					/>
				</View>
			</Animated.View>
		);
	};

	return (
		<Animated.FlatList
			data={experiencias}
			keyExtractor={(item, i) => (item.id.toString() + i)}
			renderItem={renderItem}
			scrollEnabled={true}
			showsVerticalScrollIndicator={false}
			numColumns={width > 600 ? 2 : 1}
			columnWrapperStyle={
				width > 600 ? { justifyContent: "space-between" } : undefined
			}
			contentContainerStyle={{ paddingBottom: 80, padding: 10 }}
			onEndReachedThreshold={0.5}
			onEndReached={handleLoadMore}
		/>
	);
};

const styles = StyleSheet.create({
	expCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 3,
		marginBottom: 10
	},
	expImage: {
		width: "100%",
		height: 150,
		resizeMode: "cover",
		borderRadius: 10,
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
	overlayPoints: {
		backgroundColor: "orange",
		color: "#333",
		fontSize: 12,
		fontWeight: "500",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 6,
	},
	overlayStatus: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
		fontWeight: "700",
		fontSize: 12,
		color: "white",
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
	},
	uidButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FF6B00",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 8,
		marginRight: 10,
	},
	buttonText: {
		color: "white",
		fontWeight: "700",
		paddingLeft: 10,
	},
});

export default CategoryItem;
