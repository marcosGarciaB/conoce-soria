import Toast from "react-native-toast-message";

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
