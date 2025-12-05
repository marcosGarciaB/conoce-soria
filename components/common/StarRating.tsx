import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface Props {
  onRatingSelected: (rating: number) => void;
}

export default function StarRating({ onRatingSelected }: Props) {
  const [rating, setRating] = useState(0); 

  const handlePress = (value: number) => {
    setRating(value);        
    onRatingSelected(value); 
  };

  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((value) => (
        <TouchableOpacity key={value} onPress={() => handlePress(value)}>
          <Ionicons
            name={value <= rating ? "star" : "star-outline"}
            size={35}
            color="#FFD700"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
