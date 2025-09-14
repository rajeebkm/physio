const { RtcTokenBuilder, RtcRole } = require('agora-token');
import { getPostgresClient } from '../config/database';
import logger from '../config/logger';

export class VideoService {
    // Generate Agora token for video call
    static generateToken(
        channelName: string,
        userId: string,
        role: 'publisher' | 'subscriber' = 'publisher',
        expirationTimeInSeconds: number = 3600
    ): { token: string; appId: string } {
        try {
            const appId = process.env.AGORA_APP_ID;
            const appCertificate = process.env.AGORA_APP_CERTIFICATE;

            if (!appId || !appCertificate) {
                throw new Error('Agora credentials not configured');
            }

            const rtcRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

            const token = RtcTokenBuilder.buildTokenWithUid(
                appId,
                appCertificate,
                channelName,
                parseInt(userId),
                rtcRole,
                expirationTimeInSeconds
            );

            logger.info('Agora token generated', {
                channelName,
                userId,
                role,
                expirationTimeInSeconds
            });

            return { token, appId };
        } catch (error) {
            logger.error('Generate Agora token failed:', error);
            throw error;
        }
    }

    // Create video call session
    static async createVideoSession(
        appointmentId: string,
        patientId: string,
        providerId: string
    ): Promise<{
        sessionId: string;
        channelName: string;
        patientToken: string;
        providerToken: string;
        appId: string;
    }> {
        try {
            const pgClient = await getPostgresClient();

            // Verify appointment exists and is scheduled
            const appointmentResult = await pgClient.query(`
        SELECT * FROM appointments 
        WHERE id = $1 AND patient_id = $2 AND provider_id = $3 
        AND status IN ('CONFIRMED', 'IN_PROGRESS')
      `, [appointmentId, patientId, providerId]);

            if (appointmentResult.rows.length === 0) {
                throw new Error('Appointment not found or not authorized');
            }

            const appointment = appointmentResult.rows[0];

            // Generate unique channel name
            const channelName = `appointment_${appointmentId}_${Date.now()}`;
            const sessionId = `session_${appointmentId}_${Date.now()}`;

            // Generate tokens for both participants
            const patientToken = this.generateToken(channelName, patientId, 'publisher');
            const providerToken = this.generateToken(channelName, providerId, 'publisher');

            // Store session in database
            await pgClient.query(`
        INSERT INTO video_sessions (
          id, appointment_id, channel_name, patient_id, provider_id,
          status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
                sessionId,
                appointmentId,
                channelName,
                patientId,
                providerId,
                'ACTIVE',
                new Date()
            ]);

            logger.info('Video session created', {
                sessionId,
                appointmentId,
                channelName,
                patientId,
                providerId
            });

            return {
                sessionId,
                channelName,
                patientToken: patientToken.token,
                providerToken: providerToken.token,
                appId: patientToken.appId
            };
        } catch (error) {
            logger.error('Create video session failed:', error);
            throw error;
        }
    }

    // Join video call
    static async joinVideoCall(
        sessionId: string,
        userId: string
    ): Promise<{
        channelName: string;
        token: string;
        appId: string;
        role: string;
    }> {
        try {
            const pgClient = await getPostgresClient();

            // Get session details
            const sessionResult = await pgClient.query(`
        SELECT * FROM video_sessions 
        WHERE id = $1 AND (patient_id = $2 OR provider_id = $2)
        AND status = 'ACTIVE'
      `, [sessionId, userId]);

            if (sessionResult.rows.length === 0) {
                throw new Error('Video session not found or not authorized');
            }

            const session = sessionResult.rows[0];
            const isPatient = session.patient_id === userId;
            const role = isPatient ? 'patient' : 'provider';

            // Generate token for the user
            const tokenResult = this.generateToken(session.channel_name, userId, 'publisher');

            // Update session with join time
            await pgClient.query(`
        UPDATE video_sessions 
        SET ${isPatient ? 'patient_joined_at' : 'provider_joined_at'} = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [sessionId]);

            logger.info('User joined video call', {
                sessionId,
                userId,
                role,
                channelName: session.channel_name
            });

            return {
                channelName: session.channel_name,
                token: tokenResult.token,
                appId: tokenResult.appId,
                role
            };
        } catch (error) {
            logger.error('Join video call failed:', error);
            throw error;
        }
    }

    // End video call
    static async endVideoCall(
        sessionId: string,
        userId: string
    ): Promise<void> {
        try {
            const pgClient = await getPostgresClient();

            // Get session details
            const sessionResult = await pgClient.query(`
        SELECT * FROM video_sessions 
        WHERE id = $1 AND (patient_id = $2 OR provider_id = $2)
      `, [sessionId, userId]);

            if (sessionResult.rows.length === 0) {
                throw new Error('Video session not found or not authorized');
            }

            const session = sessionResult.rows[0];
            const isPatient = session.patient_id === userId;

            // Update session with end time
            await pgClient.query(`
        UPDATE video_sessions 
        SET ${isPatient ? 'patient_left_at' : 'provider_left_at'} = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [sessionId]);

            // If both users have left, mark session as ended
            if (session.patient_left_at && session.provider_left_at) {
                await pgClient.query(`
          UPDATE video_sessions 
          SET status = 'ENDED', ended_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `, [sessionId]);
            }

            logger.info('User left video call', {
                sessionId,
                userId,
                isPatient
            });
        } catch (error) {
            logger.error('End video call failed:', error);
            throw error;
        }
    }

    // Get video session details
    static async getVideoSession(sessionId: string, userId: string): Promise<any> {
        try {
            const pgClient = await getPostgresClient();

            const result = await pgClient.query(`
        SELECT vs.*, a.scheduled_at, a.duration, a.type, a.mode
        FROM video_sessions vs
        JOIN appointments a ON vs.appointment_id = a.id
        WHERE vs.id = $1 AND (vs.patient_id = $2 OR vs.provider_id = $2)
      `, [sessionId, userId]);

            if (result.rows.length === 0) {
                throw new Error('Video session not found or not authorized');
            }

            return result.rows[0];
        } catch (error) {
            logger.error('Get video session failed:', error);
            throw error;
        }
    }

    // Start call recording
    static async startRecording(sessionId: string, userId: string): Promise<{ recordingId: string }> {
        try {
            const pgClient = await getPostgresClient();

            // Verify user is authorized to start recording
            const sessionResult = await pgClient.query(`
        SELECT * FROM video_sessions 
        WHERE id = $1 AND provider_id = $2 AND status = 'ACTIVE'
      `, [sessionId, userId]);

            if (sessionResult.rows.length === 0) {
                throw new Error('Video session not found or not authorized to record');
            }

            const session = sessionResult.rows[0];
            const recordingId = `recording_${sessionId}_${Date.now()}`;

            // Store recording details
            await pgClient.query(`
        INSERT INTO video_recordings (
          id, session_id, status, started_at, started_by
        ) VALUES ($1, $2, $3, $4, $5)
      `, [recordingId, sessionId, 'RECORDING', new Date(), userId]);

            logger.info('Video recording started', {
                sessionId,
                recordingId,
                userId
            });

            return { recordingId };
        } catch (error) {
            logger.error('Start recording failed:', error);
            throw error;
        }
    }

    // Stop call recording
    static async stopRecording(sessionId: string, userId: string): Promise<void> {
        try {
            const pgClient = await getPostgresClient();

            // Get active recording
            const recordingResult = await pgClient.query(`
        SELECT * FROM video_recordings 
        WHERE session_id = $1 AND status = 'RECORDING'
        ORDER BY started_at DESC
        LIMIT 1
      `, [sessionId]);

            if (recordingResult.rows.length === 0) {
                throw new Error('No active recording found');
            }

            const recording = recordingResult.rows[0];

            // Update recording status
            await pgClient.query(`
        UPDATE video_recordings 
        SET status = 'COMPLETED', ended_at = CURRENT_TIMESTAMP, ended_by = $1
        WHERE id = $2
      `, [userId, recording.id]);

            logger.info('Video recording stopped', {
                sessionId,
                recordingId: recording.id,
                userId
            });
        } catch (error) {
            logger.error('Stop recording failed:', error);
            throw error;
        }
    }

    // Get call analytics
    static async getCallAnalytics(sessionId: string, userId: string): Promise<any> {
        try {
            const pgClient = await getPostgresClient();

            const result = await pgClient.query(`
        SELECT 
          vs.*,
          a.scheduled_at,
          a.duration as scheduled_duration,
          EXTRACT(EPOCH FROM (vs.ended_at - vs.created_at)) as actual_duration,
          vr.id as recording_id,
          vr.status as recording_status,
          vr.started_at as recording_started_at,
          vr.ended_at as recording_ended_at
        FROM video_sessions vs
        JOIN appointments a ON vs.appointment_id = a.id
        LEFT JOIN video_recordings vr ON vs.id = vr.session_id
        WHERE vs.id = $1 AND (vs.patient_id = $2 OR vs.provider_id = $2)
      `, [sessionId, userId]);

            if (result.rows.length === 0) {
                throw new Error('Video session not found or not authorized');
            }

            return result.rows[0];
        } catch (error) {
            logger.error('Get call analytics failed:', error);
            throw error;
        }
    }

    // Cleanup expired sessions
    static async cleanupExpiredSessions(): Promise<void> {
        try {
            const pgClient = await getPostgresClient();

            // Mark sessions as expired if they're older than 24 hours
            await pgClient.query(`
        UPDATE video_sessions 
        SET status = 'EXPIRED'
        WHERE status = 'ACTIVE' AND created_at < NOW() - INTERVAL '24 hours'
      `);

            logger.info('Expired video sessions cleaned up');
        } catch (error) {
            logger.error('Cleanup expired sessions failed:', error);
            throw error;
        }
    }
}
