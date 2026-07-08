CREATE TABLE password_reset_tokens (

    id UUID PRIMARY KEY,

    token VARCHAR(255) NOT NULL UNIQUE,

    user_id UUID NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    used_at TIMESTAMP,

    CONSTRAINT fk_password_reset_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);