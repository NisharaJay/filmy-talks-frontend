// screens/Profile.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  AppState,
  AppStateStatus,
} from "react-native";
import { useThemeToggle } from "../../theme/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SIZES } from "../../constants/theme";
import { logout } from "../../src/store/slices/authSlice";
import { RootState, AppDispatch } from "../../src/store";
import { Movie } from "../../src/services/movieService";
import MovieModal from "../../components/MovieModal";
import FavoritesCarousel from "../../components/FavoritesCarousel";
import { fetchFavoritesRequest } from "../../src/store/slices/favoriteSlice";
import AlertMessage from "../../components/AlertMessage";

export default function Profile() {
  const { toggleTheme, isDark } = useThemeToggle();
  const dispatch = useDispatch<AppDispatch>();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { favorites, loading: favLoading, error } = useSelector(
    (state: RootState) => state.favorite
  );

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const initialMountRef = useRef(true);
  const appStateRef = useRef(AppState.currentState);
  const hasFetchedRef = useRef(false);

  // Fetch favorites on mount
  useEffect(() => {
    if (initialMountRef.current && isAuthenticated && user) {
      dispatch(fetchFavoritesRequest());
      initialMountRef.current = false;
    }
  }, [isAuthenticated, user, dispatch]);

  // Fetch favorites on app foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        isAuthenticated
      ) {
        dispatch(fetchFavoritesRequest());
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => subscription.remove();
  }, [isAuthenticated, dispatch]);

  // Retry fetch if needed
  useEffect(() => {
    if (
      user &&
      favorites.length === 0 &&
      !favLoading &&
      !error &&
      !hasFetchedRef.current
    ) {
      hasFetchedRef.current = true;
      dispatch(fetchFavoritesRequest());
    }
  }, [user, favorites.length, favLoading, error, dispatch]);

  // Logout flow
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
    setShowLogoutAlert(true);
    setTimeout(() => setShowLogoutAlert(false), 3000);
    initialMountRef.current = true; // reset for next login
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f8f9fa" }]}>
      {/* Logout confirmation modal */}
      <AlertMessage
        visible={showLogoutConfirm}
        type="info"
        message="Are you sure you want to logout?"
        actions={
          <>
            <TouchableOpacity onPress={() => setShowLogoutConfirm(false)} style={{ marginRight: 12 }}>
              <Text style={{ color: "#999", fontWeight: "600", fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmLogout}>
              <Text style={{ color: "#e3720b", fontWeight: "700", fontSize: 16 }}>Logout</Text>
            </TouchableOpacity>
          </>
        }
        onClose={() => setShowLogoutConfirm(false)}
      />

      {/* Logout success modal */}
      <AlertMessage
        visible={showLogoutAlert}
        type="success"
        message="You have logged out successfully!"
        onClose={() => setShowLogoutAlert(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? "#fff" : "#211e1f" }]}>
          Profile
        </Text>
      </View>

      {/* User Info Card */}
      <View style={[styles.card, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: "#e3720b" }]}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: isDark ? "#fff" : "#211e1f" }]}>
            {user?.fullName || "User"}
          </Text>
          <Text style={[styles.userEmail, { color: isDark ? "#ccc" : "#666" }]}>
            {user?.email || "user@example.com"}
          </Text>
        </View>
      </View>

      {/* Favorites Section */}
      <View style={[styles.card, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#211e1f" }]}>
          Favorites ({favorites.length})
        </Text>

        {favLoading && favorites.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={20} color="#e3720b" />
            <Text style={{ color: isDark ? "#ccc" : "#666", marginLeft: 8 }}>
              Loading favorites...
            </Text>
          </View>
        ) : favorites.length > 0 ? (
          <FavoritesCarousel
            favorites={favorites}
            isDark={isDark}
            onSelect={(movie) => {
              setSelectedMovie(movie);
              setModalVisible(true);
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={40} color={isDark ? "#666" : "#999"} />
            <Text style={{ color: isDark ? "#ccc" : "#666", marginTop: 8 }}>
              No favorites yet.
            </Text>
          </View>
        )}
      </View>

      {/* Settings */}
      <View style={[styles.card, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name={isDark ? "moon" : "moon-outline"} size={24} color="#e3720b" />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: isDark ? "#fff" : "#211e1f" }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingSubtitle, { color: isDark ? "#ccc" : "#666" }]}>
                {isDark ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#e3720b" }}
            thumbColor="#f4f3f4"
          />
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: isDark ? "#d32f2f" : "#f44336" }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Movie Modal */}
      <MovieModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        movie={selectedMovie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.spacing.lg },
  header: { marginTop: SIZES.spacing.xl + 30, marginBottom: SIZES.spacing.xl },
  headerTitle: { fontSize: 28, fontWeight: "700" },
  card: {
    borderRadius: SIZES.borderRadius.large,
    padding: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: { alignItems: "center", marginBottom: SIZES.spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#fff" },
  userInfo: { alignItems: "center", marginBottom: SIZES.spacing.xl },
  userName: { fontSize: 24, fontWeight: "700", marginBottom: SIZES.spacing.xs },
  userEmail: { fontSize: 16, fontWeight: "400" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: SIZES.spacing.md },
  settingItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: SIZES.spacing.md },
  settingLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  settingText: { marginLeft: SIZES.spacing.md },
  settingTitle: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  settingSubtitle: { fontSize: 14, fontWeight: "400" },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: SIZES.spacing.lg, borderRadius: SIZES.borderRadius.medium, marginTop: SIZES.spacing.md },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: SIZES.spacing.sm },
  loadingContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 20 },
  emptyContainer: { alignItems: "center", justifyContent: "center", padding: 20 },
});
