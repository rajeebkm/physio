import { getPostgresClient } from '../config/database';
import {
    CreateAppointment,
    Appointment,
    AppointmentQuery,
    AppointmentStatus,
    AppointmentType,
    ConsultationMode,
    CreateAppointmentSchema,
    AppointmentQuerySchema
} from '@physiotherapy/shared';
import logger from '../config/logger';

export class AppointmentService {
    // Create new appointment
    static async createAppointment(data: CreateAppointment, patientId: string): Promise<Appointment> {
        try {
            const validatedData = CreateAppointmentSchema.parse(data);
            const pgClient = await getPostgresClient();

            // Check if provider exists and is available
            const providerResult = await pgClient.query(`
        SELECT id, role, status FROM users 
        WHERE id = $1 AND role IN ('DOCTOR', 'PHYSIOTHERAPIST') AND status = 'ACTIVE'
      `, [validatedData.providerId]);

            if (providerResult.rows.length === 0) {
                throw new Error('Provider not found or not available');
            }

            // Check for conflicting appointments
            const conflictResult = await pgClient.query(`
        SELECT id FROM appointments 
        WHERE provider_id = $1 
        AND scheduled_at = $2 
        AND status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS')
      `, [validatedData.providerId, validatedData.scheduledAt]);

            if (conflictResult.rows.length > 0) {
                throw new Error('Provider is not available at the requested time');
            }

            // Create appointment
            const appointmentResult = await pgClient.query(`
        INSERT INTO appointments (
          patient_id, provider_id, type, status, mode, scheduled_at, duration, notes, symptoms
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
                patientId,
                validatedData.providerId,
                validatedData.type,
                'SCHEDULED',
                validatedData.mode,
                validatedData.scheduledAt,
                validatedData.duration,
                validatedData.notes,
                validatedData.symptoms
            ]);

            const appointment = appointmentResult.rows[0];

            logger.info('Appointment created successfully', {
                appointmentId: appointment.id,
                patientId,
                providerId: validatedData.providerId,
                type: validatedData.type
            });

            return this.mapAppointmentFromDB(appointment);
        } catch (error) {
            logger.error('Create appointment failed:', error);
            throw error;
        }
    }

    // Get appointments with filters
    static async getAppointments(query: AppointmentQuery): Promise<{ appointments: Appointment[]; total: number }> {
        try {
            const validatedQuery = AppointmentQuerySchema.parse(query);
            const pgClient = await getPostgresClient();

            let whereConditions: string[] = [];
            let queryParams: any[] = [];
            let paramCount = 0;

            if (validatedQuery.patientId) {
                paramCount++;
                whereConditions.push(`a.patient_id = $${paramCount}`);
                queryParams.push(validatedQuery.patientId);
            }

            if (validatedQuery.providerId) {
                paramCount++;
                whereConditions.push(`a.provider_id = $${paramCount}`);
                queryParams.push(validatedQuery.providerId);
            }

            if (validatedQuery.status) {
                paramCount++;
                whereConditions.push(`a.status = $${paramCount}`);
                queryParams.push(validatedQuery.status);
            }

            if (validatedQuery.type) {
                paramCount++;
                whereConditions.push(`a.type = $${paramCount}`);
                queryParams.push(validatedQuery.type);
            }

            if (validatedQuery.mode) {
                paramCount++;
                whereConditions.push(`a.mode = $${paramCount}`);
                queryParams.push(validatedQuery.mode);
            }

            if (validatedQuery.startDate) {
                paramCount++;
                whereConditions.push(`a.scheduled_at >= $${paramCount}`);
                queryParams.push(validatedQuery.startDate);
            }

            if (validatedQuery.endDate) {
                paramCount++;
                whereConditions.push(`a.scheduled_at <= $${paramCount}`);
                queryParams.push(validatedQuery.endDate);
            }

            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

            // Get total count
            const countQuery = `
        SELECT COUNT(*) as total
        FROM appointments a
        ${whereClause}
      `;
            const countResult = await pgClient.query(countQuery, queryParams);
            const total = parseInt(countResult.rows[0].total);

            // Get appointments with pagination
            paramCount++;
            const limit = validatedQuery.limit || 20;
            const offset = validatedQuery.offset || 0;

            const appointmentsQuery = `
        SELECT a.*, 
               p.first_name as patient_first_name, p.last_name as patient_last_name, p.email as patient_email,
               pr.first_name as provider_first_name, pr.last_name as provider_last_name, pr.email as provider_email
        FROM appointments a
        LEFT JOIN users p ON a.patient_id = p.id
        LEFT JOIN users pr ON a.provider_id = pr.id
        ${whereClause}
        ORDER BY a.scheduled_at DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

            queryParams.push(limit, offset);
            const appointmentsResult = await pgClient.query(appointmentsQuery, queryParams);

            const appointments = appointmentsResult.rows.map(row => this.mapAppointmentFromDB(row));

            return { appointments, total };
        } catch (error) {
            logger.error('Get appointments failed:', error);
            throw error;
        }
    }

    // Get appointment by ID
    static async getAppointmentById(appointmentId: string, userId: string): Promise<Appointment | null> {
        try {
            const pgClient = await getPostgresClient();

            const result = await pgClient.query(`
        SELECT a.*, 
               p.first_name as patient_first_name, p.last_name as patient_last_name, p.email as patient_email,
               pr.first_name as provider_first_name, pr.last_name as provider_last_name, pr.email as provider_email
        FROM appointments a
        LEFT JOIN users p ON a.patient_id = p.id
        LEFT JOIN users pr ON a.provider_id = pr.id
        WHERE a.id = $1 AND (a.patient_id = $2 OR a.provider_id = $2)
      `, [appointmentId, userId]);

            if (result.rows.length === 0) {
                return null;
            }

            return this.mapAppointmentFromDB(result.rows[0]);
        } catch (error) {
            logger.error('Get appointment by ID failed:', error);
            throw error;
        }
    }

    // Update appointment status
    static async updateAppointmentStatus(
        appointmentId: string,
        status: AppointmentStatus,
        userId: string
    ): Promise<Appointment> {
        try {
            const pgClient = await getPostgresClient();

            // Check if user has permission to update this appointment
            const appointmentResult = await pgClient.query(`
        SELECT * FROM appointments 
        WHERE id = $1 AND (patient_id = $2 OR provider_id = $2)
      `, [appointmentId, userId]);

            if (appointmentResult.rows.length === 0) {
                throw new Error('Appointment not found or access denied');
            }

            // Update appointment status
            const updateResult = await pgClient.query(`
        UPDATE appointments 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `, [status, appointmentId]);

            const appointment = updateResult.rows[0];

            logger.info('Appointment status updated', {
                appointmentId,
                status,
                userId
            });

            return this.mapAppointmentFromDB(appointment);
        } catch (error) {
            logger.error('Update appointment status failed:', error);
            throw error;
        }
    }

    // Cancel appointment
    static async cancelAppointment(appointmentId: string, reason: string, userId: string): Promise<void> {
        try {
            const pgClient = await getPostgresClient();

            // Check if user has permission to cancel this appointment
            const appointmentResult = await pgClient.query(`
        SELECT * FROM appointments 
        WHERE id = $1 AND (patient_id = $2 OR provider_id = $2)
      `, [appointmentId, userId]);

            if (appointmentResult.rows.length === 0) {
                throw new Error('Appointment not found or access denied');
            }

            const appointment = appointmentResult.rows[0];

            // Check if appointment can be cancelled
            if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
                throw new Error('Appointment cannot be cancelled');
            }

            // Start transaction
            await pgClient.query('BEGIN');

            try {
                // Update appointment status
                await pgClient.query(`
          UPDATE appointments 
          SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `, [appointmentId]);

                // Record cancellation
                await pgClient.query(`
          INSERT INTO appointment_cancellations (appointment_id, reason, cancelled_by)
          VALUES ($1, $2, $3)
        `, [appointmentId, reason, userId]);

                await pgClient.query('COMMIT');

                logger.info('Appointment cancelled successfully', {
                    appointmentId,
                    reason,
                    userId
                });
            } catch (error) {
                await pgClient.query('ROLLBACK');
                throw error;
            }
        } catch (error) {
            logger.error('Cancel appointment failed:', error);
            throw error;
        }
    }

    // Reschedule appointment
    static async rescheduleAppointment(
        appointmentId: string,
        newScheduledAt: string,
        reason: string,
        userId: string
    ): Promise<Appointment> {
        try {
            const pgClient = await getPostgresClient();

            // Check if user has permission to reschedule this appointment
            const appointmentResult = await pgClient.query(`
        SELECT * FROM appointments 
        WHERE id = $1 AND (patient_id = $2 OR provider_id = $2)
      `, [appointmentId, userId]);

            if (appointmentResult.rows.length === 0) {
                throw new Error('Appointment not found or access denied');
            }

            const appointment = appointmentResult.rows[0];

            // Check if appointment can be rescheduled
            if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
                throw new Error('Appointment cannot be rescheduled');
            }

            // Check for conflicting appointments
            const conflictResult = await pgClient.query(`
        SELECT id FROM appointments 
        WHERE provider_id = $1 
        AND scheduled_at = $2 
        AND status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS')
        AND id != $3
      `, [appointment.provider_id, newScheduledAt, appointmentId]);

            if (conflictResult.rows.length > 0) {
                throw new Error('Provider is not available at the requested time');
            }

            // Start transaction
            await pgClient.query('BEGIN');

            try {
                // Update appointment
                const updateResult = await pgClient.query(`
          UPDATE appointments 
          SET scheduled_at = $1, status = 'RESCHEDULED', updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          RETURNING *
        `, [newScheduledAt, appointmentId]);

                // Record reschedule
                await pgClient.query(`
          INSERT INTO appointment_reschedules (appointment_id, old_scheduled_at, new_scheduled_at, reason, requested_by)
          VALUES ($1, $2, $3, $4, $5)
        `, [appointmentId, appointment.scheduled_at, newScheduledAt, reason, userId]);

                await pgClient.query('COMMIT');

                const updatedAppointment = updateResult.rows[0];

                logger.info('Appointment rescheduled successfully', {
                    appointmentId,
                    oldScheduledAt: appointment.scheduled_at,
                    newScheduledAt,
                    userId
                });

                return this.mapAppointmentFromDB(updatedAppointment);
            } catch (error) {
                await pgClient.query('ROLLBACK');
                throw error;
            }
        } catch (error) {
            logger.error('Reschedule appointment failed:', error);
            throw error;
        }
    }

    // Map database row to Appointment object
    private static mapAppointmentFromDB(row: any): Appointment {
        return {
            id: row.id,
            patientId: row.patient_id,
            providerId: row.provider_id,
            type: row.type,
            status: row.status,
            mode: row.mode,
            scheduledAt: row.scheduled_at,
            duration: row.duration,
            notes: row.notes,
            symptoms: row.symptoms || [],
            diagnosis: row.diagnosis,
            prescription: row.prescription,
            followUpRequired: row.follow_up_required,
            followUpDate: row.follow_up_date,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}
