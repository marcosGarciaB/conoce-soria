import showErrorToast from "@/components/utils/showErrorToast";
import showSuccesToast from "@/components/utils/showSuccesToast";
import { useAuth } from "@/contexts/AuthContext";
import { useRefresh } from "@/contexts/RefreshContext";
import { passportService } from "@/services/passportService";
import { BarcodeScanningResult, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";

/**
 * useQrScanner - Hook personalizado para manejar el escaneo de códigos QR
 * y el registro de experiencias en la aplicación.
 *
 * Este hook encapsula toda la lógica relacionada con:
 * - Solicitud y control de permisos de cámara.
 * - Escaneo de códigos QR.
 * - Manejo del modal de opinión.
 * - Registro de la experiencia en el pasaporte del usuario.
 * - Actualización de los contextos relacionados (pasaporte, top, comentarios).
 * - Manejo de errores y notificaciones (toasts).
 *
 * @param experienciaId - ID de la experiencia que se desea registrar.
 * @param navigation - Objeto de navegación de React Navigation, usado para volver atrás tras registrar.
 *
 * @returns {
 *   permission: CameraPermissionResponse | null,  // Estado actual de permisos de cámara
 *   requestPermission: () => Promise<CameraPermissionResponse>,  // Función para solicitar permisos de cámara
 *   scanned: boolean,  // Indica si ya se ha escaneado un código
 *   scannedUID: string | null,  // UID del código QR escaneado
 *   opinionModalVisible: boolean,  // Estado de visibilidad del modal de opinión
 *   opinion: string,  // Texto actual de la opinión del usuario
 *   setOpinion: (text: string) => void,  // Función para actualizar la opinión
 *   registering: boolean,  // Indica si se está registrando la experiencia
 *   handleBarCodeScanned: (result: BarcodeScanningResult) => void,  // Callback al escanear un código QR
 *   handleRegister: () => Promise<void>,  // Función para registrar la experiencia
 *   handleCloseModal: () => void,  // Función para cerrar el modal y resetear el escáner
 *   setScanned: (value: boolean) => void  // Función para actualizar el estado de escaneo
 * }
 */

export const useQrScanner = (experienciaId: number, navigation: any) => {
	const { token } = useAuth();
	const { refreshPassport, refreshTop, refreshComments } = useRefresh();

	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);
	const [scannedUID, setScannedUID] = useState<string | null>(null);
	const [opinionModalVisible, setOpinionModalVisible] = useState(false);
	const [opinion, setOpinion] = useState("");
	const [registering, setRegistering] = useState(false);

	useEffect(() => {
		if (!permission) {
			requestPermission();
		}
	}, [permission]);

	const handleBarCodeScanned = (result: BarcodeScanningResult) => {
		if (scanned) return;
		if (result.type === "qr" || result.data) {
			setScanned(true);
			setScannedUID(result.data);
			setOpinionModalVisible(true);
		}
	};

	const handleRegister = async () => {
		if (!token || !scannedUID) return;

		setRegistering(true);
		try {
			await passportService.registrar(scannedUID, opinion, token);

			refreshPassport();
			refreshTop();
			refreshComments(experienciaId);

			showSuccesToast("¡Experiencia registrada!", "La experiencia se ha añadido a tu pasaporte");

			resetScanner();
			navigation.goBack();
		} catch (error: any) {
			console.error("Error al registrar experiencia:", error);
			let errorMessage = "No se pudo registrar la experiencia";

			if (
				error?.message?.includes("ya registrada") ||
				error?.message?.includes("already")
			) {
				errorMessage = "Ya has registrado esta experiencia";
			} else if (
				error?.message?.includes("inválido") ||
				error?.message?.includes("invalid")
			) {
				errorMessage = "El código QR no es válido";
			} else if (
				error?.message?.includes("activo") ||
				error?.message?.includes("active")
			) {
				errorMessage = "Este código QR no está activo";
			}

			showErrorToast("Error", errorMessage);

			resetScanner();
		} finally {
			setRegistering(false);
		}
	};

	const resetScanner = () => {
		setOpinionModalVisible(false);
		setScanned(false);
		setScannedUID(null);
		setOpinion("");
	};

	const handleCloseModal = () => {
		resetScanner();
	};

	return {
		permission,
		requestPermission,
		scanned,
		scannedUID,
		opinionModalVisible,
		opinion,
		setOpinion,
		registering,
		handleBarCodeScanned,
		handleRegister,
		handleCloseModal,
		setScanned,
	};
};
