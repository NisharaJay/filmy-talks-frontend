import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SIZES, COLORS } from "../../constants/theme";
import Header from "../../components/Header";
import { useAuth } from "../../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../src/store";
import { fetchMoviesRequest } from "../../src/store/slices/movieSlice";
import MoviePosterCard from "../../components/MoviePosterCard";
import HomeCarousel from "../../components/HomeCarousel";
import MovieModal from "../../components/UpcomingMovieModal";
import { Movie } from "../../src/services/movieService";
import { Ionicons } from "@expo/vector-icons";
import { useThemeToggle } from "../../theme/ThemeContext";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2.4;

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { movies, loading: movieLoading } = useSelector(
    (state: RootState) => state.movie
  );

  const { isDark } = useThemeToggle();

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const styles = useMemo(() => createStyles(isDark), [isDark]);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMoviesRequest());
    }
  }, [dispatch, isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const nowShowing = movies.filter((m) => m.status === "Upcoming");

  const goToNext = () => {
    if (currentIndex < nowShowing.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToOffset({
        offset: (cardWidth + 20) * newIndex,
        animated: true,
      });
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToOffset({
        offset: (cardWidth + 20) * newIndex,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Filmy Talks" />
      <HomeCarousel />
      <Text style={styles.subtitle}>
        Explore the latest movie updates, critical reviews, and emerging trends in Sri Lankan film!
      </Text>
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Upcoming Movies for you!</Text>
            <Text style={styles.movieCount}>
              {nowShowing.length} {nowShowing.length === 1 ? "movie" : "movies"} available
            </Text>
          </View>
          <Ionicons name="ticket" size={24} color={COLORS.primary} />
        </View>

        {movieLoading ? (
          <View style={styles.loadingMovies}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading movies...</Text>
          </View>
        ) : (
          <View>
            {nowShowing.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.arrowButton, styles.arrowLeft]}
                  onPress={goToPrev}
                >
                  <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.arrowButton, styles.arrowRight]}
                  onPress={goToNext}
                >
                  <Ionicons name="chevron-forward" size={26} color="#fff" />
                </TouchableOpacity>
              </>
            )}

            <FlatList
              ref={flatListRef}
              data={nowShowing}
              horizontal
              decelerationRate="fast"
              snapToAlignment="center"
              snapToInterval={cardWidth + 20}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={{ width: cardWidth, marginHorizontal: 10 }}>
                  <MoviePosterCard
                    movie={item}
                    onPress={() => {
                      setSelectedMovie(item);
                      setModalVisible(true);
                    }}
                  />
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              onScroll={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / (cardWidth + 20)
                );
                setCurrentIndex(index);
              }}
              scrollEventThrottle={16}
            />
          </View>
        )}
      </View>

      {selectedMovie && (
        <MovieModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedMovie(null);
          }}
          movie={selectedMovie}
        />
      )}
    </View>
  );
}

const createStyles = (isDark: boolean) => {
  const colors = isDark ? COLORS.dark : COLORS.light;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1 },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    loadingMovies: {
      height: 250,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: { marginTop: 10, fontSize: 14, color: colors.textSecondary },
    subtitle: {
      fontSize: 15,
      fontWeight: "400",
      padding: SIZES.spacing.xl,
      color: colors.textSecondary,
      textAlign: "center",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: SIZES.spacing.lg,
      marginTop: SIZES.spacing.md,
      marginBottom: SIZES.spacing.sm,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 10,
    },
    movieCount: { fontSize: 13, color: colors.textSecondary, marginTop: 2, marginBottom: 8 },
    arrowButton: {
      position: "absolute",
      top: 150,
      zIndex: 100,
      backgroundColor: "rgba(227, 114, 11, 0.85)",
      width: 38,
      height: 38,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    arrowLeft: { left: 5 },
    arrowRight: { right: 5 },
  });
};