import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { memo, useMemo, useState } from "react";
import { useThemeToggle } from "../theme/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { Movie } from "../src/services/movieService";
import { COLORS, SIZES } from "../constants/theme";
import { RootState } from "../src/store";
import { addFavoriteRequest, removeFavoriteRequest } from "../src/store/slices/favoriteSlice";
import AlertMessage from "./AlertMessage";

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

function MovieCard({ movie, onPress }: MovieCardProps) {
  const { isDark } = useThemeToggle();
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");

  const favorites = useSelector((state: RootState) => state.favorite.favorites);
  const userFavorites = useSelector((state: RootState) => state.auth.user?.favorites || []);
  
  const isFavorite = favorites.some(f => f._id === movie._id) || 
                    userFavorites.includes(movie._id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavoriteRequest(movie._id));
      setAlertMessage(`Removed "${movie.movieName}" from favorites`);
      setAlertType("info");
    } else {
      dispatch(addFavoriteRequest(movie._id));
      setAlertMessage(`Added "${movie.movieName}" to favorites`);
      setAlertType("success");
    }
    setAlertVisible(true);

    // Auto-close after 2s
    setTimeout(() => setAlertVisible(false), 2000);
  };

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
    <>
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
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {movie.movieName}
            </Text>
            <TouchableOpacity 
              onPress={toggleFavorite} 
              style={styles.favoriteBtnInline}
              accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#e3720b" : isDark ? COLORS.dark.placeholder : COLORS.light.placeholder}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
              <Text style={styles.metaText}>{movie.releaseYear}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={14} color={COLORS.primary} />
              <Text style={styles.metaText}>{movie.category}</Text>
            </View>
          </View>

          {movie.description && (
            <Text style={styles.description} numberOfLines={2}>
              {movie.description}
            </Text>
          )}
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? COLORS.dark.placeholder : COLORS.light.textTertiary}
          style={{ alignSelf: "center", marginLeft: 5 }}
        />
      </TouchableOpacity>

      {/* Alert without OK button */}
      <AlertMessage
        message={alertMessage}
        type={alertType}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        hideDefaultButton={true}
      />
    </>
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
    image: { width: "100%", height: "100%" },
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
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: SIZES.spacing.sm,
    },
    name: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      flexShrink: 1,
      flex: 1,
      marginRight: SIZES.spacing.sm,
    },
    favoriteBtnInline: { padding: 4 },
    metaContainer: { marginBottom: SIZES.spacing.md },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
    metaText: { fontSize: 14, fontWeight: "600", color: COLORS.primary },
    description: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  });
};