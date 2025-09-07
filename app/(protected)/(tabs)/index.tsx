import { colors } from '@/colors';
import Hero from '@/modules/components/Hero';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const index = () => {
    return (
        <View style={styles.container}>
            <Hero />
        </View>
    )
}

export default index


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111' },
    brand: {
        position: 'absolute',
        bottom: 80,
        alignSelf: 'center',
        fontSize: 36,
        color: colors.primary,
        fontWeight: 'bold',
        letterSpacing: 5,
    },
});
