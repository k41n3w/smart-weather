import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Sparkles, Bell, Sun } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "cloud":
        return <Cloud className="h-6 w-6" />
      case "sparkles":
        return <Sparkles className="h-6 w-6" />
      case "bell":
        return <Bell className="h-6 w-6" />
      case "sun":
        return <Sun className="h-6 w-6" />
      default:
        return <Cloud className="h-6 w-6" />
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
