import React, { useState, useMemo, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeToggle } from "../theme/ThemeContext";
import { Movie } from "../src/services/movieService";
import AlertMessage from "./AlertMessage";

interface Review {
  fullName: string;
  rating: number;
  comment: string;
  _userId?: string;
  email?: string;
}

interface MovieModalProps {
  visible: boolean;
  onClose: () => void;
  movie: Movie | null;
  reviews: Review[];
  onSubmitReview: (rating: number, review: string) => void;
  currentUser?: {
    _id?: string;
    email?: string;
    fullName?: string;
  } | null;
}

export default function MovieModal({
  visible,
  onClose,
  movie,
  reviews,
  onSubmitReview,
  currentUser,
}: MovieModalProps) {
  const { isDark } = useThemeToggle();
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );

  const alertTimeoutRef = useRef<number | null>(null);
  const isShowingAlert = useRef(false);

  const styles = createStyles(isDark);

  const hasUserReviewed = useMemo(() => {
    if (!currentUser) return false;
    return reviews.some(
      (review) =>
        review._userId === currentUser._id || review.email === currentUser.email
    );
  }, [reviews, currentUser]);

  if (!movie) return null;

  const renderStars = (rating: number, interactive = false, size = 17) => (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <TouchableOpacity
            key={starValue}
            disabled={!interactive || hasUserReviewed}
            onPress={() => interactive && setSelectedRating(starValue)}
          >
            <Ionicons
              name={starValue <= rating ? "star" : "star-outline"}
              size={size}
              color="#FFD700"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const showAlert = (type: "success" | "error" | "info", message: string) => {

    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    if (isShowingAlert.current) {
      return;
    }

    isShowingAlert.current = true;
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);

    alertTimeoutRef.current = setTimeout(() => {
      setAlertVisible(false);
      isShowingAlert.current = false;
      alertTimeoutRef.current = null;
    }, 3000);
  };

  const handleAlertClose = () => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = null;
    }
    setAlertVisible(false);
    isShowingAlert.current = false;
  };

  const handleSubmit = () => {
    if (selectedRating === 0) {
      showAlert("error", "Please select a rating before submitting.");
      return;
    }

    if (hasUserReviewed) {
      showAlert("info", "You have already reviewed this movie.");
      return;
    }

    setSubmittingReview(true); 

    onSubmitReview(selectedRating, reviewText);

    setReviewText("");
    setSelectedRating(0);

    setTimeout(() => {
      setSubmittingReview(false);
    }, 500);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{movie.movieName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons
                name="close"
                size={28}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{movie.releaseYear}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{movie.category}</Text>
              </View>
            </View>

            {movie.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.desc}>{movie.description}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Director</Text>
              <Text style={styles.desc}>{movie.Director}</Text>
            </View>

            {movie.cast && movie.cast.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Top Cast</Text>
                <Text style={styles.desc}>{movie.cast.join(", ")}</Text>
              </View>
            )}

            {/* Reviews List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {reviews.length === 0 && (
                <Text style={styles.desc}>No reviews yet.</Text>
              )}
              {reviews.map((rev, idx) => (
                <View key={idx} style={styles.reviewItem}>
                  <Text style={styles.reviewUser}>{rev.fullName}</Text>
                  {renderStars(rev.rating)}
                  <Text style={styles.reviewText}>{rev.comment}</Text>
                </View>
              ))}
            </View>

            {/* Add Review */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Your Review</Text>
              {hasUserReviewed ? (
                <View style={styles.alreadyReviewedContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.alreadyReviewedText}>
                    You have already reviewed this movie
                  </Text>
                </View>
              ) : (
                <>
                  {renderStars(selectedRating, true)}
                  <TextInput
                    style={styles.input}
                    placeholder="Write your review..."
                    placeholderTextColor={isDark ? "#aaa" : "#888"}
                    multiline
                    value={reviewText}
                    onChangeText={setReviewText}
                  />
                  <TouchableOpacity
                    style={[
                      styles.submitBtn,
                      submittingReview && styles.submitBtnDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={submittingReview}
                  >
                    <Text style={styles.submitBtnText}>
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      <AlertMessage
        message={alertMessage}
        type={alertType}
        visible={alertVisible}
        onClose={handleAlertClose}
      />
    </Modal>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.8)",
      justifyContent: "flex-end",
    },
    modal: {
      width: "100%",
      maxHeight: "90%",
      padding: 20,
      paddingTop: 15,
      backgroundColor: isDark ? "#1a1a1a" : "#fff",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    closeBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark ? "#fff" : "#000",
      flexShrink: 1,
    },
    metaRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
    badge: {
      backgroundColor: "rgba(227, 114, 11, 0.2)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "rgba(227, 114, 11, 0.4)",
    },
    badgeText: { fontSize: 14, fontWeight: "600", color: "#e3720b" },
    section: { marginBottom: 20 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
      color: "#e3720b",
    },
    desc: { fontSize: 16, lineHeight: 24, color: isDark ? "#ccc" : "#333" },
    starsRow: { flexDirection: "row", gap: 6, marginVertical: 8 },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: isDark ? "#fff" : "#000",
      minHeight: 80,
      marginBottom: 12,
    },
    submitBtn: {
      backgroundColor: "#e3720b",
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
    },
    submitBtnDisabled: { backgroundColor: "#cccccc" },
    submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    reviewItem: {
      marginBottom: 15,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#333" : "#ccc",
    },
    reviewUser: {
      fontWeight: "700",
      marginBottom: 4,
      color: isDark ? "#fff" : "#000",
    },
    reviewText: { fontSize: 14, color: isDark ? "#ccc" : "#333", marginTop: 4 },
    alreadyReviewedContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      backgroundColor: isDark
        ? "rgba(76, 175, 80, 0.1)"
        : "rgba(76, 175, 80, 0.2)",
      borderRadius: 12,
      gap: 8,
    },
    alreadyReviewedText: { fontSize: 16, fontWeight: "600", color: "#4CAF50" },
  });