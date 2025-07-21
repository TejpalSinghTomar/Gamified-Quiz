"use client"

import { motion } from "framer-motion"
import { Trophy, Share2, RotateCcw, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { badges, type Badge as BadgeType } from "../types/badge"
import { useEffect, useState } from "react"

interface QuizResultsProps {
  score: number
  totalQuestions: number
  category: string
  timeElapsed: number
  onRestart: () => void
  onAddToLeaderboard: (playerName: string) => void
}

export function QuizResults({
  score,
  totalQuestions,
  category,
  timeElapsed,
  onRestart,
  onAddToLeaderboard,
}: QuizResultsProps) {
  const [playerName, setPlayerName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)
  const [earnedBadges, setEarnedBadges] = useState<BadgeType[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  const percentage = Math.round((score / totalQuestions) * 100)
  const timeInMinutes = Math.floor(timeElapsed / 60000)
  const timeInSeconds = Math.floor((timeElapsed % 60000) / 1000)

  useEffect(() => {
    // Check for earned badges
    const earned = badges.filter((badge) => {
      if (badge.id === "perfect-score") return badge.requirement(score, totalQuestions)
      if (badge.id === "speed-demon") return timeElapsed < 120000 // 2 minutes
      if (badge.id === "knowledge-seeker") return badge.requirement(score, totalQuestions)
      return false
    })

    setEarnedBadges(earned)

    // Show confetti for good scores
    if (percentage >= 70) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [score, totalQuestions, percentage, timeElapsed])

  const getMotivationalMessage = () => {
    if (percentage === 100) return "Perfect! You're a quiz master! 🏆"
    if (percentage >= 80) return "Excellent work! You're really smart! 🌟"
    if (percentage >= 60) return "Good job! Keep learning! 📚"
    if (percentage >= 40) return "Not bad! Practice makes perfect! 💪"
    return "Don't give up! Every expert was once a beginner! 🚀"
  }

  const handleShare = async () => {
    const shareText = `I just scored ${score}/${totalQuestions} (${percentage}%) on the ${category} quiz! 🎯`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quiz Results",
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText)
      alert("Results copied to clipboard!")
    }
  }

  const handleSaveScore = () => {
    if (playerName.trim()) {
      onAddToLeaderboard(playerName.trim())
      setShowNameInput(false)
      setPlayerName("")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center">
          <CardHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-8xl mb-4"
            >
              {percentage >= 80 ? "🏆" : percentage >= 60 ? "🎉" : percentage >= 40 ? "👍" : "💪"}
            </motion.div>
            <CardTitle className="text-3xl font-bold mb-2">Quiz Complete!</CardTitle>
            <p className="text-xl text-gray-600">{getMotivationalMessage()}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {timeInMinutes}:{timeInSeconds.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
            </div>

            {/* Badges */}
            {earnedBadges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Badges Earned!
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {earnedBadges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7 + index * 0.2, type: "spring" }}
                    >
                      <Badge variant="secondary" className="p-2 text-sm">
                        <span className="mr-1">{badge.icon}</span>
                        {badge.name}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Name Input for Leaderboard */}
            {showNameInput ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <input
                  type="text"
                  placeholder="Enter your name for leaderboard"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-3 border rounded-lg text-center"
                  maxLength={20}
                />
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleSaveScore} disabled={!playerName.trim()}>
                    Save Score
                  </Button>
                  <Button variant="outline" onClick={() => setShowNameInput(false)}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Action Buttons */
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={onRestart} size="lg" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button onClick={handleShare} variant="outline" size="lg" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Results
                </Button>
                <Button
                  onClick={() => setShowNameInput(true)}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Save to Leaderboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
