import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeToggle } from "../theme/ThemeContext";

interface AlertMessageProps {
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
  onClose?: () => void;
  actions?: React.ReactNode;
  hideDefaultButton?: boolean;
}

export default function AlertMessage({
  message,
  type = "info",
  visible,
  onClose,
  actions,
  hideDefaultButton = false, 
}: AlertMessageProps) {
  const { isDark } = useThemeToggle();

  const themeOrange = "#FF6F00";
  const bgColor = isDark ? "#1e1e1e" : "#fff";
  const textColor = isDark ? "#fff" : "#000";
  const borderColor = themeOrange;

  const iconName =
    type === "success"
      ? "checkmark-circle"
      : type === "error"
      ? "alert-circle"
      : "information-circle";

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: bgColor, borderColor }]}>
          <Ionicons name={iconName} size={36} color={borderColor} style={styles.icon} />
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>

          {actions && <View style={styles.actionsContainer}>{actions}</View>}

          {!actions && !hideDefaultButton && onClose && (
            <TouchableOpacity style={[styles.okButton, { backgroundColor: themeOrange }]} onPress={onClose}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  icon: {
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  okButton: {
    marginTop: 12,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  okText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});