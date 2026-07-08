
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS TABLE

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- URLS TABLE
CREATE TABLE urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    original_url TEXT NOT NULL,

    short_code VARCHAR(20) NOT NULL UNIQUE,

    custom_alias VARCHAR(50) UNIQUE,

    expires_at TIMESTAMPTZ,

    click_count BIGINT NOT NULL DEFAULT 0,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    user_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_url_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- CLICK EVENTS TABLE

CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    url_id UUID NOT NULL,

    ip_address VARCHAR(45),

    user_agent TEXT,

    referer TEXT,

    clicked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_urls_short_code
        FOREIGN KEY (url_id)
        REFERENCES urls(id)
        ON DELETE CASCADE
);


-- INDEXES

CREATE INDEX idx_urls_user_id
ON urls(user_id);

CREATE INDEX idx_urls_short_code
ON urls(short_code);

CREATE INDEX idx_click_events_url_id
ON click_events(url_id);

CREATE INDEX idx_click_events_clicked_at
ON click_events(clicked_at);