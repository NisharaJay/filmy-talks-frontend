import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate any initial app loading
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#e3720b" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}