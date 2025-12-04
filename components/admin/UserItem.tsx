import { UserCredentials } from "@/services/authService";
import React from "react";
import {
	Dimensions,
	FlatList,
	StyleSheet,
	Text,
	View
} from "react-native";
import ProfileAvatar from "../common/ProfilePhoto";
import ItemButton from "./ItemButton";
import StatusItem from "./StatusItem";

const { width } = Dimensions.get("window");

interface UserItemProps {
	users: UserCredentials[];
	onDelete: (id: number) => void;
	onEdit: (user: UserCredentials) => void;
	loadMore: () => void;
	hasMore: boolean;
	loading: boolean;
}

const UserItem = ({ users, onDelete, onEdit, loadMore, hasMore, loading }: UserItemProps) => {

	const renderItem = ({ item }: { item: UserCredentials }) => {
		return (
			<View style={styles.userCard}>
				<View style={styles.userRow}>
					<ProfileAvatar foto={item.fotoPerfilUrl} size={90} />

					<View style={styles.userInfo}>
						<Text style={styles.userName}>{item.nombre}</Text>
						<Text style={styles.userEmail}>{item.email}</Text>
						<Text style={styles.userRole}>Rol: {item.role}</Text>
						<Text style={styles.userPoints}>
							Puntos: {item.puntos}
						</Text>
					</View>
				</View>

				<StatusItem isActive={item.activo} />

				<View style={styles.userActions}>
					<ItemButton title="Editar" onPress={() => onEdit(item)} />
					<ItemButton title="Eliminar" onPress={() => onDelete(item.id)} />
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
				scrollEnabled={true}
				showsVerticalScrollIndicator={false}
				numColumns={width > 600 ? 2 : 1}
				columnWrapperStyle={
					width > 600
						? { justifyContent: "space-between" }
						: undefined
				}
				contentContainerStyle={{ paddingBottom: 40 }}
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
	userCard: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#E6E6E6",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 3,
	},
	userRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	userImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginRight: 15,
		// backgroundColor: "white"
	},
	userInfo: {
		flex: 1,
		marginLeft: 10,
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
