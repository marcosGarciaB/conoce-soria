import { useRef } from "react";
import { Animated, Vibration } from "react-native";

const useShakeAnimation = () => {
	const shakeAnim = useRef(new Animated.Value(0)).current;

	const shake = () => {
		Vibration.vibrate(500);
		shakeAnim.setValue(0);

		Animated.sequence([
			Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
		]).start();
	};

	return { shakeAnim, shake };
};

export default useShakeAnimation;
