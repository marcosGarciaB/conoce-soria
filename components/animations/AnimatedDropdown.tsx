import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface AnimatedDropdownProps {
    isOpen: boolean;
    children: React.ReactNode;
    duration?: number;
    maxHeight: number;
}

const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({
    isOpen,
    children,
    duration = 700,
    maxHeight,
}) => {
    const heightAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.timing(heightAnim, {
                    toValue: maxHeight,
                    duration,
                    useNativeDriver: false,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(heightAnim, {
                    toValue: 0,
                    duration,
                    useNativeDriver: false,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [isOpen]);

    return (
        <Animated.View
            style={[styles.container, { height: heightAnim, opacity: opacityAnim }]}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
});

export default AnimatedDropdown;
