"use client"

import { useEffect, useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, Dimensions, TextInput, TouchableOpacity, Animated, Pressable, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { StatusBar } from "expo-status-bar"
import { useFonts, PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p"
import { RobotoMono_400Regular } from "@expo-google-fonts/roboto-mono"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useAuth } from "../context/AuthContext"
import authService from "../services/authService"

const { width } = Dimensions.get("window")

interface Student {
  userId: number
  firstName: string
  lastName: string
  careerTotalScore: number
}

type SortOption = "score" | "name"

const TeacherLeaderboardsScreen = () => {
  const router = useRouter()
  const { logout } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("score")
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.9))
  const itemFadeRefs = useRef<Animated.Value[]>([])
  const itemSlideRefs = useRef<Animated.Value[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuAnimation = useRef(new Animated.Value(0)).current
  const [isLoading, setIsLoading] = useState(true)

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    RobotoMono_400Regular,
  })

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await authService.getAllStudents()
        console.log("Fetched students data:", data)
        
        // Sort students by score initially
        const sortedStudents = data.sort((a, b) => b.careerTotalScore - a.careerTotalScore)
        
        // Initialize animation refs
        itemFadeRefs.current = sortedStudents.map(() => new Animated.Value(0))
        itemSlideRefs.current = sortedStudents.map(() => new Animated.Value(50))
        
        setAllStudents(sortedStudents)
        setStudents(sortedStudents)
        
        // Start animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start()
        
        // Animate each item with a delay
        sortedStudents.forEach((_, index) => {
          const delay = index * 100
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(itemFadeRefs.current[index], {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.spring(itemSlideRefs.current[index], {
                toValue: 0,
                friction: 8,
                useNativeDriver: true,
              }),
            ]).start()
          }, delay)
        })
      } catch (error) {
        console.error("Failed to load students:", error)
        Alert.alert("Error", "Failed to load students data")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadStudents()
  }, [])

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    const filtered = allStudents.filter(student => 
      student.lastName.toLowerCase().includes(text.toLowerCase()) ||
      student.firstName.toLowerCase().includes(text.toLowerCase())
    )
    setStudents(filtered)
  }

  const handleSort = (option: SortOption) => {
    setSortBy(option)
    let sorted = [...allStudents]
    if (searchQuery) {
      sorted = sorted.filter(student => 
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    sorted.sort((a, b) => {
      if (option === "name") {
        return a.lastName.localeCompare(b.lastName)
      } else {
        return b.careerTotalScore - a.careerTotalScore
      }
    })
    setStudents(sorted)
  }

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1
    setIsMenuOpen(!isMenuOpen)
    Animated.spring(menuAnimation, {
      toValue,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  })

  const menuOpacity = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      Alert.alert("Logout Error", "Failed to log out. Please try again.")
    }
  }

  const handleProfile = () => {
    // Navigate to profile page
    router.push("/profile")
  }

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#0F0A1F", "#1A1245"]}
          style={styles.background}
        >
          <Text style={styles.loadingText}>LOADING STUDENTS DATA...</Text>
        </LinearGradient>
      </View>
    )
  }

  const renderLeaderboardItem = (student: Student, index: number) => {
    const itemFade = itemFadeRefs.current[index]
    const itemSlide = itemSlideRefs.current[index]

    return (
      <Animated.View
        key={student.userId.toString()}
        style={[
          styles.leaderboardItem,
          {
            opacity: itemFade,
            transform: [{ translateY: itemSlide }],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(50, 50, 80, 0.6)", "rgba(30, 30, 60, 0.6)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={styles.rankContainer}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              {student.lastName}, {student.firstName}
            </Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {(student.careerTotalScore || 0).toLocaleString()}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#0F0A1F", "#1A1245"]} style={styles.background}>
        <LinearGradient colors={["rgba(0, 0, 0, 0.7)", "rgba(20, 20, 40, 0.9)"]} style={styles.overlay}>
          {/* Profile Button */}
          <View style={styles.menuContainer}>
            <Pressable
              onPress={toggleMenu}
              style={({ pressed }) => [
                styles.menuButton,
                pressed && styles.menuButtonPressed,
              ]}
            >
              <LinearGradient
                colors={["rgba(147, 51, 234, 0.3)", "rgba(79, 70, 229, 0.3)"]}
                style={styles.menuButtonGradient}
              >
                <Ionicons name="person" size={22} color="#FF00FF" />
              </LinearGradient>
            </Pressable>

            {/* Menu Options */}
            <Animated.View
              style={[
                styles.menuOptions,
                {
                  transform: [{ translateY: menuTranslateY }],
                  opacity: menuOpacity,
                },
              ]}
              pointerEvents={isMenuOpen ? "auto" : "none"}
            >
              <LinearGradient
                colors={["rgba(15, 10, 31, 0.95)", "rgba(26, 18, 69, 0.95)"]}
                style={styles.menuOptionsGradient}
              >
                <Pressable
                  onPress={handleProfile}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <View style={styles.menuItemContent}>
                    <View style={styles.profileIconPlaceholder}>
                      <Ionicons name="person-outline" size={20} color="#FF00FF" />
                    </View>
                    <Text style={styles.menuItemText}>Profile Information</Text>
                  </View>
                </Pressable>

                <View style={styles.menuDivider} />

                <Pressable
                  onPress={handleLogout}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <View style={styles.menuItemContent}>
                    <Ionicons name="log-out-outline" size={20} color="#FF00FF" />
                    <Text style={styles.menuItemText}>Logout</Text>
                  </View>
                </Pressable>
              </LinearGradient>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.headerTitle}>ELEMENTOPIA</Text>
            <Text style={styles.headerSubtitle}>TEACHER </Text>
            <Text style={styles.headerSubtitle}>DASHBOARD</Text>
            <View style={styles.headerDivider} />
          </Animated.View>

          {/* Search and Sort Controls */}
          <View style={styles.controlsContainer}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#FF00FF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            <View style={styles.sortContainer}>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === "score" && styles.activeSortButton]}
                onPress={() => handleSort("score")}
              >
                <Text style={styles.sortButtonText}>Score</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === "name" && styles.activeSortButton]}
                onPress={() => handleSort("name")}
              >
                <Text style={styles.sortButtonText}>Name</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.rankHeader]}>RANK</Text>
            <Text style={[styles.tableHeaderText, styles.nameHeader]}>STUDENT</Text>
            <Text style={[styles.tableHeaderText, styles.scoreHeader]}>SCORE</Text>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {students.map((student, index) => renderLeaderboardItem(student, index))}
          </ScrollView>

          <View style={styles.footerContainer}>
            <LinearGradient
              colors={["rgba(147, 51, 234, 0.2)", "rgba(79, 70, 229, 0.2)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.footerGradient}
            >
              <Text style={styles.footerText}>CAREER TOTAL SCORES</Text>
            </LinearGradient>
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0A1F",
  },
  background: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    marginTop: 35,
    fontSize: 25,
    fontFamily: "PressStart2P_400Regular",
    color: "#FF00FF",
    textShadowColor: "rgba(255, 0, 255, 0.8)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 25,
    fontFamily: "PressStart2P_400Regular",
    color: "#00FFF0",
    marginTop: 10,
    textShadowColor: "rgba(0, 255, 240, 0.8)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    letterSpacing: 2,
  },
  headerDivider: {
    width: width * 0.7,
    height: 2,
    backgroundColor: "#9333EA",
    marginTop: 20,
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingText: {
    fontFamily: "PressStart2P_400Regular",
    fontSize: 16,
    color: "#00FFF0",
    textAlign: "center",
    marginTop: 200,
    textShadowColor: "rgba(0, 255, 240, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 14,
    paddingVertical: 8,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  activeSortButton: {
    backgroundColor: "rgba(147, 51, 234, 0.3)",
  },
  sortButtonText: {
    color: "#FFFFFF",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 14,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(147, 51, 234, 0.3)",
    backgroundColor: "rgba(15, 10, 31, 0.9)",
  },
  tableHeaderText: {
    color: "#00FFF0",
    fontFamily: "PressStart2P_400Regular",
    fontSize: 12,
    textShadowColor: "rgba(0, 255, 240, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  rankHeader: {
    width: "15%",
  },
  nameHeader: {
    width: "60%",
  },
  scoreHeader: {
    width: "25%",
    textAlign: "right",
  },
  scrollView: {
    flex: 1,
  },
  leaderboardItem: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#2B184C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  gradientBackground: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  rankContainer: {
    width: "15%",
    alignItems: "center",
  },
  nameContainer: {
    width: "60%",
    paddingHorizontal: 10,
  },
  nameText: {
    fontSize: 14,
    fontFamily: "RobotoMono_400Regular",
    color: "#fff",
  },
  scoreContainer: {
    width: "25%",
    alignItems: "flex-end",
  },
  scoreText: {
    fontSize: 14,
    fontFamily: "RobotoMono_400Regular",
    color: "#00FFF0",
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  footerGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  footerText: {
    color: "#FF00FF",
    fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    textShadowColor: "rgba(255, 0, 255, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  rankText: {
    fontSize: 18,
    fontFamily: "PressStart2P_400Regular",
    color: "#fff",
  },
  menuContainer: {
    position: "absolute",
    top: 20,
    right: 15,
    zIndex: 1000,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#FF00FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: "absolute",
    right: -5,
    top: 15,
  },
  menuButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  menuButtonGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.5)",
    borderRadius: 20,
    backgroundColor: "rgba(15, 10, 31, 0.9)",
  },
  menuOptions: {
    position: "absolute",
    top: 60,
    right: 10,
    width: 220,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#FF00FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuOptionsGradient: {
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
    borderRadius: 12,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemPressed: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileIconPlaceholder: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemText: {
    color: "#fff",
    fontFamily: "RobotoMono_400Regular",
    fontSize: 14,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(147, 51, 234, 0.3)",
    marginVertical: 8,
  },
})

export default TeacherLeaderboardsScreen