import ExperienceForm from "@/components/admin/ExperienceForm";
import HeaderGeneral from "@/components/common/HeaderItem";
import { useAuth } from "@/contexts/AuthContext";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { adminService, NewExperience } from "@/services/adminService";
import { ExperienciaDetailResponse } from "@/services/experienceService";

import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type ExperienceRoute = RouteProp<RootStackParamList, "ManageExperience">;

const ManageExperienceScreen = ({
	navigation,
	route,
}: {
	navigation: any;
	route: ExperienceRoute;
}) => {
	const { token } = useAuth();
	const experiencia = route?.params?.experiencia ?? null;
	const [editingExperience, setEditingExperience] =
		useState<ExperienciaDetailResponse | null>(experiencia ?? null);
	const [experiencias, setExperiencias] = useState<
		ExperienciaDetailResponse[]
	>([]);

	const handleSubmitForm = async (
		data: NewExperience | ExperienciaDetailResponse
	) => {
		try {
			if (editingExperience) {
				const updated = await adminService.updateExperiencia(
					experiencia.id,
					data as ExperienciaDetailResponse,
					token!
				);
				setEditingExperience(updated);

				setExperiencias((prev) =>
					prev.map((u) => (u.id === updated.id ? updated : u))
				);
			} else {
				const created = await adminService.createExperiencia(
					data as NewExperience,
					token!
				);
				setExperiencias((prev) => [...prev, created]);
			}
		} catch (error) {
			console.error("Error guardando experiencia", error);
		}
	};

	return (
		<>
			<HeaderGeneral
				title="Gestión Experiencias"
				icon="map-outline"
				isSecondIcon={true}
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
			/>

			<View style={styles.container}>
				<View style={styles.formContainer}>
					<ExperienceForm
						initialData={editingExperience ?? undefined}
						onSubmit={handleSubmitForm}
						navigation={navigation}
					/>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 20
	},
	formContainer: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 10,
		margin: 10,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3,
	},
});

export default ManageExperienceScreen;
