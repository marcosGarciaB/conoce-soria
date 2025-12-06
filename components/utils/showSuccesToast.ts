import Toast from "react-native-toast-message";

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
