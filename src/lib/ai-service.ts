import { supabase } from './supabase';
import { Message, UserMemory } from '@/types';

export async function callAIAPI(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMemories: UserMemory[] = [],
  conversationContext: string = ''
): Promise<{ text: string; error?: string }> {
  try {
    const systemPrompt = buildSystemPrompt(userMemories, conversationContext);

    const response = await supabase.functions.invoke('ai-chat', {
      body: {
        messages,
        systemPrompt,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || 'AI API error');
    }

    return {
      text: response.data?.text || 'No response from AI',
    };
  } catch (error) {
    console.error('AI API error:', error);
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Failed to get AI response',
    };
  }
}

function buildSystemPrompt(memories: UserMemory[], context: string): string {
  let prompt = `You are Robin AI, a helpful AI assistant designed to help with:
- General questions and explanations
- Civil Engineering topics (surveying, levelling, foundations, concrete, building materials, etc.)
- Mathematics and calculations
- Writing and text editing
- Language translation (English, Kiswahili)
- Study assistance and learning
- Technical explanations

Be helpful, accurate, and clear. Provide step-by-step explanations when appropriate.
When discussing Civil Engineering, use proper technical terminology.
Support both English and Kiswahili responses based on user preference.`;

  if (memories.length > 0) {
    const enabledMemories = memories
      .filter((m) => m.enabled)
      .map((m) => m.text)
      .join('\n');

    if (enabledMemories) {
      prompt += `\n\nUser Preferences and Information:\n${enabledMemories}`;
    }
  }

  if (context) {
    prompt += `\n\nConversation Context:\n${context}`;
  }

  return prompt;
}

export async function generateConversationTitle(firstMessage: string): Promise<string> {
  try {
    const response = await supabase.functions.invoke('generate-title', {
      body: {
        message: firstMessage,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data?.title || 'New Conversation';
  } catch (error) {
    console.error('Error generating title:', error);
    return 'New Conversation';
  }
}

export async function analyzeImage(
  imageBase64: string,
  question: string,
  userMemories: UserMemory[] = []
): Promise<{ text: string; error?: string }> {
  try {
    const systemPrompt = buildSystemPrompt(userMemories, '');

    const response = await supabase.functions.invoke('ai-vision', {
      body: {
        image: imageBase64,
        question,
        systemPrompt,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return {
      text: response.data?.text || 'Could not analyze image',
    };
  } catch (error) {
    console.error('Vision API error:', error);
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Failed to analyze image',
    };
  }
}

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<{ text: string; error?: string }> {
  try {
    const response = await supabase.functions.invoke('translate-text', {
      body: {
        text,
        sourceLanguage,
        targetLanguage,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return {
      text: response.data?.text || text,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      text,
      error: error instanceof Error ? error.message : 'Translation failed',
    };
  }
}

export async function generateQuizQuestions(
  subject: string,
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<{ questions: any[]; error?: string }> {
  try {
    const response = await supabase.functions.invoke('generate-quiz', {
      body: {
        subject,
        topic,
        difficulty,
        count: 5,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return {
      questions: response.data?.questions || [],
    };
  } catch (error) {
    console.error('Quiz generation error:', error);
    return {
      questions: [],
      error: error instanceof Error ? error.message : 'Failed to generate quiz',
    };
  }
}
