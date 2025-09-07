import { useAppDispatch, useAppSelector } from "@/modules/post/hooks/useRedux";
import { fetchPosts } from "@/modules/post/services/PostSlice";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/colors";
import { router } from "expo-router";
import { Loader } from "@/modules/components/Loader";


export default function Posts() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const { posts, loading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 5 * 150) { 
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };




  const getRandomImageUrl = (id: string | number) => {
    const categories = ['jewelry', 'fashion', 'luxury', 'lifestyle'];
    const category = categories[id % categories.length];
    return `https://picsum.photos/seed/${encodeURIComponent(category + '-' + id)}/400/300`;
  };

  const getPostTitle = (title: string) => {
    const words = title.split(' ');
    return words.slice(0, 3).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getPostDescription = (body: string) => {
    const words = body.split(' ');
    return words.slice(0, 8).map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ') + '...';
  };

  const handlePostPress = (post: any) => {
    console.log(post.id)
    router.push(`/posts/${post.id}`)
  };

  if (loading) return <Loader />;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Discover Posts</Text>
      <FlatList
        style={styles.flatListContainer}
        ref={flatListRef}
        ListFooterComponent={() => (
          <Text style={styles.footer}>— End of the List —</Text>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => handlePostPress(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: getRandomImageUrl(item.id) }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>Post #{item.id}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.contentSection}>
                <Text style={styles.postTitle}>{getPostTitle(item.title)}</Text>
                <Text style={styles.postDescription}>{getPostDescription(item.body)}</Text>

                <View style={styles.bottomInfo}>
                  <View style={styles.authorInfo}>
                    <View style={styles.authorAvatar}>
                      <Text style={styles.authorInitial}>U</Text>
                    </View>
                    <Text style={styles.authorName}>User {Math.ceil(Math.random() * item.id)}</Text>
                  </View>
                  <View style={styles.readMore}>
                    <Text style={styles.readMoreText}>Read More</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.headerTitle}></Text>
      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopBtn}
          onPress={() => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })}
        >
          <Text style={styles.scrollTopText}>↑ Top</Text>
        </TouchableOpacity>
      )}


    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.background, 
  },
  scrollTopBtn: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10
  },
  scrollTopText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,  
    marginBottom: 20,
    marginTop: 10,
  },
  footer: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.text,  
    marginBottom: 20,
    marginHorizontal: 'auto',
    marginTop: 10,
  },
  flatListContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  errorText: {
    textAlign: "center",
    color: "#FF3B30",
    fontSize: 16,
    marginTop: 50,
  },
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111111", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  postImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#222222",
  },
  imageOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  categoryBadge: {
    backgroundColor: colors.primary, 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
  contentSection: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text, 
    marginBottom: 8,
    lineHeight: 24,
  },
  postDescription: {
    fontSize: 14,
    color: colors.muted, 
    lineHeight: 20,
    marginBottom: 16,
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary, 
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  authorInitial: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  authorName: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.muted,
  },
  readMore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary, 
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary, 
  },
});
