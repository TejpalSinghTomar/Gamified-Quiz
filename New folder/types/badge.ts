export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: (score: number, total: number) => boolean
  color: string
}

export const badges: Badge[] = [
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Answer all questions correctly!",
    icon: "🏆",
    requirement: (score, total) => score === total,
    color: "text-yellow-500",
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete quiz in under 2 minutes",
    icon: "⚡",
    requirement: () => true, // We'll handle this in the component
    color: "text-blue-500",
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Score 80% or higher",
    icon: "🧠",
    requirement: (score, total) => score / total >= 0.8,
    color: "text-purple-500",
  },
  {
    id: "persistent",
    name: "Persistent",
    description: "Complete 5 quizzes",
    icon: "💪",
    requirement: () => true, // We'll handle this in localStorage
    color: "text-green-500",
  },
]
