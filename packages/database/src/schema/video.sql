-- Video sessions table
CREATE TABLE video_sessions (
    id VARCHAR(255) PRIMARY KEY,
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    channel_name VARCHAR(255) NOT NULL,
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ENDED', 'EXPIRED', 'CANCELLED')),
    patient_joined_at TIMESTAMP,
    provider_joined_at TIMESTAMP,
    patient_left_at TIMESTAMP,
    provider_left_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video recordings table
CREATE TABLE video_recordings (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL REFERENCES video_sessions(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'RECORDING' CHECK (status IN ('RECORDING', 'COMPLETED', 'FAILED')),
    file_url TEXT,
    file_size BIGINT,
    duration INTEGER, -- in seconds
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    started_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ended_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video call analytics table
CREATE TABLE video_call_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL REFERENCES video_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'join', 'leave', 'mute', 'unmute', 'video_on', 'video_off'
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_video_sessions_appointment_id ON video_sessions(appointment_id);
CREATE INDEX idx_video_sessions_patient_id ON video_sessions(patient_id);
CREATE INDEX idx_video_sessions_provider_id ON video_sessions(provider_id);
CREATE INDEX idx_video_sessions_status ON video_sessions(status);
CREATE INDEX idx_video_sessions_created_at ON video_sessions(created_at);
CREATE INDEX idx_video_recordings_session_id ON video_recordings(session_id);
CREATE INDEX idx_video_recordings_status ON video_recordings(status);
CREATE INDEX idx_video_call_analytics_session_id ON video_call_analytics(session_id);
CREATE INDEX idx_video_call_analytics_user_id ON video_call_analytics(user_id);
CREATE INDEX idx_video_call_analytics_event_type ON video_call_analytics(event_type);
CREATE INDEX idx_video_call_analytics_timestamp ON video_call_analytics(timestamp);

-- Triggers for updated_at
CREATE TRIGGER update_video_sessions_updated_at BEFORE UPDATE ON video_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
