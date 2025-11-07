import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Movie } from "../src/services/movieService";
import { SIZES } from "../constants/theme";

interface FavoritesCarouselProps {
  favorites: Movie[];
  isDark: boolean;
  onSelect: (movie: Movie) => void;
}

const visibleItems = 2;
const itemWidth = 120;
const spacing = SIZES.spacing.md;

export default function FavoritesCarousel({
  favorites,
  isDark,
  onSelect,
}: FavoritesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList<Movie>>(null);

  const scrollToIndex = (index: number) => {
    if (listRef.current) {
      listRef.current.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={[styles.favoriteCard, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
      onPress={() => onSelect(item)}
    >
      {item.bannerImage ? (
        <Image
          source={{ uri: item.bannerImage }}
          style={styles.favoriteImage}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.favoriteImage,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDark ? "#333" : "#ccc",
            },
          ]}
        >
          <Ionicons
            name="film-outline"
            size={28}
            color={isDark ? "#ccc" : "#666"}
          />
        </View>
      )}
      <Text
        style={[styles.favoriteName, { color: isDark ? "#fff" : "#000" }]}
        numberOfLines={1}
      >
        {item.movieName || "Untitled"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* Left Arrow */}
      <TouchableOpacity
        disabled={currentIndex === 0}
        onPress={() => scrollToIndex(Math.max(currentIndex - 1, 0))}
        style={{ padding: 8 }}
      >
        <Ionicons
          name="chevron-back-outline"
          size={28}
          color={currentIndex === 0 ? "#888" : "#e3720b"}
        />
      </TouchableOpacity>

      {/* FlatList */}
      <FlatList
        ref={listRef}
        data={favorites}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
        getItemLayout={(_, index) => ({
          length: itemWidth + spacing,
          offset: (itemWidth + spacing) * index,
          index,
        })}
        initialNumToRender={visibleItems}
      />

      {/* Right Arrow */}
      <TouchableOpacity
        disabled={currentIndex >= favorites.length - visibleItems}
        onPress={() =>
          scrollToIndex(Math.min(currentIndex + 1, favorites.length - visibleItems))
        }
        style={{ padding: 8 }}
      >
        <Ionicons
          name="chevron-forward-outline"
          size={28}
          color={currentIndex >= favorites.length - visibleItems ? "#888" : "#e3720b"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  favoriteCard: {
    width: itemWidth,
    marginRight: spacing,
    borderRadius: SIZES.borderRadius.medium,
    overflow: "hidden",
  },
  favoriteImage: { width: itemWidth, height: 180 },
  favoriteName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
});