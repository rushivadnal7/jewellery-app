import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/colors";


export const PostHeader = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <Pressable 
                onPress={() => router.back()} 
                style={styles.backButton}
                android_ripple={{ color: colors.primary + '20' }}
            >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            
            <Text style={styles.headerTitle}>Post Details</Text>
            
            <View style={styles.placeholder} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary + '20',
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,

        backgroundColor: colors.primary + '100',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    placeholder: {
        width: 44,
    },
});