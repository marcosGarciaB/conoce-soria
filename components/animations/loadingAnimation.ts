import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useDotsAnimation = () => {
	const dot1 = useRef(new Animated.Value(0)).current;
	const dot2 = useRef(new Animated.Value(0)).current;
	const dot3 = useRef(new Animated.Value(0)).current;

    const CYCLE_DURATION = 800;
    const DOT_DURATION = 200; 
    
    const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(dot, { toValue: 0, duration: delay, useNativeDriver: true }),
                Animated.timing(dot, { toValue: 1, duration: 0, useNativeDriver: true }),
                Animated.timing(dot, { toValue: 1, duration: DOT_DURATION, useNativeDriver: true }),
                Animated.timing(dot, { toValue: 0, duration: CYCLE_DURATION - delay - DOT_DURATION, useNativeDriver: true }),
            ])
        ).start();
    };

    useEffect(() => {
        animateDot(dot1, 0); 
        animateDot(dot2, DOT_DURATION); 
        animateDot(dot3, DOT_DURATION * 2);
    }, []);

    return { dot1, dot2, dot3 };
};