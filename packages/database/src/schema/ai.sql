-- AI/ML related tables for personalization and analytics

-- Symptoms tracking table
CREATE TABLE symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symptom VARCHAR(200) NOT NULL,
    severity INTEGER NOT NULL CHECK (severity >= 0 AND severity <= 10),
    duration INTEGER NOT NULL CHECK (duration >= 0), -- in days
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('DAILY', 'WEEKLY', 'MONTHLY', 'OCCASIONAL')),
    triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pain assessments table
CREATE TABLE pain_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location VARCHAR(200) NOT NULL,
    intensity INTEGER NOT NULL CHECK (intensity >= 0 AND intensity <= 10),
    type VARCHAR(20) NOT NULL CHECK (type IN ('SHARP', 'DULL', 'BURNING', 'THROBBING', 'ACHING', 'STABBING')),
    duration INTEGER NOT NULL CHECK (duration >= 0), -- in minutes
    triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
    relief_methods TEXT[] DEFAULT ARRAY[]::TEXT[],
    impact_on_daily_life INTEGER NOT NULL CHECK (impact_on_daily_life >= 0 AND impact_on_daily_life <= 10),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mobility assessments table
CREATE TABLE mobility_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joint VARCHAR(100) NOT NULL,
    range_of_motion INTEGER NOT NULL CHECK (range_of_motion >= 0 AND range_of_motion <= 10),
    flexibility INTEGER NOT NULL CHECK (flexibility >= 0 AND flexibility <= 10),
    strength INTEGER NOT NULL CHECK (strength >= 0 AND strength <= 10),
    stability INTEGER NOT NULL CHECK (stability >= 0 AND stability <= 10),
    pain_level INTEGER NOT NULL CHECK (pain_level >= 0 AND pain_level <= 10),
    functional_limitations TEXT[] DEFAULT ARRAY[]::TEXT[],
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI recommendations table
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EXERCISE', 'LIFESTYLE', 'TREATMENT', 'PREVENTION', 'EMERGENCY')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI recommendation action items table
CREATE TABLE ai_recommendation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES ai_recommendations(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    estimated_duration INTEGER NOT NULL CHECK (estimated_duration >= 0), -- in minutes
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    equipment TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_url TEXT,
    instructions TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise plans table
CREATE TABLE exercise_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    goal VARCHAR(200) NOT NULL,
    duration INTEGER NOT NULL CHECK (duration >= 1), -- in weeks
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    completed_sessions INTEGER DEFAULT 0,
    total_sessions INTEGER NOT NULL CHECK (total_sessions >= 0),
    average_completion_rate DECIMAL(3,2) DEFAULT 0 CHECK (average_completion_rate >= 0 AND average_completion_rate <= 1),
    last_completed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise plan exercises table
CREATE TABLE exercise_plan_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES exercise_plans(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL CHECK (duration >= 0),
    repetitions INTEGER CHECK (repetitions >= 0),
    sets INTEGER CHECK (sets >= 0),
    rest_time INTEGER DEFAULT 0 CHECK (rest_time >= 0), -- in seconds
    order_index INTEGER NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise plan schedule table
CREATE TABLE exercise_plan_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES exercise_plans(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    time_of_day TIME NOT NULL,
    duration INTEGER NOT NULL CHECK (duration >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise plan schedule exercises table
CREATE TABLE exercise_plan_schedule_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES exercise_plan_schedule(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress tracking table
CREATE TABLE progress_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('PAIN', 'MOBILITY', 'STRENGTH', 'FLEXIBILITY', 'FUNCTIONAL')),
    metric VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    context TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI model performance table
CREATE TABLE ai_model_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    accuracy DECIMAL(5,4) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 1),
    precision DECIMAL(5,4) NOT NULL CHECK (precision >= 0 AND precision <= 1),
    recall DECIMAL(5,4) NOT NULL CHECK (recall >= 0 AND recall <= 1),
    f1_score DECIMAL(5,4) NOT NULL CHECK (f1_score >= 0 AND f1_score <= 1),
    total_predictions INTEGER NOT NULL CHECK (total_predictions >= 0),
    correct_predictions INTEGER NOT NULL CHECK (correct_predictions >= 0),
    last_trained TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User feedback on AI recommendations table
CREATE TABLE ai_recommendation_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES ai_recommendations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    was_helpful BOOLEAN,
    was_implemented BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_symptoms_user_id ON symptoms(user_id);
CREATE INDEX idx_symptoms_recorded_at ON symptoms(recorded_at);
CREATE INDEX idx_pain_assessments_user_id ON pain_assessments(user_id);
CREATE INDEX idx_pain_assessments_recorded_at ON pain_assessments(recorded_at);
CREATE INDEX idx_mobility_assessments_user_id ON mobility_assessments(user_id);
CREATE INDEX idx_mobility_assessments_recorded_at ON mobility_assessments(recorded_at);
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_type ON ai_recommendations(type);
CREATE INDEX idx_ai_recommendations_priority ON ai_recommendations(priority);
CREATE INDEX idx_ai_recommendations_is_active ON ai_recommendations(is_active);
CREATE INDEX idx_ai_recommendation_actions_recommendation_id ON ai_recommendation_actions(recommendation_id);
CREATE INDEX idx_exercise_plans_user_id ON exercise_plans(user_id);
CREATE INDEX idx_exercise_plans_is_active ON exercise_plans(is_active);
CREATE INDEX idx_exercise_plan_exercises_plan_id ON exercise_plan_exercises(plan_id);
CREATE INDEX idx_exercise_plan_exercises_exercise_id ON exercise_plan_exercises(exercise_id);
CREATE INDEX idx_exercise_plan_schedule_plan_id ON exercise_plan_schedule(plan_id);
CREATE INDEX idx_exercise_plan_schedule_day_of_week ON exercise_plan_schedule(day_of_week);
CREATE INDEX idx_exercise_plan_schedule_exercises_schedule_id ON exercise_plan_schedule_exercises(schedule_id);
CREATE INDEX idx_progress_tracking_user_id ON progress_tracking(user_id);
CREATE INDEX idx_progress_tracking_type ON progress_tracking(type);
CREATE INDEX idx_progress_tracking_recorded_at ON progress_tracking(recorded_at);
CREATE INDEX idx_ai_model_performance_model_name ON ai_model_performance(model_name);
CREATE INDEX idx_ai_model_performance_version ON ai_model_performance(version);
CREATE INDEX idx_ai_recommendation_feedback_recommendation_id ON ai_recommendation_feedback(recommendation_id);
CREATE INDEX idx_ai_recommendation_feedback_user_id ON ai_recommendation_feedback(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_exercise_plans_updated_at BEFORE UPDATE ON exercise_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
