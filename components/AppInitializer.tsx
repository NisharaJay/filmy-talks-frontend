import { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, Text, AppState, AppStateStatus } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../src/store";
import { fetchFavoritesRequest } from "../src/store/slices/favoriteSlice";

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: authLoading, isAuthenticated } = useAuth(); 
  const [ready, setReady] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        isAuthenticated
      ) {
        console.log("App came to foreground, refreshing favorites...");
        dispatch(fetchFavoritesRequest());
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!authLoading) {
      setReady(true);
      
      if (isAuthenticated) {
        console.log("App initialized, fetching favorites...");
        dispatch(fetchFavoritesRequest());
      }
    }
  }, [authLoading, isAuthenticated, dispatch]);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <ActivityIndicator size="large" color="#e3720b" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Initializing...</Text>
      </View>
    );
  }

  return children;
}