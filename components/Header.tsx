import { Image, View, Text, StyleSheet, StatusBar } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [greeting, setGreeting] = useState("");
  const { isAuthenticated, firstName } = useAuth();

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"
    );
  }, []);

  return (
    <>
       <StatusBar
        barStyle="light-content"
        backgroundColor="#211e1f"
      />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Greeting + Name */}
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.title}>
              {isAuthenticated && firstName ? `${firstName}!` : title}
            </Text>
          </View>
          {/* Logo */}
          <View>
            <Image
              source={require("../assets/white-logo.png")}
              style={styles.logo}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#211e1f",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  greeting: {
    color: "#e3720b",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  logo: {
    width: 120,
    height: 70,
    resizeMode: "contain",
  },
});