"use client"

import { useState, useEffect, useCallback } from "react"
import { type Question, questionBank } from "../data/questions"

export interface QuizState {
  currentQuestionIndex: number
  score: number
  timeLeft: number
  isActive: boolean
  selectedAnswer: number | null
  showResult: boolean
  questions: Question[]
  startTime: number
}

export function useQuiz(category = "All", questionCount = 10) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    timeLeft: 15,
    isActive: false,
    selectedAnswer: null,
    showResult: false,
    questions: [],
    startTime: 0,
  })

  const initializeQuiz = useCallback(() => {
    const filteredQuestions = category === "All" ? questionBank : questionBank.filter((q) => q.category === category)

    // Randomize questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length))

    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      timeLeft: 15,
      isActive: true,
      selectedAnswer: null,
      showResult: false,
      questions: selectedQuestions,
      startTime: Date.now(),
    })
  }, [category, questionCount])

  const selectAnswer = useCallback(
    (answerIndex: number) => {
      if (quizState.showResult) return

      setQuizState((prev) => ({
        ...prev,
        selectedAnswer: answerIndex,
        showResult: true,
        isActive: false,
      }))

      // Auto advance after showing result
      setTimeout(() => {
        setQuizState((prev) => {
          const isCorrect = answerIndex === prev.questions[prev.currentQuestionIndex]?.correctAnswer
          const newScore = isCorrect ? prev.score + 1 : prev.score
          const nextIndex = prev.currentQuestionIndex + 1

          if (nextIndex >= prev.questions.length) {
            // Quiz completed - set isActive to false and keep current index
            return {
              ...prev,
              score: newScore,
              isActive: false,
              showResult: false,
              currentQuestionIndex: prev.questions.length, // Set to length to indicate completion
            }
          }

          return {
            ...prev,
            currentQuestionIndex: nextIndex,
            score: newScore,
            timeLeft: 15,
            isActive: true,
            selectedAnswer: null,
            showResult: false,
          }
        })
      }, 2000)
    },
    [quizState.showResult],
  )

  const timeUp = useCallback(() => {
    if (!quizState.isActive) return
    selectAnswer(-1) // -1 indicates time up
  }, [quizState.isActive, selectAnswer])

  // Timer effect
  useEffect(() => {
    if (!quizState.isActive || quizState.showResult) return

    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeLeft <= 1) {
          timeUp()
          return prev
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizState.isActive, quizState.showResult, timeUp])

  const resetQuiz = useCallback(() => {
    initializeQuiz()
  }, [initializeQuiz])

  const isQuizComplete =
    quizState.currentQuestionIndex >= quizState.questions.length &&
    !quizState.isActive &&
    quizState.questions.length > 0

  return {
    ...quizState,
    initializeQuiz,
    selectAnswer,
    resetQuiz,
    isQuizComplete,
    currentQuestion: quizState.questions[quizState.currentQuestionIndex],
    totalQuestions: quizState.questions.length,
  }
}
