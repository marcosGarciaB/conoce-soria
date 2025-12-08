import Header from "@/components/common/HeaderItem";
import LoadingScreen from "@/components/common/Loading";
import QRModal from "@/components/modals/ModalQR";
import GenerateUIDSection from "@/components/uid/GenerateUID";
import UIDList from "@/components/uid/UIDList";
import showErrorToast from "@/components/utils/showErrorToast";
import showSuccesToast from "@/components/utils/showSuccesToast";
import { useAuth } from "@/contexts/AuthContext";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { adminService, ExperienciaUIDDTO } from "@/services/adminService";
import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

type ManageUIDsRoute = RouteProp<RootStackParamList, "ManageUIDs">;

interface ManageUIDsScreenProps {
	navigation: any;
	route: ManageUIDsRoute;
}

const ManageUIDsScreen = ({ navigation, route }: ManageUIDsScreenProps) => {
	const { experiencia } = route.params;
	const { token } = useAuth();
	const [uids, setUids] = useState<ExperienciaUIDDTO[]>([]);
	const [loading, setLoading] = useState(false);
	const [generating, setGenerating] = useState(false);
	const [cantidad, setCantidad] = useState("1");
	const [qrModalVisible, setQrModalVisible] = useState(false);
	const [selectedQR, setSelectedQR] = useState<string | null>(null);
	const [loadingQR, setLoadingQR] = useState(false);

	useEffect(() => {
		if (token) loadUIDs();
	}, [token]);

	const loadUIDs = async () => {
		if (!token) return;
		setLoading(true);
		try {
			const data = await adminService.getUIDs(experiencia.id, token);
			setUids(data);
		} catch (error) {
			console.error("Error al cargar UIDs:", error);
			showErrorToast("Error", "No se pudieron cargar los UIDs");
		} finally {
			setLoading(false);
		}
	};

	const handleGenerarUIDs = async () => {
		if (!token) return;
		const cantidadNum = parseInt(cantidad, 10);
		if (isNaN(cantidadNum) || cantidadNum < 1 || cantidadNum > 100) {
			showErrorToast("Error", "La cantidad debe estar entre 1 y 100");
			return;
		}

		setGenerating(true);
		try {
			await adminService.generarUIDs(experiencia.id, cantidadNum, token);
			showSuccesToast(
				"Éxito",
				`Se generaron ${cantidadNum} UID(s) correctamente`
			);
			setCantidad("1");
			await loadUIDs();
		} catch (error) {
			console.error("Error al generar UIDs:", error);
			showErrorToast("Error", "No se pudieron generar los UIDs");
		} finally {
			setGenerating(false);
		}
	};

	const handleVerQR = async (uidId: string) => {
		if (!token) return;
		setLoadingQR(true);
		setQrModalVisible(true);
		try {
			const response = await adminService.getQRCode(uidId, token);
			setSelectedQR(response.qrCode);
		} catch (error) {
			console.error("Error al obtener QR:", error);
			showErrorToast("Error", "No se pudo obtener el código QR");
			setQrModalVisible(false);
		} finally {
			setLoadingQR(false);
		}
	};

	if (!token) return <LoadingScreen />;

	return (
		<>
			<Header
				title={`UIDs - ${experiencia.titulo}`}
				icon="qr-code-outline"
				isSecondIcon
				icon2="chevron-back"
				onPress={() => navigation.goBack()}
			/>

			<GenerateUIDSection
				cantidad={cantidad}
				onChangeCantidad={setCantidad}
				onGenerar={handleGenerarUIDs}
				generating={generating}
			/>

			<UIDList uids={uids} loading={loading} onPressQR={handleVerQR} />

			<QRModal
				visible={qrModalVisible}
				qrCode={selectedQR}
				loading={loadingQR}
				onClose={() => {
					setQrModalVisible(false);
					setSelectedQR(null);
				}}
			/>
		</>
	);
};

export default ManageUIDsScreen;
