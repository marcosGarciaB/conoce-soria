import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface HorizontalAccordionProps {
	isOpen: boolean;
	children: React.ReactNode;
	maxWidth: number;
	duration?: number;
}

const HorizontalAccordion: React.FC<HorizontalAccordionProps> = ({
	isOpen,
	children,
	maxWidth = 500,
	duration = 400,
}) => {
	const widthAnim = useRef(new Animated.Value(0)).current;
	const opacityAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(widthAnim, {
				toValue: isOpen ? maxWidth : 0,
				duration,
				useNativeDriver: false,
			}),
			Animated.timing(opacityAnim, {
				toValue: isOpen ? 1 : 0,
				duration: duration * 0.7,
				useNativeDriver: false,
			}),
		]).start();
	}, [isOpen]);

	return (
		<View style={styles.container}>
			<Animated.View
				style={[styles.dropdownContainer, { width: widthAnim }]}
			>
				<Animated.ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={{ opacity: opacityAnim }}
				>
					{children}
				</Animated.ScrollView>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
		marginVertical: 5,
	},
	arrowContainer: {
		marginRight: 8,
		backgroundColor: "white",
		padding: 5,
		borderRadius: 40,
	},
	dropdownContainer: {
		backgroundColor: "white",
		borderRadius: 40,
		overflow: "hidden",
	},
	button: {
		justifyContent: "center",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#FF6B00",
		backgroundColor: "#fff",
		marginRight: 5,
		margin: 5,
	},
	buttonSelected: {
		backgroundColor: "#FF6B00",
		borderColor: "#FF6B00",
	},
	buttonText: {
		color: "#FF6B00",
		fontWeight: "500",
	},
	buttonTextSelected: {
		color: "#fff",
	},
});

export default HorizontalAccordion;
