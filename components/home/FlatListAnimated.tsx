import { useHorizontalFlatlistAnimation } from "@/components/animations/horizontalFlatlistAnimation";
import { useExperiences } from "@/hooks/useLoadExperiences";
import { ExperienciasResponse } from "@/services/experienceService";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
	useAnimatedScrollHandler,
	useSharedValue
} from "react-native-reanimated";
import LoadingScreen from "../common/Loading";

const { width } = Dimensions.get("screen");
const imageWidth = width * 0.95;
const imageHeight = imageWidth * 0.85;
const spacing = 12;

const FlatListAnimated = () => {
	const { experiencias, loadExperiencias, loading, hasMore } = useExperiences();
	const scrollX = useSharedValue(0);

	const onScroll = useAnimatedScrollHandler({
		onScroll: (e) => {
			scrollX.value = e.contentOffset.x / (imageWidth + spacing);
		},
	});
	
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
					paddingTop: 15,
					paddingBottom: 35,
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
		display: 'flex',
		alignContent: 'center',
		justifyContent: 'center'
	},
	shadowContainer: {
		width:"80%",
		height: imageHeight,
		borderRadius: 18,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.35,
		shadowRadius: 20,
		elevation: 12,
		backgroundColor: "transparent",
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
