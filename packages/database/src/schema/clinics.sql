-- Clinics table
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('HOSPITAL', 'CLINIC', 'PHYSIOTHERAPY_CENTER', 'WELLNESS_CENTER')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED')),
    description TEXT,
    street VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website TEXT,
    logo TEXT,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    monday_open BOOLEAN DEFAULT TRUE,
    monday_start TIME DEFAULT '09:00:00',
    monday_end TIME DEFAULT '18:00:00',
    tuesday_open BOOLEAN DEFAULT TRUE,
    tuesday_start TIME DEFAULT '09:00:00',
    tuesday_end TIME DEFAULT '18:00:00',
    wednesday_open BOOLEAN DEFAULT TRUE,
    wednesday_start TIME DEFAULT '09:00:00',
    wednesday_end TIME DEFAULT '18:00:00',
    thursday_open BOOLEAN DEFAULT TRUE,
    thursday_start TIME DEFAULT '09:00:00',
    thursday_end TIME DEFAULT '18:00:00',
    friday_open BOOLEAN DEFAULT TRUE,
    friday_start TIME DEFAULT '09:00:00',
    friday_end TIME DEFAULT '18:00:00',
    saturday_open BOOLEAN DEFAULT TRUE,
    saturday_start TIME DEFAULT '09:00:00',
    saturday_end TIME DEFAULT '18:00:00',
    sunday_open BOOLEAN DEFAULT FALSE,
    sunday_start TIME,
    sunday_end TIME,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Physiotherapy centers specific fields
CREATE TABLE physiotherapy_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    specializations TEXT[] NOT NULL,
    equipment TEXT[] DEFAULT ARRAY[]::TEXT[],
    services TEXT[] DEFAULT ARRAY[]::TEXT[],
    home_visit_available BOOLEAN DEFAULT FALSE,
    home_visit_radius INTEGER DEFAULT 0 CHECK (home_visit_radius >= 0 AND home_visit_radius <= 50),
    consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    home_visit_fee DECIMAL(10,2) DEFAULT 0,
    insurance_accepted TEXT[] DEFAULT ARRAY[]::TEXT[],
    languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals specific fields
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    departments TEXT[] NOT NULL,
    emergency_services BOOLEAN DEFAULT FALSE,
    ambulance_service BOOLEAN DEFAULT FALSE,
    icu_beds INTEGER DEFAULT 0 CHECK (icu_beds >= 0),
    general_beds INTEGER DEFAULT 0 CHECK (general_beds >= 0),
    accreditation TEXT[] DEFAULT ARRAY[]::TEXT[],
    insurance_accepted TEXT[] DEFAULT ARRAY[]::TEXT[],
    languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinic staff table
CREATE TABLE clinic_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('OWNER', 'MANAGER', 'DOCTOR', 'PHYSIOTHERAPIST', 'RECEPTIONIST', 'NURSE')),
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinic reviews table
CREATE TABLE clinic_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinic amenities table
CREATE TABLE clinic_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinic amenities mapping table
CREATE TABLE clinic_amenity_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES clinic_amenities(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(clinic_id, amenity_id)
);

-- Indexes for performance
CREATE INDEX idx_clinics_type ON clinics(type);
CREATE INDEX idx_clinics_status ON clinics(status);
CREATE INDEX idx_clinics_city ON clinics(city);
CREATE INDEX idx_clinics_state ON clinics(state);
CREATE INDEX idx_clinics_pincode ON clinics(pincode);
CREATE INDEX idx_clinics_rating ON clinics(rating);
CREATE INDEX idx_clinics_location ON clinics USING GIST (POINT(longitude, latitude));
CREATE INDEX idx_physiotherapy_centers_clinic_id ON physiotherapy_centers(clinic_id);
CREATE INDEX idx_physiotherapy_centers_specializations ON physiotherapy_centers USING GIN(specializations);
CREATE INDEX idx_hospitals_clinic_id ON hospitals(clinic_id);
CREATE INDEX idx_hospitals_departments ON hospitals USING GIN(departments);
CREATE INDEX idx_clinic_staff_clinic_id ON clinic_staff(clinic_id);
CREATE INDEX idx_clinic_staff_user_id ON clinic_staff(user_id);
CREATE INDEX idx_clinic_staff_role ON clinic_staff(role);
CREATE INDEX idx_clinic_reviews_clinic_id ON clinic_reviews(clinic_id);
CREATE INDEX idx_clinic_reviews_patient_id ON clinic_reviews(patient_id);
CREATE INDEX idx_clinic_reviews_rating ON clinic_reviews(rating);
CREATE INDEX idx_clinic_amenity_mapping_clinic_id ON clinic_amenity_mapping(clinic_id);
CREATE INDEX idx_clinic_amenity_mapping_amenity_id ON clinic_amenity_mapping(amenity_id);

-- Triggers for updated_at
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_physiotherapy_centers_updated_at BEFORE UPDATE ON physiotherapy_centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinic_reviews_updated_at BEFORE UPDATE ON clinic_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
