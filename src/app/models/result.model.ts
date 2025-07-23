//resultados do quiz
export interface QuizResult {
  id: number;
  userId: number;
  userName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
  timeSpent: number;
  answers: UserAnswer[];
}
//ranking de pontuação
export interface ScoreRank {
  rank: number;
  name: string;
  score: number;
  percentage: number;
  date: Date;
}
//modelo de resposta do usuário
export interface UserAnswer {
  questionId: number;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}