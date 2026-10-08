import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

export type RatingValue = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

interface StarRatingProps {
  rating: RatingValue;
  onRatingChange: (rating: RatingValue) => void;
  maxStars?: number;
}

export const StarRatingComponent: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxStars = 5,
}) => {
  
  const handleStarPress = (starIndex: number, isHalf: boolean) => {
    const chosenValue = starIndex - (isHalf ? 0.5 : 0);
    
    // Toggle logic: If tapping the current rating, reset to 0 stars
    if (rating === chosenValue) {
      onRatingChange(0);
    } else {
      onRatingChange(chosenValue as RatingValue);
    }
  };

  // Custom visual star component made purely from View elements
  const PureVisualStar = ({ isFilled }: { isFilled: boolean }) => (
    <View style={[styles.starShape, isFilled ? styles.filledColor : styles.emptyColor]} />
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const isFull = rating >= starIndex;
        const isHalf = rating === starIndex - 0.5;

        return (
          <View key={starIndex} style={styles.starWrapper}>
            
            {/* 1. LEFT HALF STAR VISUAL */}
            <View style={styles.leftHalfVisualContainer}>
              <PureVisualStar isFilled={isFull || isHalf} />
            </View>

            {/* 2. RIGHT HALF STAR VISUAL */}
            <View style={styles.rightHalfVisualContainer}>
              <View style={styles.rightHalfShift}>
                <PureVisualStar isFilled={isFull} />
              </View>
            </View>

            {/* 3. INVISIBLE GESTURE LAYER */}
            <View style={StyleSheet.absoluteFill}>
              <View style={styles.hitboxContainer}>
                <TouchableOpacity 
                  style={styles.hitbox} 
                  onPress={() => handleStarPress(starIndex, true)} 
                />
                <TouchableOpacity 
                  style={styles.hitbox} 
                  onPress={() => handleStarPress(starIndex, false)} 
                />
              </View>
            </View>

          </View>
        );
      })}
    </View>
  );
};

const STAR_SIZE = 30;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starWrapper: {
    width: STAR_SIZE,
    height: STAR_SIZE,
    marginHorizontal: 4,
    position: 'relative',
  },
  // Basic box shape representing a star (you can style border/corners as desired)
  starShape: {
    width: STAR_SIZE,
    height: STAR_SIZE,
    borderRadius: 4, 
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  filledColor: {
    backgroundColor: '#FFD700',
  },
  emptyColor: {
    backgroundColor: 'transparent',
  },
  // Masks the right 50% of the box to render the left half
  leftHalfVisualContainer: {
    position: 'absolute',
    width: STAR_SIZE / 2,
    height: STAR_SIZE,
    overflow: 'hidden',
  },
  // Masks the left 50% of the box to render the right half
  rightHalfVisualContainer: {
    position: 'absolute',
    left: STAR_SIZE / 2,
    width: STAR_SIZE / 2,
    height: STAR_SIZE,
    overflow: 'hidden',
  },
  // Shifts the underlying shape back into alignment for the right frame mask
  rightHalfShift: {
    left: -STAR_SIZE / 2,
  },
  hitboxContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  hitbox: {
    flex: 1,
  },
});
