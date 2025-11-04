import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../src/store";
import { fetchMoviesRequest } from "../../src/store/slices/movieSlice";
import MovieCard from "../../components/MovieCard";
import MovieModal from "../../components/MovieModal";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import { useThemeToggle } from "../../theme/ThemeContext";
import { COLORS, SIZES } from "../../constants/theme";
import { Movie } from "../../src/services/movieService";

type CategoryType = "Past" | "Now Showing" | "Upcoming";
const CATEGORIES: CategoryType[] = ["Past", "Now Showing", "Upcoming"];

export default function Movies() {
  const { isDark } = useThemeToggle();
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error } = useSelector((state: RootState) => state.movie);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryType>("Now Showing");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchMoviesRequest());
  }, [dispatch]);

  const filteredMovies = useMemo(() => {
    return movies.filter(
      (m) =>
        m.status === category &&
        m.movieName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, category, movies]);

  const handleMoviePress = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => setModalVisible(false), []);
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={60} color={COLORS.primary} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchMoviesRequest())}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {/* Header, Search Bar, Categories */}
      <View style={styles.header}>
        <Text style={styles.heading}>Movies</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={isDark ? COLORS.dark.placeholder : COLORS.light.placeholder} style={styles.searchIcon} />
        <TextInput
          style={styles.search}
          placeholder="Search movies..."
          placeholderTextColor={isDark ? COLORS.dark.placeholder : COLORS.light.placeholder}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color={isDark ? COLORS.dark.placeholder : COLORS.light.placeholder} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryBtn, category === cat && styles.categoryActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Movie List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} onPress={() => handleMoviePress(movie)} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="film-outline" size={60} color={isDark ? COLORS.dark.placeholder : COLORS.light.placeholder} />
            <Text style={styles.emptyText}>{search ? "No movies match your search" : "No movies found"}</Text>
          </View>
        )}
      </ScrollView>

      {/* Movie Modal */}
      <MovieModal visible={modalVisible} movie={selectedMovie} onClose={handleModalClose} />
    </View>
  );
}

const createStyles = (isDark: boolean) => {
  const colors = isDark ? COLORS.dark : COLORS.light;
  return StyleSheet.create({
    container: { flex: 1, paddingTop: 50, backgroundColor: colors.background },
    centered: { justifyContent: "center", alignItems: "center" },
    header: { flexDirection: "row", marginTop: SIZES.spacing.xl, marginBottom: SIZES.spacing.xl, paddingHorizontal: SIZES.spacing.lg },
    heading: { fontSize: 28, fontWeight: "700", color: colors.text },
    headerIcon: { marginLeft: SIZES.spacing.md },
    searchContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: SIZES.spacing.lg, marginBottom: SIZES.spacing.xl, backgroundColor: colors.card, borderRadius: SIZES.borderRadius.medium, paddingHorizontal: SIZES.spacing.md, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: colors.cardBorder },
    searchIcon: { marginRight: SIZES.spacing.sm },
    search: { flex: 1, height: 45, fontSize: 16, color: colors.text },
    categories: { flexDirection: "row", justifyContent: "center", marginBottom: SIZES.spacing.lg, gap: SIZES.spacing.md },
    categoryBtn: { paddingHorizontal: SIZES.spacing.xl, paddingVertical: SIZES.spacing.md, borderRadius: 20, borderWidth: 2, borderColor: COLORS.primary, backgroundColor: "transparent" },
    categoryActive: { backgroundColor: COLORS.primary },
    categoryText: { color: COLORS.primary, fontWeight: "700", fontSize: 15 },
    categoryTextActive: { color: "#fff" },
    scrollContent: { paddingBottom: 100 },
    emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100 },
    emptyText: { fontSize: 18, color: colors.textSecondary, marginTop: SIZES.spacing.lg, fontWeight: "600" },
    loadingText: { fontSize: 16, color: colors.textSecondary, marginTop: SIZES.spacing.lg },
    errorText: { fontSize: 16, color: colors.textSecondary, marginTop: SIZES.spacing.lg, textAlign: "center", paddingHorizontal: SIZES.spacing.xl },
    retryButton: { marginTop: SIZES.spacing.xl, backgroundColor: COLORS.primary, paddingHorizontal: SIZES.spacing.xl, paddingVertical: SIZES.spacing.md, borderRadius: SIZES.borderRadius.medium },
    retryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  });
};
