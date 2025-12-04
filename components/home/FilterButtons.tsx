import { useFilteredExperiences } from "@/hooks/useFilters";
import { ScrollView, Text, TouchableOpacity } from "react-native";

const FilterButtons = () => {
	const { categories, selectedCat, buttonFilter } = useFilteredExperiences();

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={{ padding: 10 }}
		>
			{categories.map((cat) => (
				<TouchableOpacity
					key={cat}
					onPress={() => buttonFilter(cat)}
					style={{
						marginRight: 10,
						paddingVertical: 6,
						paddingHorizontal: 12,
						borderRadius: 20,
						backgroundColor:
							selectedCat === cat ? "#FF6B00" : "#eee",
					}}
				>
					<Text
						style={{
							color: selectedCat === cat ? "#fff" : "#333",
							fontWeight: "bold",
						}}
					>
						{cat}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

export default FilterButtons;
