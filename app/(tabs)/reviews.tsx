import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../src/store";
import { fetchMoviesRequest } from "../../src/store/slices/movieSlice";
import MovieCard from "../../components/MovieReviewCard";
import MovieModal from "../../components/MovieReviewModal";
import AlertMessage from "../../components/AlertMessage";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useThemeToggle } from "../../theme/ThemeContext";
import { COLORS, SIZES } from "../../constants/theme";
import { Movie } from "../../src/services/movieService";
import { addReviewRequest } from "../../src/store/slices/reviewSlice";

interface LocalReview {
  fullName: string;
  rating: number;
  comment: string;
  _userId?: string;
  email?: string;
}

export default function Reviews() {
  const { isDark } = useThemeToggle();
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error } = useSelector(
    (state: RootState) => state.movie
  );
  const reviewsByMovie = useSelector(
    (state: RootState) => state.review.reviewsByMovie
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserName = currentUser?.fullName || "You";
  const token = currentUser?.token || "";

  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );

  useEffect(() => {
    dispatch(fetchMoviesRequest());
  }, [dispatch]);

  const filteredMovies = useMemo(() => {
    return movies.filter(
      (m) =>
        m.status === "Now Showing" &&
        m.movieName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, movies]);

  const handleMoviePress = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedMovie(null);
  }, []);

  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const getReviewsForMovie = (movie: Movie): LocalReview[] => {
    const backendReviews: LocalReview[] = (movie.reviews ?? []).map((rev) => ({
      fullName: rev.fullName?.trim() || rev.email?.split("@")[0] || "Anonymous",
      rating: rev.rating ?? 0,
      comment: rev.comment ?? "",
      _userId: rev._userId,
      email: rev.email,
    }));

    const localReviews = reviewsByMovie[movie._id] || [];

    const mergedReviews = [...backendReviews, ...localReviews].filter(
      (rev, index, self) =>
        index ===
        self.findIndex(
          (r) => r._userId === rev._userId || (r.email && r.email === rev.email)
        )
    );

    return mergedReviews.map((rev) => {
      if (
        currentUser &&
        (rev._userId === currentUser._id || rev.email === currentUser.email)
      ) {
        return { ...rev, fullName: `${rev.fullName} (You)` };
      }
      return rev;
    });
  };

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
        <Ionicons
          name="alert-circle-outline"
          size={60}
          color={COLORS.primary}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchMoviesRequest())}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <Text style={styles.heading}>Reviews</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={isDark ? COLORS.dark.placeholder : COLORS.light.placeholder}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.search}
          placeholder="Search movies..."
          placeholderTextColor={
            isDark ? COLORS.dark.placeholder : COLORS.light.placeholder
          }
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={
                isDark ? COLORS.dark.placeholder : COLORS.light.placeholder
              }
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onPress={() => handleMoviePress(movie)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="film-outline"
              size={60}
              color={
                isDark ? COLORS.dark.placeholder : COLORS.light.placeholder
              }
            />
            <Text style={styles.emptyText}>
              {search ? "No movies match your search" : "No movies available"}
            </Text>
          </View>
        )}
      </ScrollView>

      <MovieModal
        visible={modalVisible}
        movie={selectedMovie}
        reviews={selectedMovie ? getReviewsForMovie(selectedMovie) : []}
        onClose={handleModalClose}
        currentUser={currentUser}
        onSubmitReview={(rating, comment) => {
          if (!selectedMovie || !currentUser || !token) return;

          const newReview: LocalReview = {
            fullName: currentUserName,
            rating,
            comment,
            _userId: currentUser._id,
            email: currentUser.email,
          };

          setSelectedMovie((prev) =>
            prev
              ? ({
                  ...prev,
                  reviews: [...(prev.reviews ?? []), newReview],
                } as Movie)
              : prev
          );

          dispatch(
            addReviewRequest({
              movieId: selectedMovie._id,
              rating,
              comment,
              userName: currentUserName,
              token,
              _userId: currentUser._id,
              email: currentUser.email,
            })
          );

          setTimeout(() => {
            setAlertType("success");
            setAlertMessage(
              `Your review has been submitted as ${currentUserName}.`
            );
            setAlertVisible(true);
          }, 0);
        }}
      />

      <AlertMessage
        message={alertMessage}
        type={alertType}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const createStyles = (isDark: boolean) => {
  const colors = isDark ? COLORS.dark : COLORS.light;
  return StyleSheet.create({
    container: { flex: 1, paddingTop: 50, backgroundColor: colors.background },
    centered: { justifyContent: "center", alignItems: "center" },
    header: {
      flexDirection: "row",
      marginTop: SIZES.spacing.xl,
      marginBottom: SIZES.spacing.xl,
      paddingHorizontal: SIZES.spacing.lg,
    },
    heading: { fontSize: 28, fontWeight: "700", color: colors.text },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: SIZES.spacing.lg,
      marginBottom: SIZES.spacing.xl,
      backgroundColor: colors.card,
      borderRadius: SIZES.borderRadius.medium,
      paddingHorizontal: SIZES.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    searchIcon: { marginRight: SIZES.spacing.sm },
    search: { flex: 1, height: 45, fontSize: 16, color: colors.text },
    scrollContent: { paddingBottom: 100 },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 100,
    },
    emptyText: {
      fontSize: 18,
      color: colors.textSecondary,
      marginTop: SIZES.spacing.lg,
      fontWeight: "600",
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: SIZES.spacing.lg,
    },
    errorText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: SIZES.spacing.lg,
      textAlign: "center",
      paddingHorizontal: SIZES.spacing.xl,
    },
    retryButton: {
      marginTop: SIZES.spacing.xl,
      backgroundColor: COLORS.primary,
      paddingHorizontal: SIZES.spacing.xl,
      paddingVertical: SIZES.spacing.md,
      borderRadius: SIZES.borderRadius.medium,
    },
    retryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  });
};