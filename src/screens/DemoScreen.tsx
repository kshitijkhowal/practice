import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StarRatingComponent, RatingValue } from '../components/StarRatingComponent';

const DemoScreen = () => {
  const [rating, setRating] = useState<RatingValue>(0); 

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Rating: {rating} / 5</Text>
      
      <StarRatingComponent 
        rating={rating} 
        onRatingChange={(newValue) => setRating(newValue)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  label: { marginBottom: 16, fontSize: 18, fontWeight: 'bold' }
});

export default DemoScreen;
