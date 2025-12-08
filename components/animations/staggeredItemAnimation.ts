import { FadeIn, ZoomIn } from "react-native-reanimated";

export const useStaggeredItemAnimation = (index: number) => {
    const entering = ZoomIn
        .duration(300)
        .delay(index * 200)
        .springify()
        .damping(50);

    const fadeIn = FadeIn
        .duration(300)
        .delay(index * 10);

    return { entering, fadeIn };
};
