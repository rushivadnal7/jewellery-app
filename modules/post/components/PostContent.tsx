import { colors } from "@/modules/constants/colors";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";


type Post = {
    id: number;
    title: string;
    body: string;
    userId: number;
};

type PostContentProps = {
    post: Post;
};

export const PostContent = ({ post }: PostContentProps) => {
    const scale = useSharedValue(0.95);
    
    useEffect(() => {
        scale.value = withSpring(1, {
            damping: 20,
            stiffness: 100,
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Animated.View 
                entering={FadeInUp.delay(100).springify()}
                style={styles.badge}
            >
                <Text style={styles.badgeText}>Post #{post.id}</Text>
            </Animated.View>

            <Animated.View 
                entering={FadeInDown.delay(200).springify()}
                style={styles.titleContainer}
            >
                <Text style={styles.title}>{post.title}</Text>
            </Animated.View>

            <Animated.View 
                entering={FadeInDown.delay(300).springify()}
                style={styles.contentContainer}
            >
                <Text style={styles.contentLabel}>Content</Text>
                <Text style={styles.body}>{post.body}</Text>
            </Animated.View>

            <Animated.View 
                entering={FadeInDown.delay(400).springify()}
                style={styles.authorContainer}
            >
                <View style={styles.authorBadge}>
                    <Text style={styles.authorLabel}>Author ID</Text>
                    <Text style={styles.authorId}>{post.userId}</Text>
                </View>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 28,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 2,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    badgeText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    titleContainer: {
        gap: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        lineHeight: 32,
        letterSpacing: -0.5,
    },
    contentContainer: {
        gap: 16,
    },
    contentLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    body: {
        fontSize: 16,
        color: colors.muted,
        lineHeight: 26,
        letterSpacing: 0.2,
    },
    authorContainer: {
        marginTop: 20,
    },
    authorBadge: {
        backgroundColor: colors.primary + '50',
        borderWidth: 1,
        borderColor: colors.primary + '60',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        gap: 4,
    },
    authorLabel: {
        fontSize: 12,
        color: colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '500',
    },
    authorId: {
        fontSize: 18,
        color: colors.secondary,
        fontWeight: '700',
    },
});