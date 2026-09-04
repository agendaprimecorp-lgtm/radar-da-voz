-- ============================================
-- SISTEMA DE MENSAGENS (CHAT)
-- ============================================

-- Tabela de conversas
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (sender_id != recipient_id)
);

-- Índices
CREATE INDEX idx_conversations_sender_id ON conversations(sender_id);
CREATE INDEX idx_conversations_recipient_id ON conversations(recipient_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
CREATE UNIQUE INDEX idx_conversations_unique ON conversations(
  LEAST(sender_id, recipient_id),
  GREATEST(sender_id, recipient_id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_read ON messages(read);

-- RLS para conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can delete their conversations" ON conversations
  FOR DELETE
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- RLS para messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their messages" ON messages
  FOR UPDATE
  USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their messages" ON messages
  FOR DELETE
  USING (sender_id = auth.uid());

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET updated_at = NOW() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON messages;
CREATE TRIGGER trigger_update_conversation_timestamp
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- Grant
GRANT SELECT, INSERT, UPDATE, DELETE ON conversations TO psico360_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO psico360_app;
