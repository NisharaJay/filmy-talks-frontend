import { createContext, useContext, useState, useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeToggleContext = createContext({
  toggleTheme: () => {},
  isDark: false,
});

export function AppThemeProvider({ children }: any) {
  const [isDark, setIsDark] = useState(false);

  // Load theme from storage on app start
  useEffect(() => {
    AsyncStorage.getItem("theme").then((value) => {
      if (value === "dark") setIsDark(true);
    });
  }, []);

  // Toggle and save theme
  const toggleTheme = () => {
    const newState = !isDark;
    setIsDark(newState);
    AsyncStorage.setItem("theme", newState ? "dark" : "light");
  };

  return (
    <ThemeToggleContext.Provider value={{ toggleTheme, isDark }}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}

export const useThemeToggle = () => useContext(ThemeToggleContext);
