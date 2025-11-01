import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeToggle } from "../../theme/ThemeContext";

export default function TabLayout() {
  const { isDark } = useThemeToggle();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#111" : "#fff",
        },
        tabBarActiveTintColor: isDark ? "#e3720b" : "#e50914",
        tabBarInactiveTintColor: isDark ? "#bbb" : "#666",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="movies"
        options={{
          title: "Movies",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "film" : "film-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reviews"
        options={{
          title: "Reviews",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "star" : "star-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
