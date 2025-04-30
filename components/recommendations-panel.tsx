import { AlertTriangle } from "lucide-react"
import type { Recommendation } from "@/types/recommendation"

interface RecommendationsPanelProps {
  recommendation: Recommendation
}

export default function RecommendationsPanel({ recommendation }: RecommendationsPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">{recommendation.title}</h3>
        <p className="text-muted-foreground mt-1">{recommendation.description}</p>
      </div>

      <ul className="space-y-2">
        {recommendation.tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="rounded-full bg-primary/10 p-1 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            </div>
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      {recommendation.warning && (
        <div className="flex items-center gap-2 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{recommendation.warning}</p>
        </div>
      )}
    </div>
  )
}
