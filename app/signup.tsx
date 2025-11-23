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
import Logo from "../components/Logo";
import Button from "../components/Button";
import { signupRequest, clearError } from "../src/store/slices/authSlice";
import { Feather } from "@expo/vector-icons";
import { SIZES } from "../constants/theme";
import type { RootState, AppDispatch } from "../src/store";
import { validateSignup } from "../src/utils/validation";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) router.replace("/home");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) dispatch(clearError());
  }, [dispatch, error]);

  const handleSignup = () => {
    const { errors: validationErrors, valid } = validateSignup({
      fullName,
      email,
      password,
      confirmPassword,
    });
    setErrors(validationErrors);
    if (!valid) return;

    dispatch(signupRequest({ fullName, email, password }));
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Filmy Talks!</Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.reduxError}>{error}</Text>
              </View>
            )}

            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="user"
                    size={20}
                    color="#999"
                    style={{ marginRight: SIZES.spacing.sm }}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === "fullName" && styles.inputFocused,
                    ]}
                    placeholder="Enter your Full Name"
                    placeholderTextColor="#999"
                    value={fullName}
                    onChangeText={setFullName}
                    onFocus={() => setFocusedInput("fullName")}
                    onBlur={() => setFocusedInput("")}
                  />
                </View>
                {errors.fullName && (
                  <Text style={styles.error}>{errors.fullName}</Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="mail"
                    size={20}
                    color="#999"
                    style={{ marginRight: SIZES.spacing.sm }}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === "email" && styles.inputFocused,
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput("")}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="lock"
                    size={20}
                    color="#999"
                    style={{ marginRight: SIZES.spacing.sm }}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === "password" && styles.inputFocused,
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput("")}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="lock"
                    size={20}
                    color="#999"
                    style={{ marginRight: SIZES.spacing.sm }}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === "confirmPassword" && styles.inputFocused,
                    ]}
                    placeholder="Confirm password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setFocusedInput("confirmPassword")}
                    onBlur={() => setFocusedInput("")}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.error}>{errors.confirmPassword}</Text>
                )}
              </View>

              {/* Sign Up Button */}
              <View style={styles.buttonContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color="#e3720b" />
                ) : (
                  <Button title="Sign Up" onPress={handleSignup} />
                )}
              </View>

              {/* Sign In Section just below the button */}
              <View style={styles.signinContainer}>
                <Text style={styles.signinText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace("/login")}>
                  <Text style={styles.signinLink}>Sign In</Text>
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
  container: {
    backgroundColor: "#fff",
    padding: SIZES.spacing.md,
  },
  content: {
    padding: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.xl + 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#211e1f",
    marginBottom: SIZES.spacing.sm,
  },
  subtitle: { fontSize: 16, color: "#666", marginBottom: SIZES.spacing.xl },
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
  buttonContainer: {
    marginTop: SIZES.spacing.md,
    marginBottom: SIZES.spacing.sm,
  },
  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SIZES.spacing.md,
  },
  signinText: { color: "#666", fontSize: 15 },
  signinLink: { color: "#e3720b", fontSize: 15, fontWeight: "700" },
});
