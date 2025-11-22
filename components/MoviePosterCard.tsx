import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { Movie } from "../src/services/movieService";
import { SIZES, COLORS } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useThemeToggle } from "../theme/ThemeContext";

interface Props {
  movie: Movie;
  onPress: () => void;
}

export default function MoviePosterCard({ movie, onPress }: Props) {
  const { isDark } = useThemeToggle();
  const [error, setError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          {movie.bannerImage && !error ? (
            <>
              <Image
                source={{ uri: movie.bannerImage }}
                style={styles.image}
                resizeMode="cover"
                onError={() => {
                  setError(true);
                  setImageLoading(false);
                }}
                onLoadEnd={() => setImageLoading(false)}
              />
              {imageLoading && (
                <View style={styles.imageLoadingOverlay}>
                  <Ionicons name="image-outline" size={32} color={COLORS.dark.placeholder} />
                </View>
              )}
            </>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="film-outline" size={40} color={COLORS.primary} />
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {movie.movieName}
          </Text>
          <Text style={styles.subText}>{movie.category}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (isDark: boolean) => {
  const colors = isDark ? COLORS.dark : COLORS.light;
  return StyleSheet.create({
    card: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: SIZES.borderRadius.large,
      overflow: "hidden",
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        },
        android: { elevation: 5 },
      }),
    },
    imageContainer: { width: "100%", height: 210 },
    image: { width: "100%", height: "100%" },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.card,
    },
    placeholderText: { fontSize: 12, color: colors.textSecondary },
    details: { padding: 10 },
    title: { fontSize: 16, fontWeight: "700", color: colors.text },
    subText: { fontSize: 12, color: colors.textSecondary },
    imageLoadingOverlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
