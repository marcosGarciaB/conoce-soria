import AddButton from "@/components/admin/AddButton";
import CategoryItem from "@/components/admin/CategoryItem";
import Buttom from "@/components/admin/ManageButton";
import UserItem from "@/components/admin/UserItem";
import Header from "@/components/common/HeaderItem";
import { useAuth } from "@/contexts/AuthContext";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { adminService, UserCredentials } from "@/services/adminService";
import {
	experienciaService,
	ExperienciasResponse
} from "@/services/experienceService";

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminScreen = ({ navigation }: { navigation: any }) => {
	const [showExperiencias, setShowExperiencias] = useState(false);
	const [showUsers, setShowUsers] = useState(false);
	const { token } = useAuth();

	if (!token) return;
	const { data: users, loadData: loadUsers, loading, hasMore } = usePaginatedFetch<UserCredentials>({
		fetchFunction: (offset, limit) => adminService.getAllUsers(token, offset, limit),
		pageSize: 5,
	});

	const { data: experiencias, loadData: loadExperiencias, loading: loadingEx, hasMore: hasMoreEx } = usePaginatedFetch<ExperienciasResponse>({
		fetchFunction: experienciaService.getExperiencias,
		pageSize: 5,
	});

	useEffect(() => {
		const listener = navigation.addListener("focus", () => {
			if (token) {
				loadUsers(true);
				loadExperiencias(true);
			}
		});

		return () => listener; 
	}, [navigation, token, loadUsers, loadExperiencias]);

	const handleToggleExperiencias = () =>
		setShowExperiencias(!showExperiencias);
	const handleToggleUsers = () => setShowUsers(!showUsers);

	const handleDeleteUser = async (email: string) => {
		try {
			await adminService.deleteUser(email, token!);
			loadUsers(true);
		} catch (error) {
			console.error("Error eliminando usuario", error);
		}
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
							onPress={() => navigation.navigate("AddExperience")}
						/>
						<CategoryItem experiencias={experiencias} />
					</>
				)}

				{showUsers && (
					<>
						<AddButton
							title="Añadir usuario"
							onPress={() => navigation.navigate("ManageUser")}
						/>
						<UserItem
							users={users}
							onDelete={handleDeleteUser}
							onEdit={(user) =>
								navigation.navigate("ManageUser", { user })
							}
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
