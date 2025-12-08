import Toast from "react-native-toast-message";

/**
 * Muestra un toast de información en la parte superior de la pantalla.
 *
 * Este toast:
 * - Se muestra en la posición superior (`top`) de la pantalla.
 * - Contiene un título y un mensaje detallado.
 * - Se oculta automáticamente después de 2 segundos.
 * - Ajusta su posición con un offset superior para no solaparse con la barra de estado.
 *
 * @param {string} title Título del mensaje de información que se mostrará en negrita.
 * @param {string} message Mensaje adicional que describe la información.
 */

export const showInfoToast = (title: string, message: string) => {
	Toast.show({
		type: "info",
		position: "top",
		text1: title,
		text2: message,
		visibilityTime: 2000,
		autoHide: true,
		topOffset: 60,
	});
};

export default showInfoToast;
