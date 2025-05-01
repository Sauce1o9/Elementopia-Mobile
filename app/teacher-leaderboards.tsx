import React from "react"
import TeacherLeaderboardsScreen from "@/components/TeacherLeaderboardsScreen"
import { Stack } from "expo-router"

export default function TeacherDashboard() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      <TeacherLeaderboardsScreen />
    </>
  )
} 