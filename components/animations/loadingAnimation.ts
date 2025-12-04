import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useDotsAnimation = () => {
	const dot1 = useRef(new Animated.Value(0)).current;
	const dot2 = useRef(new Animated.Value(0)).current;
	const dot3 = useRef(new Animated.Value(0)).current;

	const animateDot = (dot: Animated.Value, delay: number) => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(dot, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
				Animated.timing(dot, { toValue: 0.2, duration: 350, useNativeDriver: true }),
			])
		).start();
	};

	useEffect(() => {
		animateDot(dot1, 0);
		animateDot(dot2, 150);
		animateDot(dot3, 300);
	}, []);

	return { dot1, dot2, dot3 };
};
