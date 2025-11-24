import AddButton from "@/components/admin/AddButton";
import CategoryItem from "@/components/admin/CategoryItem";
import Buttom from "@/components/admin/ManageButton";
import UserItem from "@/components/admin/UserItem";
import { useAuth } from "@/contexts/AuthContext";
import { adminService, UserCredentials } from "@/services/adminService";
import {
	ExperienciaDetailResponse,
	experienciaService,
} from "@/services/experienceService";

import Header from "@/components/common/HeaderItem";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminScreen = ({ navigation }: { navigation: any }) => {
	const [showExperiencias, setShowExperiencias] = useState(false);
	const [showUsers, setShowUsers] = useState(false);
	const [experiencias, setExperiencias] = useState<
		ExperienciaDetailResponse[]
	>([]);
	const [users, setUsers] = useState<UserCredentials[]>([]);
	const { token } = useAuth();

	useEffect(() => {
		const loadExperiencias = async () => {
			try {
				const resumen = await experienciaService.getExperiencias();
				const detalles = await Promise.all(
					resumen.map((exp) =>
						experienciaService.getExperiencia(exp.id)
					)
				);

				setExperiencias(detalles);
			} catch (error) {
				console.error("Error cargando las experiencias:", error);
			}
		};

		const loadUsers = async () => {
			if (!token) return;
			try {
				const allUsers = await adminService.getAllUsers(token);
				setUsers(allUsers);
			} catch (error) {
				console.error("Error cargando los usuarios:", error);
			}
		};

		loadUsers();
		loadExperiencias();
	}, []);

	const handleToggleExperiencias = () => {
		setShowExperiencias(!showExperiencias);
	};

	const handleToggleUsers = () => {
		setShowUsers(!showUsers);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header title="Administración" icon="accessibility-outline" />

			<ScrollView>
				<View style={styles.adminCard}>
					<Text style={styles.adminTitle}>
						Panel de Administración
					</Text>

					<Buttom
						title="Gestionar usuarios"
						onPress={handleToggleUsers}
						isActive={showUsers}
					/>

					<Buttom
						title="Gestionar experiencias"
						onPress={handleToggleExperiencias}
						isActive={showExperiencias}
					/>
				</View>

				{showExperiencias && (
					<>
						<AddButton
							title="Añadir experiencia"
							onPress={() => navigation.navigate("AddUser")}
						/>

						<CategoryItem experiencias={experiencias} />
					</>
				)}

				{showUsers && (
					<>
						<AddButton
							title="Añadir usuario"
							onPress={() => navigation.navigate("AddUser")}
						/>
						<UserItem
							users={users}
							token={token!}
							onDelete={async (email) => {
								try {
									await adminService.deleteUser(
										email,
										token!
									);
									setUsers((preview) =>
										preview.filter(
											(user) => user.email !== email
										)
									);
								} catch (error) {
									console.error(
										"Error eliminando usuario",
										error
									);
								}
							}}
						/>
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
		padding: 5,
	},
	// Admin
	adminCard: {
		marginTop: 10,
		backgroundColor: "white",
		paddingVertical: 25,
		paddingHorizontal: 20,
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 3,
		borderColor: "#929190ff",
		borderWidth: 2,
	},
	adminTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 20,
		alignSelf: "center",
		letterSpacing: 0.5,
	},
});

export default AdminScreen;
