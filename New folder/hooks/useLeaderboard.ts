"use client"

import { useState, useEffect } from "react"

export interface LeaderboardEntry {
  id: string
  playerName: string
  score: number
  totalQuestions: number
  category: string
  date: string
  timeElapsed: number
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("quiz-leaderboard")
    if (saved) {
      setLeaderboard(JSON.parse(saved))
    }
  }, [])

  const addEntry = (entry: Omit<LeaderboardEntry, "id" | "date">) => {
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => {
        // Sort by score percentage first, then by time
        const aPercentage = a.score / a.totalQuestions
        const bPercentage = b.score / b.totalQuestions
        if (aPercentage !== bPercentage) {
          return bPercentage - aPercentage
        }
        return a.timeElapsed - b.timeElapsed
      })
      .slice(0, 10) // Keep top 10

    setLeaderboard(updatedLeaderboard)
    localStorage.setItem("quiz-leaderboard", JSON.stringify(updatedLeaderboard))
  }

  return { leaderboard, addEntry }
}
