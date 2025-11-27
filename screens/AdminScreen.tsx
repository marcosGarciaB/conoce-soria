import AddButton from "@/components/admin/AddButton";
import CategoryItem from "@/components/admin/CategoryItem";
import Buttom from "@/components/admin/ManageButton";
import UserItem from "@/components/admin/UserItem";
import Header from "@/components/common/HeaderItem";
import { useAuth } from "@/contexts/AuthContext";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { adminService } from "@/services/adminService";
import { authService, UserCredentials } from "@/services/authService";
import {
	ExperienciaDetailResponse
} from "@/services/experienceService";
import { useIsFocused } from "@react-navigation/native";

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminScreen = ({ navigation }: { navigation: any }) => {
	const [showExperiencias, setShowExperiencias] = useState(false);
	const [showUsers, setShowUsers] = useState(false);
	const [buttonPressed, setButtonPressed] = useState<string>();
	const { token } = useAuth();
	const isFocused = useIsFocused();
	const isFirstRender = useRef(true);

	if (!token) return;
	const { data: users, loadData: loadUsers, loading, hasMore } = usePaginatedFetch<UserCredentials>({
		fetchFunction: (offset, limit) => authService.getAllUsers(token, offset, limit),
		pageSize: 5,
	});

	const { data: experiencias, loadData: loadExperiencias, loading: loadingEx, hasMore: hasMoreEx } = usePaginatedFetch<ExperienciaDetailResponse>({
		fetchFunction: (offset, limit) => adminService.getAllExperiencesAdmin(token, offset, limit),
		pageSize: 5,
	});

	useEffect(() => {
		const handleLoadChange = async () => {
			if (isFocused) {
				loadUsers(true);
				loadExperiencias(true);
			}
		}
		handleLoadChange();
	}, [isFocused]);


	const handleLoadData = (tipo: "usuarios" | "experiencias") => {
		setButtonPressed(tipo);
	}

	const handleToggleExperiencias = () => {
		setShowExperiencias(!showExperiencias);
		setShowUsers(false);
	}
	
	const handleToggleUsers = () => {
		setShowUsers(!showUsers);
		setShowExperiencias(false);
	};

	const handleDeleteExperience = async (id: number) => {
		try {
			await adminService.deleteExperiencia(id, token!);
			loadExperiencias(true)
		} catch (error) {
			console.error("Error eliminando experiencia", error);
		}
	};

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

				<Buttom
					title="Gestionar usuarios"
					onPress={() => { handleToggleUsers(); handleLoadData("usuarios") }}
					isActive={showUsers}
				/>
				<Buttom
					title="Gestionar experiencias"
					onPress={() => { handleToggleExperiencias(); handleLoadData("experiencias") }}
					isActive={showExperiencias}
				/>

			{showExperiencias && (
				<>
					<AddButton
						title="Añadir experiencia"
						onPress={() => navigation.navigate("ManageExperience")}
					/>
					<CategoryItem
						experiencias={experiencias}
						onDelete={handleDeleteExperience}
						onEdit={(experiencia) => navigation.navigate("ManageExperience", { experiencia })}
						loadMore={() => loadExperiencias()}
						hasMore={hasMoreEx}
						loading={loadingEx}
					/>
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
						loadMore={() => loadUsers()}
						hasMore={hasMoreEx}
						loading={loadingEx}
					/>
				</>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
		padding: 5,
		marginBottom: "15%"
	},
});

export default AdminScreen;
