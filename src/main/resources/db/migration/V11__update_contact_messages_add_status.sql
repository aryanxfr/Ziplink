DROP INDEX IF EXISTS idx_contact_messages_read;
ALTER TABLE contact_messages DROP COLUMN IF EXISTS read;
ALTER TABLE contact_messages ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'NEW';
ALTER TABLE contact_messages ADD COLUMN deleted_at TIMESTAMPTZ;

CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_deleted_at ON contact_messages(deleted_at);
