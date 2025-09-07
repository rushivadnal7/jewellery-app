import { Stack, useLocalSearchParams, router } from "expo-router";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "@/modules/post/hooks/useRedux";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/modules/post/services/PostSlice";
import { PostHeader } from "@/modules/post/components/PostHeader";
import { Loader } from "@/modules/components/Loader";
import { ErrorMessage } from "@/modules/components/ErrorMessage";
import { PostContent } from "@/modules/post/components/PostContent";
import { colors } from "@/colors";
import { MaterialIcons } from "@expo/vector-icons";

export default function PostDetails() {
    const { id } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const { posts, loading, error } = useAppSelector((state) => state.posts);

    const [count, setCount] = useState(1);


    const countHandler = (operation: "+" | "-") => {
        setCount((prev) => {
            if (operation === "+") return prev + 1;
            if (operation === "-" && prev > 0) return prev - 1;
            return prev;
        });
    };


    useEffect(() => {
        if (posts.length === 0) {
            dispatch(fetchPosts());
        }
    }, [dispatch]);

    const singlePost = posts.find((post) => post.id.toString() === id);

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <View style={styles.container}>
                <PostHeader />

                {loading ? (
                    <Loader />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : singlePost ? (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <PostContent post={singlePost} />
                        <View style={styles.counterContainer}>
                            <TouchableOpacity onPress={() => countHandler('+')} style={styles.counterButtons}>
                                <MaterialIcons size={32} name="add" color={''} />
                            </TouchableOpacity>
                            <Text style={styles.counterText}>{count}</Text>
                            <TouchableOpacity onPress={() => countHandler('-')} style={styles.counterButtons}>
                                <MaterialIcons size={32} name="remove" color={''} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                ) : (
                    <ErrorMessage message="Post not found" />
                )}

            </View>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    counterContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 25
    },
    counterButtons: {
        backgroundColor: colors.secondary,
        padding: 8,
        borderRadius: 10
    },
    counterText: {
        color: '#fff',
        fontSize: 32
    },
    scrollContent: {
        paddingBottom: 40,
    },
});