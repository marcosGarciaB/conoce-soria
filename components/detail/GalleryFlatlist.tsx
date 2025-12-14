import { useHorizontalFlatlistAnimation } from "@/components/animations/horizontalFlatlistAnimation";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
	useAnimatedScrollHandler,
	useSharedValue,
} from "react-native-reanimated";
import LoadingScreen from "../common/Loading";

interface GalleryFaltistProps {
	galeriaImagenes: string[];
	loading?: boolean;
}

const { width } = Dimensions.get("screen");
const imageWidth = width * 0.75;
const imageHeight = imageWidth * 0.75;
const spacing = 12;

const GalleryFaltist = ({ galeriaImagenes, loading }: GalleryFaltistProps) => {
	const scrollX = useSharedValue(0);
	//const flatlistRef = useRef<Animated.FlatList>(null);

	const onScroll = useAnimatedScrollHandler({
		onScroll: (e) => {
			scrollX.value = e.contentOffset.x / (imageWidth + spacing);
		},
	});

	const Photo = ({ item, index }: { item: string; index: number }) => {
		const animation = useHorizontalFlatlistAnimation(index, scrollX);

		return (
			<View style={styles.shadowContainer}>
				<View style={styles.imageContainer}>
					<Animated.Image
						source={{ uri: item }}
						style={[{ flex: 1 }, animation]}
					/>
				</View>
			</View>
		);
	};

	const renderItem = ({ item, index }: { item: string; index: number }) => (
		<Photo item={item} index={index} />
	);

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<>
			<Animated.FlatList
				//ref={flatlistRef}
				data={galeriaImagenes}
				keyExtractor={(item, index) => item + index}
				renderItem={renderItem}
				horizontal
				decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
				style={{
					flexGrow: 0
				}}
				snapToInterval={imageWidth + spacing}
				snapToAlignment="center"
				contentContainerStyle={{
					gap: spacing,
					paddingHorizontal: (width - imageWidth) / 6,
				}}
				showsVerticalScrollIndicator={false}
				// onMomentumScrollEnd={(e) => {
				// 	const offset = e.nativeEvent.contentOffset.x;
				// 	const index = Math.round(offset / (imageWidth + spacing));
				// 	flatlistRef.current?.scrollToOffset({
				// 		offset: index * (imageWidth + spacing),
				// 		animated: true,
				// 	});
				// }}
				onEndReachedThreshold={0.5}
				scrollEventThrottle={16}
				onScroll={onScroll}
				ListFooterComponent={loading ? <LoadingScreen /> : null}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	shadowContainer: {
		width: imageWidth,
		height: imageHeight,
		borderRadius: 18,
	},
	imageContainer: {
		width: imageWidth,
		height: imageHeight,
		overflow: "hidden",
		borderRadius: 15,
	},
	card: {
		borderRadius: 15,
	},
	cardTitle: {
		position: "absolute",
		width: imageWidth,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		color: "#fff",
		fontSize: 15,
		fontWeight: "700",
		textAlign: "center",
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 12,
		overflow: "hidden",
	},
});

export default GalleryFaltist;
