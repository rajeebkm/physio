-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('CONSULTATION', 'THERAPY_SESSION', 'FOLLOW_UP', 'EMERGENCY')),
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED')),
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('VIDEO', 'AUDIO', 'IN_PERSON', 'HOME_VISIT')),
    scheduled_at TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL CHECK (duration >= 15 AND duration <= 180),
    notes TEXT,
    symptoms TEXT[] DEFAULT ARRAY[]::TEXT[],
    diagnosis TEXT,
    prescription TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultations table (extends appointments)
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    chief_complaint TEXT NOT NULL,
    medical_history TEXT,
    blood_pressure VARCHAR(20),
    heart_rate INTEGER,
    temperature DECIMAL(4,2),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    examination TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications table
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab tests table
CREATE TABLE lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('ROUTINE', 'URGENT', 'EMERGENCY')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapy sessions table (extends appointments)
CREATE TABLE therapy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    therapy_type VARCHAR(100) NOT NULL,
    pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
    mobility_score INTEGER CHECK (mobility_score >= 0 AND mobility_score <= 10),
    completed_exercises TEXT[] DEFAULT ARRAY[]::TEXT[],
    session_notes TEXT,
    pain_level_after INTEGER CHECK (pain_level_after >= 0 AND pain_level_after <= 10),
    mobility_score_after INTEGER CHECK (mobility_score_after >= 0 AND mobility_score_after <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    body_part TEXT[] NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    duration INTEGER NOT NULL CHECK (duration >= 0),
    repetitions INTEGER CHECK (repetitions >= 0),
    sets INTEGER CHECK (sets >= 0),
    equipment TEXT[] DEFAULT ARRAY[]::TEXT[],
    instructions TEXT NOT NULL,
    video_url TEXT,
    image_url TEXT,
    benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
    contraindications TEXT[] DEFAULT ARRAY[]::TEXT[],
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session exercises table (many-to-many relationship)
CREATE TABLE session_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapy_session_id UUID NOT NULL REFERENCES therapy_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL CHECK (duration >= 0),
    repetitions INTEGER CHECK (repetitions >= 0),
    sets INTEGER CHECK (sets >= 0),
    rest_time INTEGER DEFAULT 0 CHECK (rest_time >= 0),
    order_index INTEGER NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointment reschedules table
CREATE TABLE appointment_reschedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    old_scheduled_at TIMESTAMP NOT NULL,
    new_scheduled_at TIMESTAMP NOT NULL,
    reason TEXT,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointment cancellations table
CREATE TABLE appointment_cancellations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    reason TEXT,
    cancelled_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_type ON appointments(type);
CREATE INDEX idx_appointments_mode ON appointments(mode);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_consultations_appointment_id ON consultations(appointment_id);
CREATE INDEX idx_medications_consultation_id ON medications(consultation_id);
CREATE INDEX idx_lab_tests_consultation_id ON lab_tests(consultation_id);
CREATE INDEX idx_therapy_sessions_appointment_id ON therapy_sessions(appointment_id);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_body_part ON exercises USING GIN(body_part);
CREATE INDEX idx_exercises_is_active ON exercises(is_active);
CREATE INDEX idx_session_exercises_therapy_session_id ON session_exercises(therapy_session_id);
CREATE INDEX idx_session_exercises_exercise_id ON session_exercises(exercise_id);
CREATE INDEX idx_appointment_reschedules_appointment_id ON appointment_reschedules(appointment_id);
CREATE INDEX idx_appointment_cancellations_appointment_id ON appointment_cancellations(appointment_id);

-- Triggers for updated_at
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapy_sessions_updated_at BEFORE UPDATE ON therapy_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
