import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p"
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono"
import { LinearGradient } from "expo-linear-gradient"
import { Image } from "expo-image"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"

const { width, height } = Dimensions.get("window")

// Temporary placeholder image URL (replace with your actual atom-3d.png later)
const PLACEHOLDER_IMAGE = 'https://cdn.pixabay.com/photo/2018/08/25/16/06/electron-3630678_1280.png'

export default function WelcomeScreen() {
  const router = useRouter()
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    RobotoMono_400Regular
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header/Navigation Bar */}
      <BlurView intensity={80} tint="dark" style={styles.header}>
        <Text style={styles.logo}>ELEMENTOPIA</Text>
        <View style={styles.authButtons}>
          <TouchableOpacity onPress={() => router.push("/login")} style={styles.loginButtonContainer}>
            <Text style={styles.loginButton}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/signup")}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.textContent}>
            <Text style={styles.masterText}>MASTER</Text>
            <View style={styles.pixelTextContainer}>
              <Text style={styles.chemicalText}>CHEMICAL</Text>
              <Text style={styles.structuresText}>STRUCTURES</Text>
            </View>
            <View style={styles.throughPlayContainer}>
              <Text style={styles.throughText}>THROUGH</Text>
              <Text style={styles.playText}>PLAY</Text>
            </View>
            
            <Text style={styles.description}>
              Build, explore, and learn molecular structures in our engaging 2D chemistry game. Perfect for students,
              educators, and chemistry enthusiasts.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => router.push("/getstarted")}
                style={styles.buttonWrapper}
              >
                <LinearGradient
                  colors={['#4F46E5', '#7C3AED', '#9333EA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.getStartedButton}
                >
                  <Text style={styles.getStartedText}>Get Started</Text>
                  <View style={styles.buttonGlow} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <Image 
            source={require('../assets/images/animation-loop.gif')}
            style={[styles.atomImage, { tintColor: undefined, opacity: 1 }]}
            contentFit="contain"
            transition={1000}
          />

          <View style={styles.missionSection}>
            <LinearGradient
              colors={['rgba(0, 255, 240, 0.1)', 'rgba(0, 255, 240, 0.05)']}
              style={styles.missionBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.missionTitle}>OUR MISSION</Text>
            <Text style={styles.missionText}>
              Our mission is to make learning chemistry fun and engaging for students of all ages. We believe that by combining education with entertainment, we can create a unique learning experience that will help students master the fundamentals of chemistry.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A1F',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    marginLeft: -10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 50 : 24,
    paddingBottom: 24,
    backgroundColor: 'rgba(15, 10, 31, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(147, 51, 234, 0.3)',
  },
  logo: {
    color: '#9333EA',
    marginTop: 26,
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular',
    textShadowColor: 'rgba(147, 51, 234, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loginButtonContainer: {
    marginTop: 17,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#9333EA',
    borderRadius: 8,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
  },
  loginButton: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'RobotoMono_400Regular',
  },
  signUpButton: {
    marginTop: 17,
    marginRight: -13,
    backgroundColor: '#9333EA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signUpText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'RobotoMono_400Regular',
  },
  content: {
    flexGrow: 1,
    padding: 0,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  textContent: {
    width: '100%',
    alignItems: 'center',
  },
  masterText: {
    marginTop: 110,
    color: '#fff',
    fontSize: 40,
    fontFamily: 'PressStart2P_400Regular',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  pixelTextContainer: {
    marginBottom: 20,
    alignItems: 'center',
    transform: [{ perspective: 1000 }],
  },
  chemicalText: {
    color: '#FF00FF',
    fontSize: 34,
    fontFamily: 'PressStart2P_400Regular',
    textShadowColor: 'rgba(255, 0, 255, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  structuresText: {
    color: '#FF00FF',
    fontSize: 34,
    fontFamily: 'PressStart2P_400Regular',
    textShadowColor: 'rgba(255, 0, 255, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 2,
  },
  throughPlayContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  throughText: {
    color: '#fff',
    fontSize: 36,
    fontFamily: 'PressStart2P_400Regular',
    marginBottom: 5,
    textAlign: 'center',
  },
  playText: {
    color: '#FFD700',
    fontSize: 32,
    fontFamily: 'PressStart2P_400Regular',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  description: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'RobotoMono_400Regular',
    marginBottom: 30,
    opacity: 0.8,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 20,
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonWrapper: {
    width: '100%',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedButton: {
    paddingVertical: 18,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'RobotoMono_400Regular',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    position: 'relative',
    zIndex: 1,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ scale: 1.2 }],
    borderRadius: 12,
  },
  atomImage: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: 40,
  },
  missionSection: {
    marginTop: 80,
    marginBottom: 40,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  missionBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  missionTitle: {
    color: '#00FFF0',
    fontSize: 36,
    fontFamily: 'PressStart2P_400Regular',
    marginBottom: 32,
    textShadowColor: 'rgba(0, 255, 240, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  missionText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'RobotoMono_400Regular',
    lineHeight: 32,
    textAlign: 'center',
    opacity: 0.95,
    maxWidth: 800,
    paddingHorizontal: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
})