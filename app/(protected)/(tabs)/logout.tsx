import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/modules/auth/context/AuthProvider';
import { colors } from '@/colors';

const Logout = () => {
  const { logout } = useAuth();
  const animation = useRef(new Animated.Value(1)).current; 
  const buttonAnimation = useRef(new Animated.Value(1)).current;

  const handlePress = async () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.9, 
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(animation, {
        toValue: 1.2, 
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    Animated.timing(buttonAnimation, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });

    await logout?.();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#001a0d', '#000000']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={[styles.greenPatch, styles.centerPatch]} />
      <View style={[styles.greenPatch, styles.topLeftPatch]} />
      <View style={[styles.greenPatch, styles.bottomRightPatch]} />
      <View style={[styles.greenPatch, styles.topRightPatch]} />
      <View style={[styles.greenPatch, styles.bottomLeftPatch]} />

      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.brandTitle}>BINNY'S</Text>
          <Text style={styles.subtitle}>Account Management</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="exit-to-app" size={48} color={colors.primary} />
          </View>
          
          <Text style={styles.logoutTitle}>Sign Out</Text>
          <Text style={styles.logoutDescription}>
            Thank you for visiting BINNY'S Premium Jewelry Collection
          </Text>

          <Animated.View style={{ transform: [{ scale: animation }] }}>
            <Animated.View style={{ transform: [{ scale: buttonAnimation }] }}>
              <TouchableOpacity 
                onPress={handlePress} 
                activeOpacity={0.8} 
                style={styles.logoutButton}
              >
                <LinearGradient
                  colors={['#ff6b7d', '#ff4757', '#c44569']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialIcons name="logout" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              You will be safely signed out of your account
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },

  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },

  greenPatch: {
    position: 'absolute',
    backgroundColor: colors.primary,
    opacity: 0.08,
    borderRadius: 100,
  },
  centerPatch: {
    width: 120,
    height: 120,
    top: '45%',
    left: '50%',
    marginLeft: -60,
    marginTop: -60,
    zIndex: 1,
  },
  topLeftPatch: {
    width: 80,
    height: 80,
    top: '15%',
    left: '10%',
    zIndex: 1,
  },
  topRightPatch: {
    width: 60,
    height: 60,
    top: '20%',
    right: '15%',
    zIndex: 1,
  },
  bottomLeftPatch: {
    width: 70,
    height: 70,
    bottom: '25%',
    left: '8%',
    zIndex: 1,
  },
  bottomRightPatch: {
    width: 90,
    height: 90,
    bottom: '20%',
    right: '12%',
    zIndex: 1,
  },

  contentContainer: {
    flex: 1,
    zIndex: 5,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 40,
  },
  brandTitle: {
    fontSize: 32,
    fontFamily: 'TitleFont',
    color: colors.primary,
    letterSpacing: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 2,
    fontWeight: '300',
    textTransform: 'uppercase',
  },

  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 91, 65, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 91, 65, 0.2)',
  },

  logoutTitle: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 1,
  },

  logoutDescription: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },

  // Logout Button
  logoutButton: {
    borderRadius: 30,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 30,
  },

  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },

  buttonIcon: {
    marginRight: 8,
  },

  buttonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },

  // Footer Section
  footerSection: {
    alignItems: 'center',
    marginTop: 20,
  },

  footerText: {
    fontSize: 11,
    color: 'rgba(186, 180, 180, 0.6)',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
});