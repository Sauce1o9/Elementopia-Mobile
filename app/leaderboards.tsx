import React from "react"
import { Stack } from "expo-router"
import LeaderboardsScreen from "../components/LeaderboardsScreen"

export default function Leaderboards() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <LeaderboardsScreen />
    </>
  )
} 