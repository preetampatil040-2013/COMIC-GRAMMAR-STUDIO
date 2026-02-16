
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  subject: string;
  description: string;
  icon: string;
}

export interface LessonContent {
  explanation: string;
  examples: string[];
  tips: string[];
  comicDialogue: string;
  professorTip: string;
  quiz: QuizQuestion[];
}

export interface Message {
  role: 'user' | 'model' | 'professor';
  text: string;
}

export type Subject = 'General' | 'Science' | 'History' | 'Literature' | 'Mathematics';
