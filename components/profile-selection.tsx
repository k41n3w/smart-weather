"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bike, Car, Leaf, Umbrella, Book } from "lucide-react"
import type { UserProfile } from "@/types/user"

interface ProfileSelectionProps {
  onProfileSelect: (profile: UserProfile) => void
}

export default function ProfileSelection({ onProfileSelect }: ProfileSelectionProps) {
  const profiles: UserProfile[] = [
    {
      type: "athlete",
      name: "Athlete",
      description: "Get recommendations for training and outdoor activities",
      icon: <Bike className="h-6 w-6" />,
    },
    {
      type: "driver",
      name: "Driver",
      description: "Receive road condition updates and driving tips",
      icon: <Car className="h-6 w-6" />,
    },
    {
      type: "farmer",
      name: "Farmer",
      description: "Get agricultural insights based on weather conditions",
      icon: <Leaf className="h-6 w-6" />,
    },
    {
      type: "tourist",
      name: "Tourist",
      description: "Find weather-appropriate activities and attractions",
      icon: <Umbrella className="h-6 w-6" />,
    },
    {
      type: "student",
      name: "Student",
      description: "Plan your study and campus activities around the weather",
      icon: <Book className="h-6 w-6" />,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Profile</CardTitle>
        <CardDescription>Choose a profile to get personalized weather recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <Button
              key={profile.type}
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 gap-3 hover:bg-muted/50"
              onClick={() => onProfileSelect(profile)}
            >
              <div className="bg-primary/10 p-3 rounded-full">{profile.icon}</div>
              <div className="font-medium">{profile.name}</div>
              <div className="text-xs text-center text-muted-foreground">{profile.description}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
