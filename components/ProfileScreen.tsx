import React from "react"
import { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
  ActivityIndicator
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p"
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono"
import { LinearGradient } from "expo-linear-gradient"
import { Image } from "expo-image"
import { TextInput } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useAuth } from "../context/AuthContext"
import authService from "../services/authService"

const { width, height } = Dimensions.get("window")

// Default avatar image - replace with actual user avatar when available
const DEFAULT_AVATAR = require("../assets/images/Elementopia-Logo.jpg")

export default function ProfileScreen() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // User profile data
  // Replace mock data with empty strings
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("••••••••")
  const [actualPassword, setActualPassword] = useState("")
  
  // Add useEffect to fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const userData = await authService.getUserProfile();
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setUsername(userData.username);
        
        // Save original data for cancel operation
        setOriginalData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          username: userData.username,
          password: ""
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Update handleSave to use the API
  // Add showPassword state near other state declarations
  const [showPassword, setShowPassword] = useState(false)
  
  // Remove the second handleSave function (around line 153) and keep only the first one that uses the API
  // Update handleSave to use the API
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        firstName,
        lastName,
        email,
        username,
        // Remove password from update data
        // password: actualPassword || undefined
      };

      await authService.updateUserProfile(updatedData);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Remove the duplicate handleSave function that uses setTimeout
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: ""
  })

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    RobotoMono_400Regular,
  })

  // Simulate loading user data
  useEffect(() => {
    setIsLoading(true)
    // Simulate API call to get user data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (!fontsLoaded) {
    return null
  }

  const handleEdit = () => {
    // Save original data for cancel operation
    setOriginalData({
      firstName,
      lastName,
      email,
      username,
      password: actualPassword
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    // Restore original data
    setFirstName(originalData.firstName)
    setLastName(originalData.lastName)
    setEmail(originalData.email)
    setUsername(originalData.username)
    setActualPassword(originalData.password)
    setPassword("••••••••")
    setIsEditing(false)
  }

  const handlePasswordChange = (text: string) => {
    setActualPassword(text)
    setPassword(text)
  }

  const handleBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="light" />
        <LinearGradient
          colors={["#4F46E5", "#7C3AED", "#9333EA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#00FFF0" />
          <Text style={styles.loadingText}>LOADING PROFILE...</Text>
        </LinearGradient>
        
        {/* Background elements */}
        <View style={styles.backgroundElement1} />
        <View style={styles.backgroundElement2} />
        <View style={styles.backgroundElement3} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        keyboardOpeningTime={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.profileSection}>
            <Text style={styles.profileTitle}>PROFILE</Text>

            {/* Profile Header with Avatar */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image source={DEFAULT_AVATAR} style={styles.avatarImage} contentFit="cover" transition={1000} />
                <LinearGradient
                  colors={["rgba(147, 51, 234, 0.6)", "rgba(79, 70, 229, 0.6)"]}
                  style={styles.avatarGlow}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {isEditing && (
                  <TouchableOpacity style={styles.editAvatarButton}>
                    <Ionicons name="camera" size={20} color="#00FFF0" />
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.userInfoHeader}>
                <Text style={styles.userFullName}>{firstName} {lastName}</Text>
                <Text style={styles.userUsername}>@{username}</Text>
                
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>ONLINE</Text>
                </View>
              </View>
            </View>

            {/* Molecular decoration */}
            <View style={styles.moleculeContainer}>
              <View style={styles.atom}>
                <View style={styles.nucleus} />
                <View style={[styles.electron, styles.electron1]} />
                <View style={[styles.electron, styles.electron2]} />
                <View style={[styles.electron, styles.electron3]} />
              </View>
            </View>

            {/* Form fields */}
            <View style={styles.formContainer}>
              {/* First Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>FIRST NAME</Text>
                <View style={[styles.inputWrapper, !isEditing && styles.inputDisabled]}>
                  <Ionicons name="flask-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={isEditing}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Last Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>LAST NAME</Text>
                <View style={[styles.inputWrapper, !isEditing && styles.inputDisabled]}>
                  <Ionicons name="flask-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    editable={isEditing}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>EMAIL</Text>
                <View style={[styles.inputWrapper, !isEditing && styles.inputDisabled]}>
                  <Ionicons name="mail-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    editable={isEditing}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>USERNAME</Text>
                <View style={[styles.inputWrapper, !isEditing && styles.inputDisabled]}>
                  <Ionicons name="at-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    editable={isEditing}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input - Commented out for now 
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={[styles.inputWrapper, !isEditing && styles.inputDisabled]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9333EA" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={isEditing ? actualPassword : password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    editable={isEditing}
                    autoCapitalize="none"
                  />
                  {isEditing && (
                    <TouchableOpacity 
                      style={styles.eyeIcon} 
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#9333EA" 
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              */}

              {/* Action Buttons */}
              {!isEditing ? (
                <View style={styles.actionButtonsContainer}>
                  {/* Edit Profile Button - Commented out for now 
                  <TouchableOpacity onPress={handleEdit} style={styles.buttonWrapper}>
                    <LinearGradient
                      colors={["#4F46E5", "#7C3AED", "#9333EA"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.actionButton}
                    >
                      <View style={styles.buttonContent}>
                        <Ionicons name="create-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>EDIT PROFILE</Text>
                      </View>
                      <View style={styles.buttonGlow} />
                    </LinearGradient>
                  </TouchableOpacity>
                  */}

                  {/* Back Button */}
                  <TouchableOpacity onPress={handleBack} style={styles.buttonWrapper}>
                    <LinearGradient
                      colors={["#FF00FF", "#9333EA", "#4F46E5"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={[styles.actionButton, styles.logoutButton]}
                    >
                      <View style={styles.buttonContent}>
                        <Ionicons name="arrow-back-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>BACK</Text>
                      </View>
                      <View style={styles.buttonGlow} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.editActionButtonsContainer}>
                  {/* Save Button */}
                  <TouchableOpacity onPress={handleSave} style={[styles.buttonWrapper, styles.editButtonWrapper]} disabled={isSaving}>
                    <LinearGradient
                      colors={["#00FFF0", "#4F46E5", "#7C3AED"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.actionButton}
                    >
                      <View style={styles.buttonContent}>
                        {isSaving ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <Ionicons name="save-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.actionButtonText}>SAVE</Text>
                          </>
                        )}
                      </View>
                      <View style={styles.buttonGlow} />
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Cancel Button */}
                  <TouchableOpacity onPress={handleCancel} style={[styles.buttonWrapper, styles.editButtonWrapper]} disabled={isSaving}>
                    <LinearGradient
                      colors={["#FF00FF", "#9333EA", "#4F46E5"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.actionButton}
                    >
                      <View style={styles.buttonContent}>
                        <Ionicons name="close-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>CANCEL</Text>
                      </View>
                      <View style={styles.buttonGlow} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      {/* Background elements */}
      <View style={styles.backgroundElement1} />
      <View style={styles.backgroundElement2} />
      <View style={styles.backgroundElement3} />
      <View style={styles.backgroundElement4} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0A1F",
    position: "relative",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingGradient: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    height: 120,
  },
  loadingText: {
    marginTop: 16,
    color: "#00FFF0",
    fontFamily: "PressStart2P_400Regular",
    fontSize: 14,
    textShadowColor: "rgba(0, 255, 240, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    position: "relative",
  },
  profileSection: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  profileTitle: {
    paddingTop: 60,
    color: "#00FFF0",
    fontSize: 25,
    fontFamily: "PressStart2P_400Regular",
    marginBottom: 30,
    textShadowColor: "rgba(0, 255, 240, 0.8)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    textAlign: "center",
    letterSpacing: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  avatarContainer: {
    position: "relative",
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
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
  avatarImage: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  avatarGlow: {
    position: "absolute",
    width: "120%",
    height: "120%",
    borderRadius: width * 0.4,
    opacity: 0.6,
    zIndex: 0,
    transform: [{ scale: 1.1 }],
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(147, 51, 234, 0.8)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    borderWidth: 2,
    borderColor: "#0F0A1F",
  },
  userInfoHeader: {
    marginLeft: 20,
    flex: 1,
  },
  userFullName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "PressStart2P_400Regular",
    marginBottom: 4,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userUsername: {
    color: "#FF00FF",
    fontSize: 14,
    fontFamily: "RobotoMono_400Regular",
    marginBottom: 8,
    textShadowColor: "rgba(255, 0, 255, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 240, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 240, 0.3)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FFF0",
    marginRight: 6,
    shadowColor: "#00FFF0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  statusText: {
    color: "#00FFF0",
    fontSize: 10,
    fontFamily: "PressStart2P_400Regular",
  },
  moleculeContainer: {
    position: "absolute",
    top: 180,
    right: 10,
    zIndex: -1,
    opacity: 0.6,
  },
  atom: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  nucleus: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF00FF",
    shadowColor: "#FF00FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  electron: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FFF0",
    shadowColor: "#00FFF0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  electron1: {
    top: 0,
    left: 36,
  },
  electron2: {
    bottom: 10,
    right: 10,
  },
  electron3: {
    bottom: 0,
    left: 10,
  },
  formContainer: {
    paddingTop: 10,
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
  inputDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderColor: "rgba(147, 51, 234, 0.3)",
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
  actionButtonsContainer: {
    marginTop: 20,
    width: "100%",
  },
  editActionButtonsContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonWrapper: {
    width: "100%",
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
    transform: [{ scale: 1 }],
  },
  editButtonWrapper: {
    width: "48%",
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  logoutButton: {
    borderColor: "rgba(255, 0, 255, 0.3)",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 2,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PressStart2P_400Regular",
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginLeft: 8,
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
  backgroundElement4: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    top: 200,
    left: 20,
    zIndex: -1,
  },
})