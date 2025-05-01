// screens/LoginScreen.tsx
"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  PressStart2P_400Regular,
} from "@expo-google-fonts/press-start-2p";
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService"; // import the service

const { width } = Dimensions.get("window");

const LOGO_IMAGE = require("../assets/images/Elementopia-Logo.jpg");

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    RobotoMono_400Regular,
  });

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const credentials = { username: email, password };
      const data = await authService.login(credentials);
      console.log("data: ", data);
      if (!data.token) {
        throw new Error("No authentication token received");
      }

      await login(data.token);
      router.push("/leaderboards");
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginSection}>
            <Text style={styles.loginTitle}>LOGIN</Text>

            <View style={styles.logoContainer}>
              <Image
                source={LOGO_IMAGE}
                style={styles.logoImage}
                contentFit="cover"
                transition={1000}
              />
              <LinearGradient
                colors={["rgba(147, 51, 234, 0.6)", "rgba(79, 70, 229, 0.6)"]}
                style={styles.logoGlow}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#9333EA"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9333EA"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9333EA"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                style={styles.buttonWrapper}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#4F46E5", "#7C3AED", "#9333EA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loginButton}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.loginButtonText}>
                      {isLoading ? "LOGGING IN..." : "LOGIN"}
                    </Text>
                    {!isLoading && (
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                    )}
                  </View>
                  <View style={styles.buttonGlow} />
                  <View style={styles.buttonPulse} />
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.signUpLink}>Sign up here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      <View style={styles.backgroundElement1} />
      <View style={styles.backgroundElement2} />
      <View style={styles.backgroundElement3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0A1F", position: "relative" },
  content: { flexGrow: 1, padding: 24, position: "relative" },
  loginSection: { flex: 1, alignItems: "center", paddingTop: 20 },
  loginTitle: {
    paddingTop: 60,
    color: "#00FFF0",
    fontSize: 32,
    fontFamily: "PressStart2P_400Regular",
    marginBottom: 40,
    textShadowColor: "rgba(0, 255, 240, 0.8)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    textAlign: "center",
    letterSpacing: 2,
  },
  logoContainer: {
    backgroundColor: "#00001C",
    position: "relative",
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: width * 0.225,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#FF00FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  logoImage: {
    width: "120%",
    height: "120%",
    zIndex: 1,
    transform: [{ scale: 0.9 }],
  },
  logoGlow: {
    position: "absolute",
    width: "120%",
    height: "120%",
    borderRadius: width * 0.4,
    opacity: 0.6,
    zIndex: 0,
    transform: [{ scale: 1.1 }],
  },
  formContainer: {
    paddingTop: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputContainer: { marginBottom: 20, width: "100%" },
  inputLabel: {
    color: "#FF00FF",
    fontSize: 14,
    fontFamily: "PressStart2P_400Regular",
    marginBottom: 8,
    textShadowColor: "rgba(255, 0, 255, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.5)",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: { padding: 8 },
  buttonWrapper: {
    width: "100%",
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 24,
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 2,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "PressStart2P_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginRight: 8,
  },
  buttonIcon: {
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  buttonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: [{ scale: 1.2 }],
    borderRadius: 12,
    zIndex: 1,
  },
  buttonPulse: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    zIndex: 0,
    transform: [{ scale: 1.1 }],
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 14,
  },
  signUpLink: {
    color: "#FF00FF",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 14,
    textDecorationLine: "underline",
    textShadowColor: "rgba(255, 0, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  backgroundElement1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    top: -50,
    right: -50,
    zIndex: -1,
  },
  backgroundElement2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0, 255, 240, 0.1)",
    bottom: 100,
    left: -50,
    zIndex: -1,
  },
  backgroundElement3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 0, 255, 0.1)",
    bottom: -20,
    right: 50,
    zIndex: -1,
  },
});
