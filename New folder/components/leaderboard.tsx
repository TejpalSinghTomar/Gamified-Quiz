"use client"

import { Trophy, Medal, Award, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LeaderboardEntry } from "../hooks/useLeaderboard"

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{index + 1}</span>
    }
  }

  const formatTime = (timeMs: number) => {
    const minutes = Math.floor(timeMs / 60000)
    const seconds = Math.floor((timeMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No scores yet. Be the first to complete a quiz!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const percentage = Math.round((entry.score / entry.totalQuestions) * 100)

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  index < 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(index)}
                  <div>
                    <div className="font-semibold">{entry.playerName}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {entry.category}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(entry.timeElapsed)}
                      </span>
                      <span className="text-xs">{formatDate(entry.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{percentage}%</div>
                  <div className="text-sm text-gray-600">
                    {entry.score}/{entry.totalQuestions}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
