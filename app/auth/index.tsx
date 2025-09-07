import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  ScrollView,
  Keyboard,
  Pressable
} from "react-native";
import { useAuth } from "@/modules/auth/context/AuthProvider";
import { colors } from "@/colors";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import { loginSchema } from "@/modules/auth/validations/loginSchema";
const { height } = Dimensions.get("window");



type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen = () => {

  const [backgroundtap, setBackgroundtap] = useState(false);



  const handleBackgroundTap = () => {
    // setBackgroundtap(!backgroundtap)
  };
  return (
    <View style={styles.container}>
      <Pressable style={styles.backgroundContainer} onPress={handleBackgroundTap}>
        <ImageBackground
          source={require("../../assets/images/auth/bg.jpeg")}
          style={styles.backgroundImage}
        >
          <Text style={styles.title}>Welcome to Binny's</Text>
          <Text style={styles.text}>Sign in to enter binny's store</Text>

          {/* <Text style={styles.openLogin}>Login</Text> */}
        </ImageBackground>
      </Pressable>

      {
        !backgroundtap &&
        <Login />
      }
    </View>
  );
};

const Login = () => {
  const { login } = useAuth();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const navigation = useNavigation();


  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
      delay: 1000
    }).start();

    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const loginHandler = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      if (login) {
        await login(data.username, data.password);
        router.replace('/(protected)/(tabs)')
      }

    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.keyboardAvoidingView}>
      <Animated.View
        style={[
          styles.loginContainer,
          {
            transform: [
              { translateY: slideAnim },
              { translateY: Animated.multiply(new Animated.Value(-1), new Animated.Value(keyboardHeight * 0.9)) }
            ],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text style={styles.welcomeText}>Welcome Back</Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>username</Text>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.username && styles.inputError]}
                      placeholder="Enter your username"
                      placeholderTextColor="#999"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType='email-address'
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                    />
                  )}
                />
                {errors.username && (
                  <Text style={styles.errorText}>{errors.username.message}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.password && styles.inputError]}
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(loginHandler)}
                    />
                  )}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                )}
              </View>

              <View style={styles.dummyContainer}>
                <Text style={styles.dummyText}>username - 'emilys'</Text>
                <Text style={styles.dummyText}>password - 'emilyspass'</Text>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleSubmit(loginHandler)}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    flex: 1,
  },
  openLogin: {
    position: 'absolute',
    bottom: 200,
    textAlign: 'center',
    marginHorizontal: 'auto',
    fontSize: 28,
    color: colors.text
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  title: {
    color: colors.text,
    fontSize: 36,
    fontFamily: 'TitleFont',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  text: {
    color: colors.muted,
    fontSize: 16,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  loginContainer: {
    minHeight: 500,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: '#fff',
    width: '100%',
    padding: 25,
    paddingTop: 35,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#ff4757',
  },
  errorText: {
    color: '#ff4757',
    fontSize: 14,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: colors.primary + '40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
    shadowColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dummyContainer : {
    flex: 1,
    flexDirection:'row',
    marginHorizontal: 'auto',
    gap:8
  },
  dummyText:{
    fontSize:12,
    color : colors.muted
  }
});

export default LoginScreen;