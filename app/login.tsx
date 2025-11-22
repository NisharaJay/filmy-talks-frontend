import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
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
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) dispatch(clearError());
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated) router.replace("/home");
  }, [isAuthenticated, router]);

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) { newErrors.email = "Email is required"; valid = false; }
    else if (!emailRegex.test(email)) { newErrors.email = "Enter a valid email"; valid = false; }

    if (!password) { newErrors.password = "Password is required"; valid = false; }
    else if (password.length < 6) { newErrors.password = "Password must be at least 6 characters"; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (!validate()) return;
    dispatch(loginRequest({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Logo />
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Welcome back to Filmy Talks!</Text>

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
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={20} color="#999" style={{ marginRight: SIZES.spacing.sm }} />
                  <TextInput
                    style={[styles.input, focusedInput === "password" && styles.inputFocused]}
                    placeholder="Enter your Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput("")}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.error}>{errors.password}</Text>}
              </View>

              {/* Sign In Button */}
              <View style={styles.buttonContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#e3720b" />
                ) : (
                  <Button title="Sign In" onPress={handleLogin} />
                )}
              </View>

              {/* Sign Up link below the button */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Do not have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: SIZES.spacing.md },
  content: { padding: SIZES.spacing.lg, paddingTop: SIZES.spacing.xl + 20 },
  title: { fontSize: 32, fontWeight: "700", color: "#211e1f", marginBottom: SIZES.spacing.sm },
  subtitle: { fontSize: 16, color: "#666", marginBottom: SIZES.spacing.lg },
  form: { width: "100%" },
  inputContainer: { marginBottom: SIZES.spacing.lg },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f5f5ff",
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
  buttonContainer: { marginTop: SIZES.spacing.md, marginBottom: SIZES.spacing.sm },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SIZES.spacing.sm,
  },
  signupText: { color: "#666", fontSize: 15 },
  signupLink: { color: "#e3720b", fontSize: 15, fontWeight: "700" },
});