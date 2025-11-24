import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableWithoutFeedback } from "react-native";

interface TabButtonProps {
	iconName: keyof typeof Ionicons.glyphMap;
	focused: boolean;
	onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
	iconName,
	focused,
	onPress,
}) => {
	const scaleAnim = useRef(new Animated.Value(0)).current;
	const opacityAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(scaleAnim, {
				toValue: focused ? 1 : 0,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(opacityAnim, {
				toValue: focused ? 1 : 0,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start();
	}, [focused]);

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<Animated.View style={styles.container}>
				<Animated.View
					style={[
						styles.background,
						{
							transform: [{ scale: scaleAnim }],
							opacity: opacityAnim,
						},
					]}
				/>
				<Ionicons
					name={iconName}
					size={28}
					color={focused ? "#FF6B00" : "gray"}
				/>
			</Animated.View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 70,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
	},
	background: {
		position: "absolute",
		width: 70,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#faebd7ff",
	},
});

export default TabButton;
