import { View, Text, StyleSheet } from "react-native";
import Animated, { 

    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming,
    Easing,
    FadeIn,
} from "react-native-reanimated";
import { useEffect } from "react";
import { colors } from "@/colors";

type LoadingSpinnerProps = {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    fullScreen?: boolean;
    color?: string;
    showMessage?: boolean;
};

export const Loader = ({ 
    size = 'medium', 
    message = 'Loading...',
    fullScreen = true,
    color = colors.secondary,
    showMessage = true,
}: LoadingSpinnerProps) => {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(0.8);

    const sizes = {
        small: { spinner: 30, inner: 12, text: 14, borderWidth: 2 },
        medium: { spinner: 50, inner: 20, text: 16, borderWidth: 3 },
        large: { spinner: 70, inner: 28, text: 18, borderWidth: 4 },
    };

    const currentSize = sizes[size];

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 2000,
                easing: Easing.linear,
            }),
            -1
        );

        scale.value = withRepeat(
            withTiming(1.2, {
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotation.value}deg` },
            { scale: scale.value },
        ],
    }));

    const spinnerStyle = {
        width: currentSize.spinner,
        height: currentSize.spinner,
        borderRadius: currentSize.spinner / 2,
        borderWidth: currentSize.borderWidth,
        borderColor: colors.primary + '30',
        borderTopColor: color,
    };

    const innerStyle = {
        width: currentSize.inner,
        height: currentSize.inner,
        borderRadius: currentSize.inner / 2,
        backgroundColor: colors.primary + '20',
    };

    const containerStyle = fullScreen 
        ? styles.fullScreenContainer 
        : styles.inlineContainer;

    return (
        <View style={containerStyle}>
            <Animated.View style={[spinnerStyle, animatedStyle, styles.spinner]}>
                <View style={innerStyle} />
            </Animated.View>
            
            {showMessage && (
                <Animated.Text 
                    entering={FadeIn.delay(300)}
                    style={[styles.message, { fontSize: currentSize.text }]}
                >
                    {message}
                </Animated.Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        gap: 16,
    },
    inlineContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    spinner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        color: colors.muted,
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
});