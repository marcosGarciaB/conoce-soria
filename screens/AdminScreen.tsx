import AddButton from "@/components/admin/AddButton";
import CategoryItem from "@/components/admin/ExperienceItem";
import Buttom from "@/components/admin/ManageButton";
import UserItem from "@/components/admin/UserItem";
import { useAuth } from "@/contexts/AuthContext";
import { useExperiencias } from "@/contexts/ExperienceContext";
import { useRefresh } from "@/contexts/RefreshContext";
import { useUsers } from "@/contexts/UserContext";
import { useUserData } from "@/contexts/UserDataContext";
import { adminService } from "@/services/adminService";
import { ExperienciaDetailResponse } from "@/services/experienceService";
import { useIsFocused } from "@react-navigation/native";

import React, { useState } from "react";

const AdminScreen = ({ navigation }: { navigation: any }) => {
	const [showExperiencias, setShowExperiencias] = useState(false);
	const [showUsers, setShowUsers] = useState(false);
	const [buttonPressed, setButtonPressed] = useState<string>();
	const { token } = useAuth();
	const isFocused = useIsFocused();
	
	const {
		loadExperienciasDetalladas,
		hasMore: hasMoreEx,
		loading: loadingEx,
		experienciasDetalladas,
		updateExperiencia,
	} = useExperiencias();
	const { refreshExperiencias, refreshUsers, refreshTop } = useRefresh();

	const { users, loading, reloadUsers } = useUsers();
	const { user, loadUser } = useUserData();


	if (!token) return;
	// const {
	// 	data: users,
	// 	loadData: loadUsers,
	// 	loading,
	// 	hasMore,
	// } = usePaginatedFetch<UserCredentials>({
	// 	fetchFunction: (offset, limit) =>
	// 		authService.getAllUsers(token, offset, limit),
	// 	pageSize: 5,
	// });

	// useEffect(() => {
	// 	if (!token) return;
	// 	if (isFocused) {
	// 		loadUsers(true);
	// 		loadExperienciasDetalladas(true);
	// 	}
	// }, [isFocused, token]);

	const handleLoadData = (tipo: "usuarios" | "experiencias") => {
		setButtonPressed(tipo);
	};

	const handleToggleExperiencias = () => {
		setShowExperiencias(!showExperiencias);
		setShowUsers(false);
	};

	const handleToggleUsers = () => {
		setShowUsers(!showUsers);
		setShowExperiencias(false);
	};

	const handleDeleteExperience = async (id: number) => {
		try {
			await adminService.deleteExperiencia(id, token!);
			const experiencia = experienciasDetalladas.find((e) => e.id === id);
			if (experiencia) {
				updateExperiencia({ ...experiencia, activo: false });
			}
			refreshExperiencias();
		} catch (error) {
			console.error("Error eliminando experiencia", error);
		}
	};

	const handleDeleteUser = async (id: number) => {
		try {
			await adminService.deleteUser(id, token!);
			refreshUsers();
			refreshTop();
		} catch (error) {
			console.error("Error eliminando usuario", error);
		}
	};

	const handleManageUIDs = (experiencia: ExperienciaDetailResponse) => {
		navigation.navigate("ManageUIDs", { experiencia });
	};

	return (
		<>
			<Buttom
				title="Gestionar usuarios"
				onPress={() => {
					handleToggleUsers();
					handleLoadData("usuarios");
				}}
				isActive={showUsers}
			/>
			<Buttom
				title="Gestionar experiencias"
				onPress={() => {
					handleToggleExperiencias();
					handleLoadData("experiencias");
				}}
				isActive={showExperiencias}
			/>

			{showExperiencias && (
				<>
					<AddButton
						title="Añadir experiencia"
						onPress={() => navigation.navigate("ManageExperience")}
					/>
					<CategoryItem
						experiencias={experienciasDetalladas}
						onDelete={handleDeleteExperience}
						onEdit={(experiencia) =>
							navigation.navigate("ManageExperience", {
								experiencia,
							})
						}
						onManageUIDs={handleManageUIDs}
						loadMore={() => loadExperienciasDetalladas()}
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
						loadMore={() => reloadUsers()}
						hasMore={false}
						loading={loading}
					/>
				</>
			)}
		</>
	);
};

export default AdminScreen;
