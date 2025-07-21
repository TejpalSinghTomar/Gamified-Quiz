"use client"

import { motion } from "framer-motion"
import { Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Question } from "../data/questions"

interface QuizQuestionProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  timeLeft: number
  selectedAnswer: number | null
  showResult: boolean
  onSelectAnswer: (index: number) => void
  score: number
}

export function QuizQuestion({
  question,
  currentIndex,
  totalQuestions,
  timeLeft,
  selectedAnswer,
  showResult,
  onSelectAnswer,
  score,
}: QuizQuestionProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const timeProgress = (timeLeft / 15) * 100

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {question.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-lg">{score}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Timer */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          animate={{ scale: timeLeft <= 5 ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: timeLeft <= 5 ? Number.POSITIVE_INFINITY : 0, duration: 0.5 }}
        >
          <Clock className={`w-5 h-5 ${timeLeft <= 5 ? "text-red-500" : "text-blue-500"}`} />
          <div className="w-32">
            <Progress value={timeProgress} className={`h-3 ${timeLeft <= 5 ? "bg-red-100" : "bg-blue-100"}`} />
          </div>
          <span className={`font-bold text-lg ${timeLeft <= 5 ? "text-red-500" : "text-blue-600"}`}>{timeLeft}s</span>
        </motion.div>
      </div>

      {/* Question */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">{question.question}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => {
                let buttonVariant: "default" | "destructive" | "outline" | "secondary" = "outline"
                let extraClasses = ""

                if (showResult) {
                  if (index === question.correctAnswer) {
                    buttonVariant = "default"
                    extraClasses = "bg-green-500 hover:bg-green-600 text-white border-green-500"
                  } else if (index === selectedAnswer && selectedAnswer !== question.correctAnswer) {
                    buttonVariant = "destructive"
                    extraClasses = "bg-red-500 hover:bg-red-600 text-white border-red-500"
                  }
                }

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                  >
                    <Button
                      variant={buttonVariant}
                      className={`w-full h-16 text-left justify-start p-4 text-wrap ${extraClasses}`}
                      onClick={() => onSelectAnswer(index)}
                      disabled={showResult}
                    >
                      <span className="font-semibold mr-3 text-lg">{String.fromCharCode(65 + index)}.</span>
                      <span className="text-base">{option}</span>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Result Animation */}
      {showResult && (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          {selectedAnswer === question.correctAnswer ? (
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} className="text-6xl mb-2">
              🎉
            </motion.div>
          ) : (
            <motion.div initial={{ rotate: 10 }} animate={{ rotate: 0 }} className="text-6xl mb-2">
              😔
            </motion.div>
          )}
          <p
            className={`text-xl font-bold ${
              selectedAnswer === question.correctAnswer ? "text-green-600" : "text-red-600"
            }`}
          >
            {selectedAnswer === question.correctAnswer
              ? "Correct!"
              : selectedAnswer === -1
                ? "Time's up!"
                : "Incorrect!"}
          </p>
        </motion.div>
      )}
    </div>
  )
}
