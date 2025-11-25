import { UserCredentials } from "@/services/adminService";
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

interface UserItemProps {
	users: UserCredentials[];
	onDelete: (email: string) => void;
	onEdit: (user: UserCredentials) => void;
}

const UserItem = ({ users, onDelete, onEdit }: UserItemProps) => {
	const url =
		"https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/recortar-bordes-imagen-r.png";

	const renderItem = ({ item }: { item: UserCredentials }) => {
		return (
			<View style={styles.userCard}>
				<View style={styles.userRow}>
					<Image source={{ uri: url }} style={styles.userImage} />
					<View style={styles.userInfo}>
						<Text style={styles.userName}>{item.nombre}</Text>
						<Text style={styles.userEmail}>{item.email}</Text>
						<Text style={styles.userRole}>Rol: {item.role}</Text>
						<Text style={styles.userPoints}>
							Puntos: {item.puntos}
						</Text>
					</View>
				</View>

				<View style={styles.userActions}>
					<ItemButton title="Editar" onPress={() => onEdit(item)} />
					<ItemButton title="Eliminar" onPress={() => onDelete(item.email)} />
				</View>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={users}
				keyExtractor={(item) => item.email}
				renderItem={renderItem}
				scrollEnabled={false}
				showsVerticalScrollIndicator={false}
				numColumns={width > 600 ? 2 : 1}
				columnWrapperStyle={
					width > 600
						? { justifyContent: "space-between" }
						: undefined
				}
				contentContainerStyle={{ paddingBottom: 40 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
	},
	userCard: {
		backgroundColor: "#F7F7F7",
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#E6E6E6",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 3,
	},
	userRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	userImage: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginRight: 15,
	},
	userInfo: {
		flex: 1,
	},
	userName: {
		fontSize: 16,
		fontWeight: "600",
	},
	userEmail: {
		fontSize: 14,
		color: "#555",
	},
	userRole: {
		fontSize: 14,
		color: "#333",
		marginTop: 4,
	},
	userPoints: {
		fontSize: 14,
		color: "#333",
		marginTop: 2,
	},
	userActions: {
		flexDirection: "row",
		marginTop: 10,
		justifyContent: "center",
	},
});

export default UserItem;
