import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { registerUser } from "../src/services/authService";
import { Feather } from "@expo/vector-icons";
import { SIZES } from "../constants/theme";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [errors, setErrors] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const validate = () => {
    let valid = true;
    const newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName) { newErrors.fullName = "Full name is required"; valid = false; }
    if (!email) { newErrors.email = "Email is required"; valid = false; }
    else if (!emailRegex.test(email)) { newErrors.email = "Enter a valid email"; valid = false; }
    if (!password) { newErrors.password = "Password is required"; valid = false; }
    else if (password.length < 6) { newErrors.password = "Password must be at least 6 characters"; valid = false; }
    if (password !== confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await registerUser(fullName, email, password);
      setLoading(false);

      if (res.token) {
        alert("Signup success");
        router.replace("/login");
      } else {
        alert(res.message || "Signup failed");
      }
    } catch {
      setLoading(false);
      alert("Server error");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Logo />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Filmy Talks</Text>

        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={20} color="#999" style={{ marginRight: SIZES.spacing.sm }} />
              <TextInput
                style={[styles.input, focusedInput === "fullName" && styles.inputFocused]}
                placeholder="Enter your First and Last Name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedInput("fullName")}
                onBlur={() => setFocusedInput("")}
              />
            </View>
            {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color="#999" style={{ marginRight: SIZES.spacing.sm }} />
              <TextInput
                style={[styles.input, focusedInput === "email" && styles.inputFocused]}
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
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color="#999" style={{ marginRight: SIZES.spacing.sm }} />
              <TextInput
                style={[styles.input, focusedInput === "password" && styles.inputFocused]}
                placeholder="Enter your password"
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

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color="#999" style={{ marginRight: SIZES.spacing.sm }} />
              <TextInput
                style={[styles.input, focusedInput === "confirmPassword" && styles.inputFocused]}
                placeholder="Confirm password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedInput("confirmPassword")}
                onBlur={() => setFocusedInput("")}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#999" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {loading ? <ActivityIndicator size="large" color="#e3720b" /> : <Button title="Sign Up" onPress={handleSignup} />}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.signupLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: SIZES.spacing.md, paddingTop: SIZES.spacing.xl + 20 },
  content: { flex: 1, padding: SIZES.spacing.lg, paddingTop: SIZES.spacing.xl },
  title: { fontSize: 32, fontWeight: "700", color: "#211e1f", marginBottom: SIZES.spacing.sm },
  subtitle: { fontSize: 16, color: "#666", marginBottom: SIZES.spacing.xl },
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
