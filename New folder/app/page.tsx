"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Settings, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuizQuestion } from "../components/quiz-question"
import { QuizResults } from "../components/quiz-results"
import { Leaderboard } from "../components/leaderboard"
import { useQuiz } from "../hooks/useQuiz"
import { useLeaderboard } from "../hooks/useLeaderboard"
import { categories } from "../data/questions"

type GameState = "menu" | "quiz" | "results" | "leaderboard"

export default function QuizApp() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [questionCount, setQuestionCount] = useState(10)

  const quiz = useQuiz(selectedCategory, questionCount)
  const { leaderboard, addEntry } = useLeaderboard()

  const startQuiz = () => {
    quiz.initializeQuiz()
    setGameState("quiz")
  }

  const handleRestart = () => {
    setGameState("menu")
  }

  const handleAddToLeaderboard = (playerName: string) => {
    const timeElapsed = Date.now() - quiz.startTime
    addEntry({
      playerName,
      score: quiz.score,
      totalQuestions: quiz.totalQuestions,
      category: selectedCategory,
      timeElapsed,
    })
  }

  // Check if quiz is complete - move this logic into useEffect
  useEffect(() => {
    if (gameState === "quiz" && quiz.isQuizComplete) {
      setGameState("results")
    }
  }, [gameState, quiz.isQuizComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🎯 Quiz Master
          </h1>
          <p className="text-gray-600 text-lg">Test your knowledge and compete with others!</p>
        </motion.div>

        {/* Menu State */}
        {gameState === "menu" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quiz Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Questions</label>
                  <Select
                    value={questionCount.toString()}
                    onValueChange={(value) => setQuestionCount(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={startQuiz} size="lg" className="w-full flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start Quiz
              </Button>

              <Button
                onClick={() => setGameState("leaderboard")}
                variant="outline"
                size="lg"
                className="w-full flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                View Leaderboard
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quiz State */}
        {gameState === "quiz" && quiz.currentQuestion && (
          <QuizQuestion
            question={quiz.currentQuestion}
            currentIndex={quiz.currentQuestionIndex}
            totalQuestions={quiz.totalQuestions}
            timeLeft={quiz.timeLeft}
            selectedAnswer={quiz.selectedAnswer}
            showResult={quiz.showResult}
            onSelectAnswer={quiz.selectAnswer}
            score={quiz.score}
          />
        )}

        {/* Results State */}
        {gameState === "results" && (
          <QuizResults
            score={quiz.score}
            totalQuestions={quiz.totalQuestions}
            category={selectedCategory}
            timeElapsed={Date.now() - quiz.startTime}
            onRestart={handleRestart}
            onAddToLeaderboard={handleAddToLeaderboard}
          />
        )}

        {/* Leaderboard State */}
        {gameState === "leaderboard" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="mb-4">
              <Button onClick={() => setGameState("menu")} variant="outline">
                ← Back to Menu
              </Button>
            </div>
            <Leaderboard entries={leaderboard} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
