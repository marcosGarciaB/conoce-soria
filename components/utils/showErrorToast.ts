import Toast from "react-native-toast-message";

/**
 * Muestra un toast de error en la parte superior de la pantalla.
 *
 * Este toast:
 * - Se muestra en la posición superior (`top`) de la pantalla.
 * - Contiene un título y un mensaje detallado.
 * - Se oculta automáticamente después de 2 segundos.
 * - Ajusta su posición con un offset superior para no solaparse con la barra de estado.
 *
 * @param {string} title Título del mensaje de error que se mostrará en negrita.
 * @param {string} message Mensaje adicional que describe el error.
 */

export const showErrorToast = (title: string, message: string) => {
	Toast.show({
		type: "error",
		position: "top",
		text1: title,
		text2: message,
		visibilityTime: 2000,
		autoHide: true,
		topOffset: 60,
	});
};

export default showErrorToast;
