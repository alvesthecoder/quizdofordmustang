import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Question, QuizSession, UserAnswer } from '../models/question.model';
import { QuizResult, ScoreRank } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questionsSubject = new BehaviorSubject<Question[]>([]);
  public questions$ = this.questionsSubject.asObservable();

  private currentSessionSubject = new BehaviorSubject<QuizSession | null>(null);
  public currentSession$ = this.currentSessionSubject.asObservable();

  // Banco de dados de perguntas mockado
  private mockQuestions: Question[] = [
    {
      id: 1,
      question: "Em que ano foi lançado o primeiro Ford Mustang?",
      options: ["1963", "1964", "1965", "1966"],
      answer: "1964",
      mediaType: "3d",
      mediaUrl: "assets/models_3d/ford_mustang_-_1970_-_3000_tri_limit.circ",
      curiosity: "O Ford Mustang foi oficialmente apresentado ao público em 17 de abril de 1964, na Feira Mundial de Nova York.",
      year: 1964,
      difficulty: "easy"
    },
    {
      id: 2,
      question: "Qual é o nome do criador e principal designer do Ford Mustang?",
      options: ["Carroll Shelby", "Lee Iacocca", "Henry Ford II", "Donald Frey"],
      answer: "Lee Iacocca",
      mediaType: "image",
      mediaUrl: "https://cdn-images.motor.es/image/m/1320w/fotos-noticias/2019/07/lee-iacocca-1924-2019-201958872-1562254132_1.jpg",
      curiosity: "Lee Iacocca foi o visionário por trás do conceito do Mustang, criando um carro esportivo acessível para os jovens americanos.",
      year: 1964,
      difficulty: "medium"
    },
    {
      id: 3,
      question: "Qual foi a primeira geração do Mustang a oferecer um motor V8?",
      options: ["1964½", "1965", "1966", "1967"],
      answer: "1964½",
      mediaType: "3d",
      mediaUrl: "assets/models_3d/mustang_low_poly.circ",
      curiosity: "O motor V8 de 260 ci foi oferecido como opção desde o lançamento em 1964½, proporcionando mais potência aos entusiastas.",
      year: 1964,
      difficulty: "hard"
    },
    {
      id: 4,
      question: "Em qual filme o Mustang GT 500 'Eleanor' se tornou icônico?",
      options: ["Bullitt", "Gone in 60 Seconds", "Rush", "Ford v Ferrari"],
      answer: "Gone in 60 Seconds",
      mediaType: "image",
      mediaUrl: "https://s1.cdn.autoevolution.com/images/news/gallery/1967-ford-mustang-shelby-gt500-eleanor-from-gone-in-60-seconds-heads-to-auction_2.jpg",
      curiosity: "Durante as filmagens da perseguição com o Mustang Shelby GT500 'Eleanor', foram usadas mais de 11 réplicas do carro. Nicolas Cage, fã de automóveis, dirigiu pessoalmente várias cenas, dispensando dublês em boa parte delas.",
      year: 1968,
      difficulty: "medium"
    },
    {
      id: 5,
      question: "Qual é o nome da versão de alta performance do Mustang desenvolvida por Carroll Shelby?",
      options: ["Cobra", "GT500", "Shelby", "Boss"],
      answer: "Shelby",
      mediaType: "3d",
      mediaUrl: "assets/models_3d/vehicle_-_ford_mustang_shelby_gt500.circ",
      curiosity: "Carroll Shelby transformou o Mustang em uma máquina de corrida, criando os lendários Shelby GT350 e GT500.",
      year: 1965,
      difficulty: "easy"
    },
    {
      id: 6,
      question: "Em que década o Mustang passou por sua maior reformulação, conhecido como 'Mustang II'?",
      options: ["1960s", "1970s", "1980s", "1990s"],
      answer: "1970s",
      mediaType: "image",
      mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ford_Mustang_II_-_Flickr_-_Alexandre_Pr%C3%A9vot_%285%29.jpg/500px-Ford_Mustang_II_-_Flickr_-_Alexandre_Pr%C3%A9vot_%285%29.jpg",
      curiosity: "O Mustang II foi lançado em 1974 como resposta à crise do petróleo, sendo menor e mais econômico.",
      year: 1974,
      difficulty: "medium"
    },
    {
      id: 7,
      question: "Qual foi o ano de lançamento da quinta geração do Mustang?",
      options: ["2003", "2005", "2007", "2009"],
      answer: "2005",
      mediaType: "3d",
      mediaUrl: "assets/models_3d/ford_mustang_2005_lowpoly.circ",
      curiosity: "A quinta geração marcou o retorno às raízes do design clássico do Mustang original de 1964½.",
      year: 2005,
      difficulty: "hard"
    },
    {
      id: 8,
      question: "Qual é a potência do motor V8 5.0L Coyote do Mustang GT atual?",
      options: ["420 hp", "450 hp", "480 hp", "500 hp"],
      answer: "450 hp",
      mediaType: "image",
      mediaUrl: "https://http2.mlstatic.com/D_NQ_NP_2X_862853-MLA42927563588_072020-F.webp",
      curiosity: "O motor Coyote 5.0L é conhecido por sua confiabilidade e resposta excepcional em altas rotações.",
      year: 2018,
      difficulty: "hard"
    },
    {
      id: 9,
      question: "Em que país foi produzido o primeiro Mustang fora dos Estados Unidos?",
      options: ["México", "Canadá", "Brasil", "Alemanha"],
      answer: "México",
      mediaType: "image",
      mediaUrl: "https://api.fetimbahia.org.br/fotos/noticias/3914/IMAGEM_NOTICIA_2.jpg?v=8013f9c04206f455b9e6016ac660f8d2",
      curiosity: "A fábrica da Ford em Dearborn, Michigan, foi complementada pela produção no México para atender à demanda global.",
      year: 1965,
      difficulty: "medium"
    },
    {
      id: 10,
      question: "Qual é o nome do pacote de performance de pista da Ford para o Mustang?",
      options: ["Track Pack", "Performance Package", "Racing Package", "Sport Package"],
      answer: "Performance Package",
      mediaType: "image",
      mediaUrl: "https://valoragregado.com/wp-content/uploads/2025/05/unnamed-2025-05-06T090934.765.png",
      curiosity: "O Performance Package inclui suspensão esportiva, freios Brembo e pneus de alta performance.",
      year: 2015,
      difficulty: "medium"
    },
    {
      id: 11,
      question: "Quantos Mustangs foram vendidos no primeiro ano de produção?",
      options: ["100.000", "400.000", "680.000", "1.000.000"],
      answer: "680.000",
      mediaType: "3d",
      mediaUrl: "assets/models_3d/2024_ford_mustang_gt_low_poly.circ",
      curiosity: "O sucesso do Mustang foi imediato, superando todas as expectativas de vendas da Ford.",
      year: 1964,
      difficulty: "hard"
    },
    {
      id: 12,
      question: "Qual foi o primeiro Mustang a oferecer transmissão automática?",
      options: ["1964½", "1965", "1966", "1967"],
      answer: "1964½",
      mediaType: "image",
      mediaUrl: "https://www.estadao.com.br/resizer/v2/LDCDQWDUPRKJFKTEIOAG75MBXI.jpg?quality=80&auth=107cc81ee5062888a471ef71da5e80d927452e37cabaccab85ee43e9070bffd1&width=1262&height=710&smart=true",
      curiosity: "A transmissão automática C4 de 3 velocidades estava disponível desde o lançamento, tornando o Mustang acessível a mais pessoas.",
      year: 1964,
      difficulty: "medium"
    },
    {
      id: 13,
      question: "Em que ano o Mustang se tornou o primeiro pony car a ser vendido globalmente?",
      options: ["2012", "2015", "2018", "2020"],
      answer: "2015",
      mediaType: "3d",
      mediaUrl: "assets/models_3d/ford_mustang_svt_cobra_r_2000_low_poly.circ",
      curiosity: "A sexta geração do Mustang foi a primeira a ser oficialmente vendida em mercados como Europa, Ásia e Austrália.",
      year: 2015,
      difficulty: "hard"
    },
    {
      id: 14,
      question: "Qual é o nome da versão conversível do Mustang?",
      options: ["Convertible", "Cabriolet", "Roadster", "Spyder"],
      answer: "Convertible",
      mediaType: "image",
      mediaUrl: "https://media.ed.edmunds-media.com/ford/mustang/2025/oem/2025_ford_mustang_convertible_gt-premium_fq_oem_1_815.jpg",
      curiosity: "O Mustang Convertible oferece a experiência de dirigir ao ar livre mantendo toda a performance do modelo hardtop.",
      year: 1964,
      difficulty: "easy"
    },
    {
      id: 15,
      question: "Qual foi o ano do 50º aniversário do Ford Mustang?",
      options: ["2012", "2014", "2016", "2018"],
      answer: "2014",
      mediaType: "3d",
      mediaUrl: "assets/models_3d/low_poly_ford_mustang_65.circ",
      curiosity: "Em 2014, a Ford celebrou meio século do Mustang com edições especiais e eventos em todo o mundo.",
      year: 2014,
      difficulty: "easy"
    }
  ];

  private results: QuizResult[] = [];

  constructor() {
    this.questionsSubject.next(this.mockQuestions);
    this.loadResultsFromStorage();
  }

  getQuestions(): Observable<Question[]> {
    return of(this.mockQuestions).pipe(delay(500));
  }

  createQuizSession(userId: number): Observable<QuizSession> {
    const shuffledQuestions = this.shuffleArray([...this.mockQuestions]);
    const session: QuizSession = {
      id: this.generateSessionId(),
      userId,
      questions: shuffledQuestions,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      startTime: new Date(),
      completed: false
    };

    this.currentSessionSubject.next(session);
    return of(session).pipe(delay(300));
  }

  submitAnswer(answer: UserAnswer): Observable<boolean> {
    const session = this.currentSessionSubject.value;
    if (!session) return of(false);

    const question = session.questions[session.currentQuestionIndex];
    const isCorrect = answer.selectedAnswer === question.answer;
    
    // Define se foi respondida baseado na presença de selectedAnswer
    answer.wasAnswered = answer.selectedAnswer !== null;
    answer.isCorrect = isCorrect && answer.wasAnswered;
    answer.question = question.question;
    answer.correctAnswer = question.answer;
    
    session.answers.push(answer);
    
    // Só pontua se foi respondida E está correta
    if (isCorrect && answer.wasAnswered) {
      session.score++;
    }

    this.currentSessionSubject.next(session);
    return of(isCorrect && answer.wasAnswered).pipe(delay(200));
  }

  nextQuestion(): Observable<Question | null> {
    const session = this.currentSessionSubject.value;
    if (!session) return of(null);

    session.currentQuestionIndex++;
    
    if (session.currentQuestionIndex >= session.questions.length) {
      session.completed = true;
      session.endTime = new Date();
    }

    this.currentSessionSubject.next(session);
    
    return of(
      session.currentQuestionIndex < session.questions.length 
        ? session.questions[session.currentQuestionIndex] 
        : null
    ).pipe(delay(200));
  }

  finishQuiz(): Observable<QuizResult> {
    const session = this.currentSessionSubject.value;
    if (!session) throw new Error('No active session');

    session.endTime = new Date();
    const totalTime = session.endTime 
      ? session.endTime.getTime() - session.startTime.getTime() 
      : 0;

    // Conta perguntas não respondidas
    const unansweredCount = session.answers.filter(answer => !answer.wasAnswered).length;

    const result: QuizResult = {
      id: Date.now(),
      userId: session.userId,
      userName: JSON.parse(localStorage.getItem('currentUser') || '{}').name || 'Usuário',
      score: session.score,
      totalQuestions: session.questions.length,
      percentage: Math.round((session.score / session.questions.length) * 100),
      completedAt: new Date(),
      timeSpent: Math.round(totalTime / 1000),
      answers: session.answers,
      unansweredCount
    };

    this.results.push(result);
    this.saveResultsToStorage();
    this.currentSessionSubject.next(null);

    return of(result).pipe(delay(300));
  }

  getResults(): Observable<QuizResult[]> {
    return of(this.results).pipe(delay(200));
  }

  getTopScores(limit: number = 10): Observable<ScoreRank[]> {
    const topScores = this.results
      .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
      .slice(0, limit)
      .map((result, index) => ({
        rank: index + 1,
        name: result.userName,
        score: result.score,
        percentage: result.percentage,
        date: result.completedAt
      }));

    return of(topScores).pipe(delay(200));
  }

  // Admin methods
  addQuestion(question: Omit<Question, 'id'>): Observable<Question> {
    const newQuestion: Question = {
      ...question,
      id: Math.max(...this.mockQuestions.map(q => q.id)) + 1
    };
    
    this.mockQuestions.push(newQuestion);
    this.questionsSubject.next(this.mockQuestions);
    
    return of(newQuestion).pipe(delay(300));
  }

  updateQuestion(question: Question): Observable<Question> {
    const index = this.mockQuestions.findIndex(q => q.id === question.id);
    if (index !== -1) {
      this.mockQuestions[index] = question;
      this.questionsSubject.next(this.mockQuestions);
    }
    return of(question).pipe(delay(300));
  }

  deleteQuestion(questionId: number): Observable<boolean> {
    const index = this.mockQuestions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      this.mockQuestions.splice(index, 1);
      this.questionsSubject.next(this.mockQuestions);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private saveResultsToStorage(): void {
    localStorage.setItem('quizResults', JSON.stringify(this.results));
  }

  private loadResultsFromStorage(): void {
    const saved = localStorage.getItem('quizResults');
    if (saved) {
      this.results = JSON.parse(saved);
    }
  }
}

