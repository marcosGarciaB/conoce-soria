import { useFilteredExperiences } from "@/hooks/useFilters";
import { ExperienciasResponse } from "@/services/experienceService";
import React from "react";
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, {
	SharedValue,
	useAnimatedScrollHandler,
	useSharedValue
} from "react-native-reanimated";
import { useSeekerFlatlistAnimation } from "../animations/seekerFlatlistAnimation";
import LoadingScreen from "../common/Loading";
import Filters from "./FilterDropdown";

interface DetailFlatListAnimatedProps {
	onPress: (experiencia: ExperienciasResponse) => void;
}

const { height } = Dimensions.get("screen");
const spacing = 3;
const itemSize = height * 0.72;
const itemFullSize = itemSize + spacing * 2;

const DetailFlatListAnimated: React.FC<DetailFlatListAnimatedProps> = ({
	onPress,
}) => {
	const {
		experienciasFiltradas: filteredExperiencias,
		searchText,
		selectedCat,
		setSearchText,
		setSelectedCat,
		loadMore: loadExperiencias,
		buttonFilter,
		wordsFilter,
		loading,
		hasMore,
		categories,
	} = useFilteredExperiences();

	const scrollY = useSharedValue(0);
	const onScroll = useAnimatedScrollHandler((e) => {
		scrollY.value = e.contentOffset.y / itemFullSize;
	});
	
	const Photo = ({
		item,
		index,
		scrollY,
		onPress,
	}: {
		item: ExperienciasResponse;
		index: number;
		scrollY: SharedValue<number>;
		onPress: (experiencia: ExperienciasResponse) => void;
	}) => {
		const animation = useSeekerFlatlistAnimation(index, scrollY);

		return (
			<TouchableOpacity
				activeOpacity={0.8}
				style={styles.imageContainer}
				onPress={() => onPress(item)}
			>
				<Animated.View style={animation}>
					<Animated.Image
						source={{ uri: item.imagenPortadaUrl }}
						style={[
							{
								width: "100%",
								height: itemSize - 50,
								borderRadius: 12,
							},
						]}
					/>
					<View style={styles.categoryBadge}>
						<Text style={styles.categoryText}>
							{item.categoria
								.replace("_", " ")
								.toLowerCase()
								.replace(/\b\w/g, (l) => l.toUpperCase())}
						</Text>
					</View>
					<Text style={styles.cardTitle}>{item.titulo}</Text>
				</Animated.View>
			</TouchableOpacity>
		);
	};

	const renderItem = ({
		item,
		index,
	}: {
		item: ExperienciasResponse;
		index: number;
	}) => (
		<Photo item={item} index={index} scrollY={scrollY} onPress={onPress} />
	);

	if (loading) return <LoadingScreen />;

	return (
		<Animated.FlatList
			data={filteredExperiencias}
			keyExtractor={(item) => item.id.toString()}
			renderItem={renderItem}
			showsVerticalScrollIndicator={false}
			snapToInterval={itemFullSize}
			removeClippedSubviews={true}
			onEndReached={() => loadExperiencias()}
			onEndReachedThreshold={0.5}
			decelerationRate="fast"
			scrollEventThrottle={16}
			contentContainerStyle={{
				padding: 10,
				paddingBottom: 20
			}}
			onScroll={onScroll}
			ListHeaderComponent={
				<Filters
					searchText={searchText}
					setSearchText={setSearchText}
					selectedCat={selectedCat}
					setSelectedCat={setSelectedCat}
					categories={categories}
					onFilterByText={wordsFilter}
					onFilterByCategory={buttonFilter}
				/>
			}
			ListFooterComponent={loading ? <LoadingScreen /> : null}
		/>
	);
};

const styles = StyleSheet.create({
	container: {},
	imageContainer: {
		height: itemSize,
		borderRadius: 15,
		padding: spacing,
		overflow: "hidden",
		alignSelf: "center",
		width: "100%",
		marginTop: 5,
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
		width: "100%",
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		color: "#fff",
		fontSize: 18,
		fontWeight: "700",
		textAlign: "center",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 12,
		overflow: "hidden",
		textShadowColor: "rgba(0,0,0,0.75)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 4,
	},
	categoryBadge: {
		position: "absolute",
		top: 10,
		left: 10,
		backgroundColor: "white",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
	},
	categoryText: {
		color: "black",
		fontWeight: "bold",
		fontSize: 12,
	},
});

export default DetailFlatListAnimated;
