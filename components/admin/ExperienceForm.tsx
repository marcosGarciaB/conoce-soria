import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { NewExperience } from "@/services/adminService";
import { ExperienciaDetailResponse } from "@/services/experienceService";
import ActiveInput from "../inputs/ActiveInput";
import CategoryInput from "../inputs/CategoryInput";
import CoordsInput from "../inputs/CoordsInput";
import DescInput from "../inputs/DescInput";
import DirectionInput from "../inputs/DirectionInput";
import GalleryImagesInput from "../inputs/GalleryImagesInput";
import ImageUrlInput from "../inputs/ImageUrlInput";
import NumberInput from "../inputs/NumberInput";
import TitleInput from "../inputs/TitleInput";
import ModalSuccess from "../modals/ModalSucces";

interface ExperienceFormProps {
	initialData?: ExperienciaDetailResponse;
	onSubmit: (data: NewExperience) => void;
	navigation: any;
}

const ExperienceForm = ({
	initialData,
	onSubmit,
	navigation,
}: ExperienceFormProps) => {
	const [showSuccess, setShowSuccess] = useState(false);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<NewExperience>({
		defaultValues: {
			titulo: "",
			descripcion: "",
			categoria: "AIRE_LIBRE",
			imagenPortadaUrl: "",
			galeriaImagenes: [],
			direccion: "",
			ubicacionLat: 0,
			ubicacionLng: 0,
			puntosOtorgados: 0,
			activo: true,
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				titulo: initialData.titulo,
				descripcion: initialData.descripcion,
				categoria: initialData.categoria,
				imagenPortadaUrl: initialData.imagenPortadaUrl,
				galeriaImagenes: initialData.galeriaImagenes || [],
				direccion: initialData.direccion,
				ubicacionLat: initialData.ubicacionLat,
				ubicacionLng: initialData.ubicacionLng,
				puntosOtorgados: initialData.puntosOtorgados || 0,
				activo: initialData.activo ?? true,
			});
		}
	}, [initialData]);

	const submitHandler = (data: NewExperience) => {
		onSubmit(data);
		setShowSuccess(true);
	};

	return (
		<KeyboardAwareScrollView
			enableOnAndroid={true}
			extraScrollHeight={50}
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
		>
			<TitleInput control={control} errors={errors} />
			<DescInput control={control} errors={errors} />
			<CategoryInput control={control} errors={errors} />
			<ImageUrlInput control={control} errors={errors} />
			<GalleryImagesInput control={control} errors={errors} />
			<DirectionInput control={control} errors={errors} />
			<CoordsInput control={control} errors={errors} isLat={true} />
			<CoordsInput control={control} errors={errors} />
			<NumberInput control={control} errors={errors} />
			<ActiveInput control={control} errors={errors} />

			<TouchableOpacity
				style={styles.submitButton}
				onPress={handleSubmit(submitHandler)}
			>
				<Text style={styles.submitText}>
					{initialData
						? "Actualizar Experiencia"
						: "Crear Experiencia"}
				</Text>
			</TouchableOpacity>

			<ModalSuccess
				title={
					initialData
						? "¡Experiencia actualizada!"
						: "¡Experiencia creada!"
				}
				message={
					initialData
						? "La experiencia se ha actualizado correctamente."
						: "La experiencia se ha creado correctamente."
				}
				isVisible={showSuccess}
				onClose={() => {
					setShowSuccess(false);
					navigation.goBack();
				}}
			/>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	submitButton: {
		backgroundColor: "#FF6B00",
		paddingVertical: 14,
		borderRadius: 12,
		marginTop: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
	},
	submitText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
		letterSpacing: 0.5,
	},
});

export default ExperienceForm;
