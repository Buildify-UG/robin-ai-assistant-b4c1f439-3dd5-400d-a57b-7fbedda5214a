export interface User {
  id: string;
  email: string;
  name?: string;
  profile_picture_url?: string;
  language: string;
  dark_mode: boolean;
  notifications_enabled: boolean;
  memory_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'assistant';
  text: string;
  timestamp: string;
  created_at: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  message_id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_path: string;
  file_size?: number;
  created_at: string;
}

export interface UserMemory {
  id: string;
  user_id: string;
  text: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  message_id: string;
  conversation_id: string;
  created_at: string;
}

export interface StudyTopic {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  completion_status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  subject: string;
  questions: QuestionData[];
  score?: number;
  total_questions?: number;
  created_at: string;
}

export interface QuestionData {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  user_answer?: string;
}

export interface AIResponse {
  text: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}
