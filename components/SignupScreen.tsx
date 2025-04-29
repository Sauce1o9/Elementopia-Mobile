"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p"
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono"
import { LinearGradient } from "expo-linear-gradient"
import { Image } from "expo-image"
import { TextInput } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

const { width, height } = Dimensions.get("window")

// Logo image
const LOGO_IMAGE = require("../assets/images/Elementopia-Logo.jpg")

export default function SignupScreen() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("Student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    RobotoMono_400Regular,
  })

  if (!fontsLoaded) {
    return null
  }

  const handleSignup = async () => {
    setIsLoading(true)
    // Implement your signup logic here
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to main app after successful signup
      router.push("/explore")
    }, 1500)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={0}
        keyboardOpeningTime={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.signupSection}>
            <Text style={styles.signupTitle}>SIGN UP</Text>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={LOGO_IMAGE} style={styles.logoImage} contentFit="cover" transition={1000} />
              <LinearGradient
                colors={["rgba(147, 51, 234, 0.6)", "rgba(79, 70, 229, 0.6)"]}
                style={styles.logoGlow}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </View>

            <View style={styles.formContainer}>
              {/* Name Row */}
              <View style={styles.nameRow}>
                {/* First Name Input */}
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>FIRST NAME</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="First name"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Last Name Input */}
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>LAST NAME</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Last name"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#9333EA" style={styles.inputIcon} />
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

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>USERNAME</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="at-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a username"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9333EA" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9333EA"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Role Selector */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>SELECT ROLE</Text>
                <TouchableOpacity
                  style={styles.inputWrapper}
                  onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                >
                  <Ionicons name="school-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                  <Text style={[styles.input, { paddingVertical: 12 }]}>{role}</Text>
                  <Ionicons
                    name={showRoleDropdown ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#9333EA"
                    style={styles.inputIcon}
                  />
                </TouchableOpacity>
                {showRoleDropdown && (
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setRole("Student")
                        setShowRoleDropdown(false)
                      }}
                    >
                      <Text style={[styles.dropdownText, role === "Student" && styles.dropdownTextSelected]}>
                        Student
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setRole("Teacher")
                        setShowRoleDropdown(false)
                      }}
                    >
                      <Text style={[styles.dropdownText, role === "Teacher" && styles.dropdownTextSelected]}>
                        Teacher
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Signup Button */}
              <TouchableOpacity onPress={handleSignup} style={styles.buttonWrapper} disabled={isLoading}>
                <LinearGradient
                  colors={["#4F46E5", "#7C3AED", "#9333EA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.signupButton}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.signupButtonText}>{isLoading ? "SIGNING UP..." : "SIGN UP"}</Text>
                    {!isLoading && (
                      <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    )}
                  </View>
                  <View style={styles.buttonGlow} />
                  <View style={styles.buttonPulse} />
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={styles.loginLink}>Log in here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      {/* Background elements */}
      <View style={styles.backgroundElement1} />
      <View style={styles.backgroundElement2} />
      <View style={styles.backgroundElement3} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0A1F",
    position: "relative",
  },
  content: {
    flexGrow: 1,
    padding: 24,
    position: "relative",
  },
  signupSection: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  signupTitle: {
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
    position: "relative",
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: width * 0.225,
    overflow: "hidden",
    backgroundColor: "#00001C",
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
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
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
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: {
    padding: 8,
  },
  buttonWrapper: {
    width: "100%",
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 24,
    transform: [{ scale: 1 }],
  },
  signupButton: {
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
  signupButtonText: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  loginText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 14,
  },
  loginLink: {
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
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfWidth: {
    width: "48%",
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 10, 31, 0.95)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.5)",
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(147, 51, 234, 0.2)",
  },
  dropdownText: {
    color: "#FFFFFF",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 16,
  },
  dropdownTextSelected: {
    color: "#9333EA",
  },
}) 