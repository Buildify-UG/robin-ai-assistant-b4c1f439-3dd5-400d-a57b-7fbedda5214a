ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON conversations FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create messages in own conversations" ON messages FOR INSERT WITH CHECK (
  conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete own messages" ON messages FOR DELETE USING (
  conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
);

ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attachments" ON attachments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create attachments" ON attachments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own attachments" ON attachments FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE user_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own memories" ON user_memories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create memories" ON user_memories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memories" ON user_memories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memories" ON user_memories FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE study_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own study topics" ON study_topics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create study topics" ON study_topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study topics" ON study_topics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own study topics" ON study_topics FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own quizzes" ON quizzes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create quizzes" ON quizzes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quizzes" ON quizzes FOR UPDATE USING (auth.uid() = user_id);