import ExperienceForm from "@/components/admin/ExperienceForm";
import Header from "@/components/common/HeaderItem";
import { useAuth } from "@/contexts/AuthContext";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { adminService, NewExperience } from "@/services/adminService";
import { ExperienciaDetailResponse } from "@/services/experienceService";

import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

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
				console.log(created);
			}
		} catch (error) {
			console.error("Error guardando experiencia", error);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header
				title="Gestión Experiencias"
				icon="map-outline"
				isSecondIcon={true}
				icon2="chevron-back-circle"
				onPress={() => navigation.goBack()}
			/>

			<KeyboardAwareScrollView
				contentContainerStyle={styles.formContainer}
				enableOnAndroid={true}
				extraScrollHeight={50}
				keyboardShouldPersistTaps="handled"
			>
				<ExperienceForm
					initialData={editingExperience ?? undefined}
					onSubmit={handleSubmitForm}
					navigation={navigation}
				/>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
		padding: 5,
	},
	formContainer: {
		flexGrow: 1,
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 25,
		margin: 5,
		shadowColor: "#000",
		shadowOpacity: 0.5,
		shadowRadius: 10,
		shadowOffset: { width: 1, height: 4 },
		elevation: 5,
	},
});

export default ManageExperienceScreen;
