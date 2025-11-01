import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store, persistor } from "../src/store";
import { PersistGate } from "redux-persist/integration/react";
import { AppThemeProvider } from "../theme/ThemeContext";
import { View, Text } from "react-native";
import AppInitializer from "../components/AppInitializer";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Loading...</Text>
          </View>
        }
        persistor={persistor}
      >
        <AppThemeProvider>
          <AppInitializer>
            <Stack screenOptions={{ headerShown: false }} />
          </AppInitializer>
        </AppThemeProvider>
      </PersistGate>
    </Provider>
  );
}