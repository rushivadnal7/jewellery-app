import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, BounceIn, SlideInDown } from "react-native-reanimated";
import { colors } from "@/colors";

type ErrorMessageProps = {
    title?: string;
    message: string;
    onRetry?: () => void;
    retryText?: string;
    fullScreen?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    showIcon?: boolean;
};

export const ErrorMessage = ({ 
    title = "Oops!",
    message,
    onRetry,
    retryText = "Try Again",
    fullScreen = true,
    icon = "alert-circle-outline",
    showIcon = true,
}: ErrorMessageProps) => {
    const containerStyle = fullScreen 
        ? styles.fullScreenContainer 
        : styles.inlineContainer;

    return (
        <Animated.View 
            entering={FadeIn.duration(500)}
            style={containerStyle}
        >
            {showIcon && (
                <Animated.View 
                    entering={BounceIn.delay(200)}
                    style={styles.iconContainer}
                >
                    <Ionicons 
                        name={icon} 
                        size={48} 
                        color={colors.secondary} 
                    />
                </Animated.View>
            )}
            
            <Animated.Text 
                entering={SlideInDown.delay(300)}
                style={styles.title}
            >
                {title}
            </Animated.Text>
            
            <Animated.Text 
                entering={SlideInDown.delay(400)}
                style={styles.message}
            >
                {message}
            </Animated.Text>

            {onRetry && (
                <Animated.View entering={SlideInDown.delay(500)}>
                    <Pressable 
                        style={styles.retryButton}
                        onPress={onRetry}
                        android_ripple={{ color: colors.primary + '30' }}
                    >
                        <Ionicons 
                            name="refresh-outline" 
                            size={20} 
                            color={colors.text} 
                        />
                        <Text style={styles.retryText}>{retryText}</Text>
                    </Pressable>
                </Animated.View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 32,
        gap: 16,
    },
    inlineContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 16,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.secondary + '15',
        borderWidth: 1,
        borderColor: colors.secondary + '30',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.muted,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 280,
        letterSpacing: 0.2,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 8,
        elevation: 2,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    retryText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
});