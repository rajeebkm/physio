-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth TIMESTAMP,
    gender VARCHAR(20) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')),
    profile_image TEXT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('PATIENT', 'DOCTOR', 'PHYSIOTHERAPIST', 'ADMIN', 'CLINIC_MANAGER')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient profiles table
CREATE TABLE patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    emergency_contact_relationship VARCHAR(50),
    medical_history TEXT[],
    allergies TEXT[],
    current_medications TEXT[],
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(100),
    insurance_expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor profiles table
CREATE TABLE doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    qualifications TEXT[] NOT NULL,
    experience INTEGER NOT NULL DEFAULT 0,
    license_number VARCHAR(100) NOT NULL,
    license_expiry TIMESTAMP NOT NULL,
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    languages TEXT[] DEFAULT ARRAY['English'],
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    working_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
    working_hours_start TIME DEFAULT '09:00:00',
    working_hours_end TIME DEFAULT '18:00:00',
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_consultations INTEGER DEFAULT 0,
    bio TEXT,
    clinic_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Physiotherapist profiles table
CREATE TABLE physiotherapist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialization TEXT[] NOT NULL,
    qualifications TEXT[] NOT NULL,
    experience INTEGER NOT NULL DEFAULT 0,
    license_number VARCHAR(100) NOT NULL,
    license_expiry TIMESTAMP NOT NULL,
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    home_visit_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    languages TEXT[] DEFAULT ARRAY['English'],
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    working_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
    working_hours_start TIME DEFAULT '09:00:00',
    working_hours_end TIME DEFAULT '18:00:00',
    home_visit_radius INTEGER DEFAULT 10 CHECK (home_visit_radius >= 0 AND home_visit_radius <= 50),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_sessions INTEGER DEFAULT 0,
    bio TEXT,
    clinic_id UUID,
    equipment TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table for authentication
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX idx_doctor_profiles_user_id ON doctor_profiles(user_id);
CREATE INDEX idx_doctor_profiles_specialization ON doctor_profiles(specialization);
CREATE INDEX idx_doctor_profiles_clinic_id ON doctor_profiles(clinic_id);
CREATE INDEX idx_physiotherapist_profiles_user_id ON physiotherapist_profiles(user_id);
CREATE INDEX idx_physiotherapist_profiles_specialization ON physiotherapist_profiles USING GIN(specialization);
CREATE INDEX idx_physiotherapist_profiles_clinic_id ON physiotherapist_profiles(clinic_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_profiles_updated_at BEFORE UPDATE ON patient_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_profiles_updated_at BEFORE UPDATE ON doctor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_physiotherapist_profiles_updated_at BEFORE UPDATE ON physiotherapist_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
