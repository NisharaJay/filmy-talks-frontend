import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useRef } from 'react';
import { SIZES } from '../constants/theme';

export default function Button({ title, onPress }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#e3720b',
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.medium,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#e3720b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  text: { color: 'white', fontWeight: '700', fontSize: 18 },
});