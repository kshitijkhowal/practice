import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface StarRatingProps {
  stars: number;
  value: number;
  setValue: (value: number) => void; // More flexible type than Dispatch
}

const StarRatingComponent = ({ stars, value, setValue }: StarRatingProps) => {
  // Create an array [1, 2, ..., stars] declaratively
  const starArray = Array.from({ length: stars }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {starArray.map((item) => {
        const isFilled = value >= item;

        return (
          <Pressable
            key={item}
            onPress={() => setValue(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item} out of ${stars} stars`}
            accessibilityState={{ selected: isFilled }}
          >
            <Text style={styles.star}>{isFilled ? "★" : "☆"}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Replaces horizontal flatlist behavior
  },
  star: {
    fontSize: 50,
    color: "#FFD700", // Standard gold/yellow color for stars
  },
});

export default StarRatingComponent;
