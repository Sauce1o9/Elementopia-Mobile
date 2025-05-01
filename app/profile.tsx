import React from "react"
import { Stack } from "expo-router"
import ProfileScreen from "@/components/ProfileScreen"

export default function Profile() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      <ProfileScreen />
    </>
  )
} 