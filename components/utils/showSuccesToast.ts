import Toast from "react-native-toast-message";

/**
 * Muestra un toast de éxito en la parte superior de la pantalla.
 *
 * Este toast:
 * - Se muestra en la posición superior (`top`) de la pantalla.
 * - Contiene un título y un mensaje detallado.
 * - Se oculta automáticamente después de 2 segundos.
 * - Ajusta su posición con un offset superior para no solaparse con la barra de estado.
 *
 * @param {string} title Título del mensaje de éxito que se mostrará en negrita.
 * @param {string} message Mensaje adicional que describe el éxito.
 */

export const showSuccesToast = (title: string, message: string) => {
	Toast.show({
		type: "success",
		position: "top",
		text1: title,
		text2: message,
		visibilityTime: 2000,
		autoHide: true,
		topOffset: 60,
	});
};

export default showSuccesToast;
