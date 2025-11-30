import { useExperiences } from "@/hooks/useLoadExperiences";
import { ExperienciasResponse } from "@/services/experienceService";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import LoadingScreen from "../common/Loading";

const { width } = Dimensions.get("screen");
const url =
	"https://hips.hearstapps.com/hmg-prod/images/castillo-manzanares-el-real-1636196825.jpg?resize=980:*";
const imageWidth = width * 0.75;
const imageHeight = imageWidth * 0.75;
const spacing = 10;

const FlatListAnimated = () => {
	const { experiencias, loadExperiencias, loading, hasMore } =
		useExperiences();

	const scrollX = useSharedValue(0);

	const onScroll = useAnimatedScrollHandler({
		onScroll: (e) => {
			scrollX.value = e.contentOffset.x / (imageWidth + spacing);
		},
	});

	const Photo = ({
		item,
		index,
		scrollX,
	}: {
		item: ExperienciasResponse;
		index: number;
		scrollX: SharedValue<number>;
	}) => {
		const animation = useAnimatedStyle(() => ({
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

		return (
			<View style={styles.imageContainer}>
				<Animated.Image
					source={{ uri: url }}
					style={[{ flex: 1 }, animation]}
				/>
				<Text style={styles.cardTitle}>{item.titulo}</Text>
			</View>
		);
	};

	const renderItem = ({
		item,
		index,
	}: {
		item: ExperienciasResponse;
		index: number;
	}) => <Photo item={item} index={index} scrollX={scrollX} />;

	return (
		<View style={styles.container}>
			<Animated.FlatList
				data={experiencias}
				keyExtractor={(item) => item.id.toString()}
				horizontal
				renderItem={renderItem}
				snapToInterval={imageWidth + spacing}
				style={{ flexGrow: 0 }}
				decelerationRate="fast"
				onEndReached={() => loadExperiencias()}
				showsVerticalScrollIndicator={false}
				onEndReachedThreshold={0.5}
				contentContainerStyle={{
					gap: spacing,
					paddingHorizontal: (width - imageWidth) / 2,
				}}
				onScroll={onScroll}
				scrollEventThrottle={16}
				ListFooterComponent={loading ? <LoadingScreen /> : null}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 30,
		marginBottom: 30,
	},
	imageContainer: {
		width: imageWidth,
		height: imageHeight,
		overflow: "hidden",
		borderRadius: 15,
	},
	card: {
		borderRadius: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 4,
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
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 4,
	},
});

export default FlatListAnimated;
