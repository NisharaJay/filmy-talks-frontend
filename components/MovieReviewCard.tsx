import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { memo, useMemo, useState } from "react";
import { useThemeToggle } from "../theme/ThemeContext";
import { Movie } from "../src/services/movieService";
import { COLORS, SIZES } from "../constants/theme";

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  onRate?: () => void;
}

function MovieCard({ movie, onPress, onRate }: MovieCardProps) {
  const { isDark } = useThemeToggle();
  const [imageError, setImageError] = useState(false);

  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const renderImage = () => {
    if (!movie.bannerImage || imageError) {
      return (
        <View style={styles.placeholderImage}>
          <Ionicons
            name="film-outline"
            size={40}
            color={isDark ? COLORS.dark.placeholder : COLORS.light.placeholder}
          />
        </View>
      );
    }

    return (
      <Image
        source={{ uri: movie.bannerImage }}
        style={styles.image}
        resizeMode="cover"
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityLabel={`View details for ${movie.movieName}`}
      accessibilityRole="button"
    >
      <View style={styles.imageContainer}>{renderImage()}</View>

      <View style={styles.details}>
        {/* Movie name */}
        <Text style={styles.name} numberOfLines={1}>
          {movie.movieName}
        </Text>

        {/* Movie year and category */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="pricetag-outline" size={14} color={COLORS.primary} />
            <Text style={styles.metaText}>{movie.category}</Text>
          </View>
        </View>

        {/* Description */}
        {movie.description && (
          <Text style={styles.description} numberOfLines={2}>
            {movie.description}
          </Text>
        )}

        {/* Rating and Rate button */}
        <View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{movie.rating?.toFixed(1) || "N/A"}</Text>
          </View>
          {onRate && (
            <TouchableOpacity style={styles.rateButton} onPress={onRate}>
              <Text style={styles.rateButtonText}>Rate</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={isDark ? COLORS.dark.placeholder : COLORS.light.textTertiary}
        style={{ alignSelf: "center", marginLeft: 5 }}
      />
    </TouchableOpacity>
  );
}

export default memo(MovieCard);

const createStyles = (isDark: boolean) => {
  const colors = isDark ? COLORS.dark : COLORS.light;

  return StyleSheet.create({
    card: {
      flexDirection: "row",
      padding: SIZES.spacing.md,
      marginVertical: SIZES.spacing.sm,
      marginHorizontal: SIZES.spacing.lg,
      backgroundColor: colors.card,
      borderRadius: SIZES.borderRadius.large,
      shadowColor: isDark ? COLORS.primary : "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? colors.cardBorder : COLORS.primary,
    },
    imageContainer: {
      width: SIZES.image.card.width,
      height: SIZES.image.card.height,
      borderRadius: SIZES.borderRadius.medium,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    placeholderImage: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.cardBorder,
      justifyContent: "center",
      alignItems: "center",
    },
    details: {
      flex: 1,
      marginLeft: SIZES.spacing.md,
      justifyContent: "center",
    },
    name: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: SIZES.spacing.sm,
      flexShrink: 1,
    },
    metaContainer: {
      flexDirection: "row",
      gap: 10,
      marginBottom: SIZES.spacing.sm,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metaText: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.primary,
    },
    description: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: SIZES.spacing.sm,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: "700",
      color: COLORS.primary,
    },
    rateButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: SIZES.borderRadius.medium,
    },
    rateButtonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
  });
};