//questão
export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  mediaType: '3d' | 'image';
  mediaUrl: string;
  curiosity: string;
  year?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}
//seção de quiz
export interface QuizSession {
  id: string;
  userId: number;
  questions: Question[];
  currentQuestionIndex: number;
  answers: UserAnswer[];
  score: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}
//seção de resposta do usuário
export interface UserAnswer {
  questionId: number;
  selectedAnswer: string | null; // Permite null para respostas não marcadas
  isCorrect: boolean;
  timeSpent: number;
  question: string;
  correctAnswer: string;
  wasAnswered: boolean; // Indica se a pergunta foi respondida
}

