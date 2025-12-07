import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  value?: number;
  onChange?: (rating: number) => void;
  size?: number;
}

const RatingStars: React.FC<Props> = ({ value = 0, onChange, size = 32 }) => {
  const [rating, setRating] = useState(value);

  // Si cambia la prop value desde fuera, actualizamos el estado
  useEffect(() => {
    setRating(value);
  }, [value]);

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = rating >= star;

        return (
          <TouchableOpacity
            key={star}
            activeOpacity={0.7}
            onPress={() => {
              setRating(star);
              onChange && onChange(star);
            }}
          >
            <Ionicons
              name={isFilled ? "star" : "star-outline"}
              size={size}
              color={isFilled ? "#FFB800" : "#ccc"}
              style={styles.star}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginHorizontal: 6,
  },
});

export default RatingStars;
