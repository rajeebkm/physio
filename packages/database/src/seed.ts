import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/physiotherapy',
});

async function seedDatabase() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Seed subscription plans
        console.log('Seeding subscription plans...');
        await client.query(`
      INSERT INTO subscription_plans (id, name, description, price, currency, billing_period, features, max_consultations, max_therapy_sessions, home_visit_included, priority_support, is_active)
      VALUES 
        ('550e8400-e29b-41d4-a716-446655440001', 'Basic Plan', 'Essential healthcare access', 299.00, 'INR', 'MONTHLY', 
         ARRAY['5 consultations per month', 'Basic exercise library', 'Email support'], 5, 0, false, false, true),
        ('550e8400-e29b-41d4-a716-446655440002', 'Premium Plan', 'Comprehensive healthcare with therapy', 599.00, 'INR', 'MONTHLY',
         ARRAY['Unlimited consultations', 'Full exercise library', '5 therapy sessions', 'Priority support'], -1, 5, false, true, true),
        ('550e8400-e29b-41d4-a716-446655440003', 'Family Plan', 'Complete family healthcare', 999.00, 'INR', 'MONTHLY',
         ARRAY['Unlimited consultations for family', 'Home visits included', 'Unlimited therapy sessions', '24/7 support'], -1, -1, true, true, true),
        ('550e8400-e29b-41d4-a716-446655440004', 'Annual Premium', 'Best value for year-round care', 5999.00, 'INR', 'YEARLY',
         ARRAY['Unlimited consultations', 'Home visits included', 'Unlimited therapy sessions', 'Priority support', 'Health analytics'], -1, -1, true, true, true);
    `);

        // Seed clinic amenities
        console.log('Seeding clinic amenities...');
        await client.query(`
      INSERT INTO clinic_amenities (id, name, description, category, icon, is_active)
      VALUES 
        ('650e8400-e29b-41d4-a716-446655440001', 'Free WiFi', 'Complimentary internet access', 'CONVENIENCE', 'wifi', true),
        ('650e8400-e29b-41d4-a716-446655440002', 'Parking', 'Free parking available', 'CONVENIENCE', 'parking', true),
        ('650e8400-e29b-41d4-a716-446655440003', 'Wheelchair Access', 'Wheelchair accessible entrance', 'ACCESSIBILITY', 'wheelchair', true),
        ('650e8400-e29b-41d4-a716-446655440004', 'Air Conditioning', 'Climate controlled environment', 'COMFORT', 'ac', true),
        ('650e8400-e29b-41d4-a716-446655440005', 'Waiting Area', 'Comfortable waiting room', 'COMFORT', 'waiting', true),
        ('650e8400-e29b-41d4-a716-446655440006', 'X-Ray Facility', 'On-site X-ray services', 'MEDICAL', 'xray', true),
        ('650e8400-e29b-41d4-a716-446655440007', 'Physiotherapy Equipment', 'Modern physiotherapy equipment', 'MEDICAL', 'equipment', true),
        ('650e8400-e29b-41d4-a716-446655440008', 'Emergency Services', '24/7 emergency care', 'MEDICAL', 'emergency', true);
    `);

        // Seed notification templates
        console.log('Seeding notification templates...');
        await client.query(`
      INSERT INTO notification_templates (id, type, title_template, message_template, email_template, sms_template, push_template, variables, is_active)
      VALUES 
        ('750e8400-e29b-41d4-a716-446655440001', 'APPOINTMENT_REMINDER', 
         'Appointment Reminder - {appointment_type}', 
         'Your {appointment_type} with Dr. {provider_name} is scheduled for {appointment_time}. Please join 5 minutes early.',
         '<h2>Appointment Reminder</h2><p>Your {appointment_type} with Dr. {provider_name} is scheduled for {appointment_time}.</p>',
         'Appointment reminder: {appointment_type} with Dr. {provider_name} at {appointment_time}',
         'Appointment Reminder: {appointment_type} at {appointment_time}',
         ARRAY['appointment_type', 'provider_name', 'appointment_time'], true),
        
        ('750e8400-e29b-41d4-a716-446655440002', 'APPOINTMENT_CONFIRMED',
         'Appointment Confirmed - {appointment_type}',
         'Your {appointment_type} with Dr. {provider_name} has been confirmed for {appointment_time}.',
         '<h2>Appointment Confirmed</h2><p>Your {appointment_type} with Dr. {provider_name} has been confirmed for {appointment_time}.</p>',
         'Appointment confirmed: {appointment_type} with Dr. {provider_name} at {appointment_time}',
         'Appointment Confirmed: {appointment_type} at {appointment_time}',
         ARRAY['appointment_type', 'provider_name', 'appointment_time'], true),
        
        ('750e8400-e29b-41d4-a716-446655440003', 'PAYMENT_SUCCESS',
         'Payment Successful - {amount}',
         'Your payment of ₹{amount} has been processed successfully for {service_type}.',
         '<h2>Payment Successful</h2><p>Your payment of ₹{amount} has been processed successfully for {service_type}.</p>',
         'Payment of ₹{amount} successful for {service_type}',
         'Payment Successful: ₹{amount}',
         ARRAY['amount', 'service_type'], true),
        
        ('750e8400-e29b-41d4-a716-446655440004', 'EXERCISE_REMINDER',
         'Exercise Reminder - {exercise_plan}',
         'Time for your {exercise_plan} workout! You have {exercises_count} exercises scheduled for today.',
         '<h2>Exercise Reminder</h2><p>Time for your {exercise_plan} workout! You have {exercises_count} exercises scheduled for today.</p>',
         'Exercise reminder: {exercise_plan} - {exercises_count} exercises today',
         'Exercise Reminder: {exercise_plan}',
         ARRAY['exercise_plan', 'exercises_count'], true);
    `);

        // Seed sample exercises
        console.log('Seeding sample exercises...');
        await client.query(`
      INSERT INTO exercises (id, name, description, category, body_part, difficulty, duration, repetitions, sets, equipment, instructions, benefits, contraindications, tags, is_active)
      VALUES 
        ('850e8400-e29b-41d4-a716-446655440001', 'Neck Stretches', 'Gentle neck mobility exercises', 'STRETCHING', ARRAY['neck', 'cervical'], 'BEGINNER', 5, 10, 3, ARRAY[]::TEXT[], 
         'Slowly turn your head left and right, then up and down. Hold each position for 5 seconds.',
         ARRAY['Improves neck mobility', 'Reduces stiffness', 'Relieves tension'], 
         ARRAY['Neck injury', 'Severe pain'], 
         ARRAY['neck', 'stretching', 'mobility'], true),
        
        ('850e8400-e29b-41d4-a716-446655440002', 'Shoulder Rolls', 'Circular shoulder movements', 'STRETCHING', ARRAY['shoulders', 'upper_back'], 'BEGINNER', 3, 15, 2, ARRAY[]::TEXT[],
         'Roll your shoulders forward in circular motions, then reverse direction.',
         ARRAY['Improves shoulder mobility', 'Reduces tension', 'Strengthens muscles'],
         ARRAY['Shoulder dislocation', 'Severe arthritis'],
         ARRAY['shoulders', 'stretching', 'mobility'], true),
        
        ('850e8400-e29b-41d4-a716-446655440003', 'Knee Flexion', 'Bending and straightening knee', 'STRENGTHENING', ARRAY['knees', 'thighs'], 'BEGINNER', 10, 12, 3, ARRAY[]::TEXT[],
         'Sit on a chair and slowly bend and straighten your knee. Keep movements controlled.',
         ARRAY['Strengthens quadriceps', 'Improves knee function', 'Reduces stiffness'],
         ARRAY['Recent knee surgery', 'Severe knee pain'],
         ARRAY['knees', 'strengthening', 'rehabilitation'], true),
        
        ('850e8400-e29b-41d4-a716-446655440004', 'Ankle Circles', 'Circular ankle movements', 'MOBILITY', ARRAY['ankles', 'feet'], 'BEGINNER', 5, 20, 2, ARRAY[]::TEXT[],
         'Sit comfortably and rotate your ankle in circular motions, both clockwise and counterclockwise.',
         ARRAY['Improves ankle mobility', 'Reduces stiffness', 'Prevents injury'],
         ARRAY['Ankle fracture', 'Severe swelling'],
         ARRAY['ankles', 'mobility', 'stretching'], true),
        
        ('850e8400-e29b-41d4-a716-446655440005', 'Deep Breathing', 'Controlled breathing exercise', 'RELAXATION', ARRAY['chest', 'lungs'], 'BEGINNER', 5, 1, 1, ARRAY[]::TEXT[],
         'Breathe in slowly through your nose for 4 counts, hold for 4 counts, exhale through mouth for 6 counts.',
         ARRAY['Reduces stress', 'Improves lung function', 'Promotes relaxation'],
         ARRAY['Severe respiratory conditions'],
         ARRAY['breathing', 'relaxation', 'stress_relief'], true);
    `);

        // Seed sample coupons
        console.log('Seeding sample coupons...');
        await client.query(`
      INSERT INTO coupons (id, code, name, description, discount_type, discount_value, min_amount, max_discount, usage_limit, used_count, valid_from, valid_until, is_active)
      VALUES 
        ('950e8400-e29b-41d4-a716-446655440001', 'WELCOME20', 'Welcome Discount', '20% off on first consultation', 'PERCENTAGE', 20.00, 500.00, 200.00, 1000, 0, NOW(), NOW() + INTERVAL '1 year', true),
        ('950e8400-e29b-41d4-a716-446655440002', 'FAMILY50', 'Family Plan Discount', '₹50 off on family plans', 'FIXED_AMOUNT', 50.00, 999.00, 50.00, 500, 0, NOW(), NOW() + INTERVAL '6 months', true),
        ('950e8400-e29b-41d4-a716-446655440003', 'THERAPY100', 'Therapy Session Discount', '₹100 off on therapy sessions', 'FIXED_AMOUNT', 100.00, 800.00, 100.00, 200, 0, NOW(), NOW() + INTERVAL '3 months', true);
    `);

        console.log('🎉 Database seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Only run seeding if called directly
if (require.main === module) {
    seedDatabase();
}
