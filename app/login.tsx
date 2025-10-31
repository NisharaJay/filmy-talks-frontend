import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { loginUser } from "../src/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { SIZES } from '../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await loginUser(email, password);
      setLoading(false);

      if (response?.success && response.token) {
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({ fullName: response.user.fullName, token: response.token })
        );
        router.replace("/home");
      } else {
        alert(response.message || "Invalid login! Check your email and password.");
      }
    } catch (error) {
      setLoading(false);
      console.log("Login error:", error);
      alert("Something went wrong! Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Logo />
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Welcome back to Filmy Talks!</Text>

        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color="#999" style={{ marginRight: SIZES.spacing.sm }} />
              <TextInput
                style={[styles.input, focusedInput === "email" && styles.inputFocused]}
                placeholder="Enter your Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput("")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color="#999" style={{ marginRight: SIZES.spacing.sm }} />
              <TextInput
                style={[styles.input, focusedInput === "password" && styles.inputFocused]}
                placeholder="Enter your Password"
                placeholderTextColor="#999"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput("")}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#999" />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {loading ? <ActivityIndicator size="large" color="#e3720b" /> : <Button title="Sign In" onPress={handleLogin} />}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Do not have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: SIZES.spacing.md },
  content: { flex: 1, padding: SIZES.spacing.lg, paddingTop: SIZES.spacing.xl + 20 },
  title: { fontSize: 32, fontWeight: "700", color: "#211e1f", marginBottom: SIZES.spacing.sm },
  subtitle: { fontSize: 16, color: "#666", marginBottom: SIZES.spacing.lg },
  form: { width: "100%" },
  inputContainer: { marginBottom: SIZES.spacing.lg },
  label: { fontSize: 14, fontWeight: "600", color: "#211e1f", marginBottom: SIZES.spacing.sm },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: SIZES.borderRadius.medium,
    borderWidth: 2,
    borderColor: "#f5f5f5",
    paddingHorizontal: SIZES.spacing.md,
  },
  input: { flex: 1, padding: SIZES.spacing.lg, fontSize: 16, color: "#211e1f" },
  inputFocused: { borderColor: "#e3720b", backgroundColor: "#fff" },
  error: { color: "red", marginTop: 4, fontSize: 12 },
  buttonContainer: { padding: SIZES.spacing.lg, paddingBottom: SIZES.spacing.xl + 20 },
  signupContainer: { flexDirection: "row", justifyContent: "center", marginTop: SIZES.spacing.lg },
  signupText: { color: "#666", fontSize: 15 },
  signupLink: { color: "#e3720b", fontSize: 15, fontWeight: "700" },
});