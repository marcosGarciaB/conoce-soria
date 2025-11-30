import Toast from "react-native-toast-message";

export const showErrorToast = (title: string, message: string) => {
	Toast.show({
		type: "error",
		position: "top",
		text1: title,
		text2: message,
		visibilityTime: 4000,
		autoHide: true,
		topOffset: 60,
	});
};

export default showErrorToast;
