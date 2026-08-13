### Requirements
- Complete AI chat interface with message composer (➕ Add | Type message | 🎤 Voice | ➤ Send)
- Attachment system: images, documents, files with preview
- Secure AI API integration (OpenAI/Claude) via edge functions
- Conversation memory + user memory system
- Conversation history with search, rename, delete
- User authentication (signup, login, profile)
- Favorites system to save responses
- AI Tools: Writing, Translator, Math, Study, Engineering
- Engineering calculators with formulas
- Voice features: speech-to-text, text-to-speech
- Study progress tracking
- Settings: profile, language, dark mode, notifications
- Onboarding flow
- Bottom navigation: Home, History, Tools, Favorites, Profile
- Dark mode support
- Error handling and loading states
- Row-level security on all user data

### Designs
- Mobile-first responsive design
- Modern chat interface with clean bubbles
- Professional Robin AI branding
- Light and dark color schemes
- Accessible typography and spacing

### Tasks

#### Phase 1: Database & Auth
- [ ] Set up Supabase database schema
- [ ] Create Users, Conversations, Messages tables
- [ ] Create Memories, Favorites, Study tables
- [ ] Implement user authentication
- [ ] Create profile page

#### Phase 2: Core Chat
- [ ] Build main chat interface
- [ ] Create message composer with ➕ button
- [ ] Implement conversation history display
- [ ] Add typing indicators
- [ ] Integrate AI API (secure via edge function)

#### Phase 3: Memory & Attachments
- [ ] Implement conversation memory
- [ ] Create user memory system
- [ ] Build attachment upload (images, documents)
- [ ] Add attachment preview/removal
- [ ] Implement image analysis via AI

#### Phase 4: Features
- [ ] Build conversation history screen
- [ ] Create favorites system
- [ ] Implement search functionality
- [ ] Add copy/regenerate/save actions

#### Phase 5: AI Tools
- [ ] Writing assistant
- [ ] Translator
- [ ] Math assistant
- [ ] Study assistant
- [ ] Engineering tools

#### Phase 6: Polish
- [ ] Dark mode
- [ ] Onboarding
- [ ] Error states
- [ ] Loading states
- [ ] Design refinement
