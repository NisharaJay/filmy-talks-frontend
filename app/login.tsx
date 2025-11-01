import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react"; // Add useEffect import
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import Logo from "../components/Logo";
import Button from "../components/Button";
import { loginRequest, clearError } from "../src/store/slices/authSlice";
import { SIZES } from '../constants/theme';
import type { RootState, AppDispatch } from "../src/store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth); // Add isAuthenticated

  // Clear Redux error when component mounts
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]); // Fixed: useEffect instead of useState

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  // Validation
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

  // Handle Login - Now using Redux Saga
  const handleLogin = () => {
    if (!validate()) return;
    
    // Dispatch login request - Saga will handle the async operation
    dispatch(loginRequest({ email, password }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Logo />
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Welcome back to Filmy Talks!</Text>

        {/* Show Redux error if any */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.reduxError}>{error}</Text>
          </View>
        )}

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
        {loading ? (
          <ActivityIndicator size="large" color="#e3720b" />
        ) : (
          <Button title="Sign In" onPress={handleLogin} />
        )}
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
  errorContainer: {
    backgroundColor: "#ffeaea",
    padding: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.medium,
    marginBottom: SIZES.spacing.lg,
  },
  reduxError: { color: "red", textAlign: "center" },
  buttonContainer: { padding: SIZES.spacing.lg, paddingBottom: SIZES.spacing.xl + 20 },
  signupContainer: { flexDirection: "row", justifyContent: "center", marginTop: SIZES.spacing.lg },
  signupText: { color: "#666", fontSize: 15 },
  signupLink: { color: "#e3720b", fontSize: 15, fontWeight: "700" },
});