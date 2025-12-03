import { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

export const useHorizontalFlatlistAnimation = (index: number, scrollX: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(
                    scrollX.value,
                    [index - 1, index, index + 1],
                    [1.4, 1, 1.4]
                ),
            },
            {
                rotate: `${interpolate(
                    scrollX.value,
                    [index - 1, index, index + 1],
                    [5, 0, -5]
                )}deg`,
            },
        ],
    }));
};
