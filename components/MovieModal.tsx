import { Image, Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeToggle } from "../theme/ThemeContext";
import { Movie } from "../src/services/movieService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../src/store";
import { addFavoriteRequest, removeFavoriteRequest } from "../src/store/slices/favoriteSlice";

interface MovieModalProps {
  visible: boolean;
  onClose: () => void;
  movie: Movie | null;
}

export default function MovieModal({ visible, onClose, movie }: MovieModalProps) {
  const { isDark } = useThemeToggle();
  const dispatch = useDispatch();

  // Get both favorites from favorite slice and user's favorite IDs from auth slice
  const favorites = useSelector((state: RootState) => state.favorite.favorites);
  const userFavorites = useSelector((state: RootState) => state.auth.user?.favorites || []);
  
  // Check if movie is favorite using both sources for redundancy
  const isFavorite = movie ? 
    (favorites.some(f => f._id === movie._id) || userFavorites.includes(movie._id)) 
    : false;

  const toggleFavorite = () => {
    if (!movie) return;
    if (isFavorite) {
      dispatch(removeFavoriteRequest(movie._id));
    } else {
      dispatch(addFavoriteRequest(movie._id));
    }
  };

  if (!movie) return null;

  const styles = createStyles(isDark);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<Ionicons key={i} name="star" size={20} color="#ffd700" />);
      else if (i === fullStars && hasHalfStar)
        stars.push(<Ionicons key={i} name="star-half" size={20} color="#ffd700" />);
      else stars.push(<Ionicons key={i} name="star-outline" size={20} color="#ffd700" />);
    }
    return stars;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header with Favorite and Close Buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.favoriteBtn} 
              onPress={toggleFavorite}
              accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={26}
                color={isFavorite ? "#e3720b" : (isDark ? "#fff" : "#000")}
              />
              <Text style={[styles.favoriteText, { color: isDark ? "#fff" : "#000" }]}>
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={26} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Banner Image */}
            {movie.bannerImage && (
              <Image source={{ uri: movie.bannerImage }} style={styles.banner} resizeMode="cover" />
            )}

            {/* Movie Title */}
            <Text style={styles.title}>{movie.movieName}</Text>

            {/* Release Year & Category */}
            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{movie.releaseYear}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{movie.category}</Text>
              </View>
            </View>

            {/* Rating Section */}
            {movie.rating !== undefined && (
              <View style={styles.ratingContainer}>
                <View style={styles.starsRow}>{renderStars(movie.rating)}</View>
                <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
              </View>
            )}

            {/* Description Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.desc}>{movie.description}</Text>
            </View>

            {/* Cast Section */}
            {movie.cast && movie.cast.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Cast</Text>
                <Text style={styles.desc}>
                  {Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.8)",
      justifyContent: "flex-end",
    },
    modal: {
      width: "100%",
      maxHeight: "90%",
      padding: 20,
      paddingTop: 15,
      backgroundColor: isDark ? "#1a1a1a" : "#fff",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    headerButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    closeBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      justifyContent: "center",
      alignItems: "center",
    },
    favoriteBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 22,
    },
    favoriteText: {
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 6,
    },
    banner: {
      width: "100%",
      height: 200,
      borderRadius: 15,
      marginBottom: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      marginBottom: 15,
      color: isDark ? "#fff" : "#000",
    },
    metaRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    badge: {
      backgroundColor: "rgba(227, 114, 11, 0.2)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "rgba(227, 114, 11, 0.4)",
    },
    badgeText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#e3720b",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      padding: 12,
    },
    starsRow: {
      flexDirection: "row",
      gap: 4,
      marginRight: 12,
    },
    ratingText: {
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? "#fff" : "#000",
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
      color: "#e3720b",
    },
    desc: {
      fontSize: 16,
      lineHeight: 24,
      color: isDark ? "#ccc" : "#333",
    },
  });