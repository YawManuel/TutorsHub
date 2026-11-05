import { api } from './apiClient';

/**
 * Class > Practice question bank. Questions are served shuffled and capped to
 * `limit`; the quiz is stateless, so each question ships with its correct
 * answer and explanation for client-side immediate-feedback scoring.
 */

export interface QuestionOption {
  key: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface Question {
  id: string;
  grade: string;
  subject: string;
  number: number;
  curriculum: string; // GES | CAM | IB
  topic: string;
  question: string;
  options: QuestionOption[];
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D'
  explanation: string;
}

export interface QuestionQuery {
  grade: string;
  subject?: string;
  topic?: string;
  limit?: number;
}

/** The grade levels the question bank covers, with friendly labels. */
export const GRADE_LEVELS: { value: string; label: string }[] = [
  { value: 'grade3', label: 'Grade 3' },
  { value: 'grade4', label: 'Grade 4' },
  { value: 'grade5', label: 'Grade 5' },
  { value: 'grade6', label: 'Grade 6' },
  { value: 'grade7', label: 'Grade 7' },
  { value: 'grade8', label: 'Grade 8' },
  { value: 'grade9', label: 'Grade 9' },
  { value: 'grade10', label: 'Grade 10' },
  { value: 'grade11', label: 'Grade 11' },
  { value: 'grade12', label: 'Grade 12' },
  { value: 'lower_six', label: 'Lower Six' },
  { value: 'upper_six', label: 'Upper Six' },
];

export function gradeLabel(value: string): string {
  return GRADE_LEVELS.find((g) => g.value === value)?.label ?? value;
}

/** Session length per practice-set slug. */
export function sessionSize(setSlug: string): number {
  switch (setSlug) {
    case 'past-questions':
      return 20;
    case 'sample-exams':
      return 25;
    case 'aptitude-tests':
      return 15;
    default:
      return 10; // trial-questions and anything new
  }
}

export const questionsApi = {
  questions: (params: QuestionQuery) =>
    api.get<Question[]>('/practice/questions', { params }).then((r) => r.data),
  topics: (params: { grade: string; subject?: string }) =>
    api.get<string[]>('/practice/topics', { params }).then((r) => r.data),
};
