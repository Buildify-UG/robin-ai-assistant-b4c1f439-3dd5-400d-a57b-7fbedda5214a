import { supabase } from './supabase';
import { Conversation, Message, UserMemory, Favorite, StudyTopic, Attachment } from '@/types';

// Conversations
export async function createConversation(userId: string, title?: string): Promise<Conversation> {
  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, title })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getConversation(conversationId: string): Promise<Conversation> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateConversation(
  conversationId: string,
  updates: Partial<Conversation>
): Promise<Conversation> {
  const { data, error } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', conversationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const { error } = await supabase.from('conversations').delete().eq('id', conversationId);
  if (error) throw error;
}

export async function searchConversations(userId: string, query: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Messages
export async function createMessage(
  conversationId: string,
  senderType: 'user' | 'assistant',
  text: string
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_type: senderType,
      text,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateMessage(messageId: string, text: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .update({ text })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMessage(messageId: string): Promise<void> {
  const { error } = await supabase.from('messages').delete().eq('id', messageId);
  if (error) throw error;
}

// User Memories
export async function createMemory(userId: string, text: string): Promise<UserMemory> {
  const { data, error } = await supabase
    .from('user_memories')
    .insert({ user_id: userId, text, enabled: true })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserMemories(userId: string): Promise<UserMemory[]> {
  const { data, error } = await supabase
    .from('user_memories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateMemory(memoryId: string, updates: Partial<UserMemory>): Promise<UserMemory> {
  const { data, error } = await supabase
    .from('user_memories')
    .update(updates)
    .eq('id', memoryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMemory(memoryId: string): Promise<void> {
  const { error } = await supabase.from('user_memories').delete().eq('id', memoryId);
  if (error) throw error;
}

export async function clearAllMemories(userId: string): Promise<void> {
  const { error } = await supabase.from('user_memories').delete().eq('user_id', userId);
  if (error) throw error;
}

// Favorites
export async function addFavorite(
  userId: string,
  messageId: string,
  conversationId: string
): Promise<Favorite> {
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, message_id: messageId, conversation_id: conversationId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFavorites(userId: string): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  const { error } = await supabase.from('favorites').delete().eq('id', favoriteId);
  if (error) throw error;
}

export async function isFavorited(messageId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('message_id', messageId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

// Attachments
export async function createAttachment(attachment: Partial<Attachment>): Promise<Attachment> {
  const { data, error } = await supabase
    .from('attachments')
    .insert(attachment)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMessageAttachments(messageId: string): Promise<Attachment[]> {
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('message_id', messageId);

  if (error) throw error;
  return data || [];
}

export async function deleteAttachment(attachmentId: string): Promise<void> {
  const { error } = await supabase.from('attachments').delete().eq('id', attachmentId);
  if (error) throw error;
}

// Study Topics
export async function createStudyTopic(
  userId: string,
  subject: string,
  topic: string
): Promise<StudyTopic> {
  const { data, error } = await supabase
    .from('study_topics')
    .insert({ user_id: userId, subject, topic })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getStudyTopics(userId: string): Promise<StudyTopic[]> {
  const { data, error } = await supabase
    .from('study_topics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateStudyTopic(topicId: string, status: string): Promise<StudyTopic> {
  const { data, error } = await supabase
    .from('study_topics')
    .update({ completion_status: status })
    .eq('id', topicId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStudyTopic(topicId: string): Promise<void> {
  const { error } = await supabase.from('study_topics').delete().eq('id', topicId);
  if (error) throw error;
}
