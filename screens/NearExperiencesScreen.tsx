import HeaderGeneral from "@/components/common/HeaderItem";
import Empty from "@/components/nearExperiences/Empty";
import NearExperienceItem from "@/components/nearExperiences/NearExperiencesList";
import PermissionGranted from "@/components/nearExperiences/PermissionGranted";
import {
	ExperienceWithDistance,
	useNearExperiences,
} from "@/hooks/useNearExperiences";
import { ExperienciasResponse } from "@/services/experienceService";
import React from "react";
import Animated from "react-native-reanimated";

const NearExperiencesListScreen = ({ navigation }: { navigation: any }) => {
	const { nearExperiences, loading, permissionGranted } =
		useNearExperiences();

	if (loading || nearExperiences.length === 0)
		return <Empty loading={loading} onPress={() => navigation.goBack()} />;
	if (!permissionGranted)
		return <PermissionGranted onPress={() => navigation.goBack()} />;

	const handleExperiencePress = (experience: ExperienceWithDistance) => {
		const experiencia: ExperienciasResponse = {
			id: experience.id,
			categoria: experience.categoria,
			imagenPortadaUrl: experience.imagenPortadaUrl,
			titulo: experience.titulo,
		};
		navigation.navigate("Details", { experiencia });
	};

	return (
		<>
			<HeaderGeneral
				title="Experiencias cercanas"
				isSecondIcon={true}
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
			/>
			<Animated.FlatList
				data={nearExperiences}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item, index }) => (
					<NearExperienceItem
						item={item}
						index={index}
						onPress={handleExperiencePress}
					/>
				)}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
			/>
		</>
	);
};

export default NearExperiencesListScreen;
