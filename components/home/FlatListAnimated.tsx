import { useHorizontalFlatlistAnimation } from "@/components/animations/horizontalFlatlistAnimation";
import { ExperienciasResponse } from "@/services/experienceService";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
	useAnimatedScrollHandler,
	useSharedValue,
} from "react-native-reanimated";
import LoadingScreen from "../common/Loading";

const { width } = Dimensions.get("screen");
const imageWidth = width * 0.95;
const imageHeight = imageWidth * 0.85;
const spacing = 12;

interface FlatListAnimatedProps {
	experiencias: ExperienciasResponse[];
	loadExperiencias: () => Promise<void>;
	loading: boolean;
	hasMore: boolean;
}

const FlatListAnimated = ({
	experiencias,
	loadExperiencias,
	loading,
	hasMore,
}: FlatListAnimatedProps) => {
	const scrollX = useSharedValue(0);

	const onScroll = useAnimatedScrollHandler({
		onScroll: (e) => {
			scrollX.value = e.contentOffset.x / (imageWidth + spacing);
		},
	});

	const handleLoadMore = () => {
		if (!loading && hasMore) {
			loadExperiencias();
		}
	};

	const Photo = ({
		item,
		index,
	}: {
		item: ExperienciasResponse;
		index: number;
	}) => {
		const animation = useHorizontalFlatlistAnimation(index, scrollX);

		return (
			<View style={styles.shadowContainer}>
				<View style={styles.imageContainer}>
					<Animated.Image
						source={{ uri: item.imagenPortadaUrl }}
						style={[{ flex: 1 }, animation]}
					/>
					<Text style={styles.cardTitle}>{item.titulo}</Text>
				</View>
			</View>
		);
	};

	const renderItem = ({
		item,
		index,
	}: {
		item: ExperienciasResponse;
		index: number;
	}) => <Photo item={item} index={index} />;

	return (
		<View style={styles.container}>
			<Animated.FlatList
				data={experiencias}
				keyExtractor={(item, i) => item.id.toString() + i}
				horizontal
				renderItem={renderItem}
				snapToInterval={imageWidth + spacing}
				style={{ flexGrow: 0 }}
				decelerationRate="fast"
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				onEndReachedThreshold={0.5}
				contentContainerStyle={{
					gap: spacing,
					paddingHorizontal: (width - imageWidth) / 2,
					paddingTop: 15,
					paddingBottom: 20,
				}}
				onScroll={onScroll}
				scrollEventThrottle={16}
				onEndReached={handleLoadMore}
				ListFooterComponent={loading ? <LoadingScreen /> : null}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		alignContent: "center",
		justifyContent: "center",
	},
	shadowContainer: {
		width: imageWidth,
		height: imageHeight,
		borderRadius: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.05,
		shadowRadius: 20,
		elevation: 12,
		backgroundColor: "transparent",
		marginTop: 10,
		marginBottom: 10,
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

export default FlatListAnimated;
