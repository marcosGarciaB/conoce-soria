import {
	interpolate,
	SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";

export const useSeekerFlatlistAnimation = (
	index: number,
	scrollY: SharedValue<number>
) => {
	return useAnimatedStyle(() => ({
		opacity: interpolate(
			scrollY.value,
			[index - 1, index, index + 1],
			[0.5, 1, 0.5]
		),

		transform: [
			{
				scale: interpolate(
					scrollY.value,
					[index - 1, index, index + 1],
					[0.92, 1, 0.92]
				),
			},
		],
	}));
};
