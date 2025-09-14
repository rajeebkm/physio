import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPostgresClient, getRedisClient } from '../config/database';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    BaseUser,
    UserRole,
    LoginRequestSchema,
    RegisterRequestSchema
} from '@physiotherapy/shared';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export class AuthService {
    // Generate JWT tokens
    private static generateTokens(user: BaseUser): { accessToken: string; refreshToken: string; expiresIn: number } {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET not configured');
        }

        const accessToken = (jwt.sign as any)(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        const refreshToken = (jwt.sign as any)(payload, JWT_SECRET, {
            expiresIn: '30d'
        });

        // Calculate expiration time in seconds
        const decoded = jwt.decode(accessToken) as any;
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

        return { accessToken, refreshToken, expiresIn };
    }

    // Hash password
    private static async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }

    // Verify password
    private static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // Store refresh token in Redis
    private static async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
        try {
            const redisClient = await getRedisClient();
            const key = `refresh_token:${userId}`;
            await redisClient.setEx(key, 30 * 24 * 60 * 60, refreshToken); // 30 days
        } catch (error) {
            logger.error('Failed to store refresh token:', error);
            // Don't throw error as this is not critical for login
        }
    }

    // Remove refresh token from Redis
    private static async removeRefreshToken(userId: string): Promise<void> {
        try {
            const redisClient = await getRedisClient();
            const key = `refresh_token:${userId}`;
            await redisClient.del(key);
        } catch (error) {
            logger.error('Failed to remove refresh token:', error);
        }
    }

    // Register new user
    static async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            // Validate input
            const validatedData = RegisterRequestSchema.parse(data);

            const pgClient = await getPostgresClient();

            // Check if user already exists
            const existingUser = await pgClient.query(
                'SELECT id FROM users WHERE email = $1 OR phone = $2',
                [validatedData.email, validatedData.phone]
            );

            if (existingUser.rows.length > 0) {
                throw new Error('User with this email or phone already exists');
            }

            // Hash password
            const hashedPassword = await this.hashPassword(validatedData.password);

            // Create user
            const userResult = await pgClient.query(`
        INSERT INTO users (email, phone, first_name, last_name, date_of_birth, gender, role, password_hash, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, email, phone, first_name, last_name, date_of_birth, gender, profile_image, role, status, is_email_verified, is_phone_verified, created_at, updated_at
      `, [
                validatedData.email,
                validatedData.phone,
                validatedData.firstName,
                validatedData.lastName,
                validatedData.dateOfBirth,
                validatedData.gender,
                validatedData.role,
                hashedPassword,
                'PENDING_VERIFICATION'
            ]);

            const user = userResult.rows[0];

            // Create role-specific profile
            if (validatedData.role === 'PATIENT') {
                await pgClient.query(`
          INSERT INTO patient_profiles (user_id)
          VALUES ($1)
        `, [user.id]);
            } else if (validatedData.role === 'DOCTOR') {
                await pgClient.query(`
          INSERT INTO doctor_profiles (user_id, specialization, qualifications, experience, license_number, license_expiry, consultation_fee)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [user.id, '', [], 0, '', new Date(), 0]);
            } else if (validatedData.role === 'PHYSIOTHERAPIST') {
                await pgClient.query(`
          INSERT INTO physiotherapist_profiles (user_id, specialization, qualifications, experience, license_number, license_expiry, consultation_fee, home_visit_fee)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [user.id, [], [], 0, '', new Date(), 0, 0]);
            }

            const baseUser: BaseUser = {
                id: user.id,
                email: user.email,
                phone: user.phone,
                firstName: user.first_name,
                lastName: user.last_name,
                dateOfBirth: user.date_of_birth,
                gender: user.gender,
                profileImage: user.profile_image,
                role: user.role,
                status: user.status,
                isEmailVerified: user.is_email_verified,
                isPhoneVerified: user.is_phone_verified,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            };

            const tokens = this.generateTokens(baseUser);
            await this.storeRefreshToken(baseUser.id, tokens.refreshToken);

            return {
                user: baseUser,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresIn: tokens.expiresIn
            };
        } catch (error) {
            logger.error('Registration failed:', error);
            throw error;
        }
    }

    // Login user
    static async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            // Validate input
            const validatedData = LoginRequestSchema.parse(data);

            const pgClient = await getPostgresClient();

            // Find user by email
            const userResult = await pgClient.query(`
        SELECT id, email, phone, first_name, last_name, date_of_birth, gender, profile_image, role, status, is_email_verified, is_phone_verified, password_hash, created_at, updated_at
        FROM users 
        WHERE email = $1
      `, [validatedData.email]);

            if (userResult.rows.length === 0) {
                throw new Error('Invalid email or password');
            }

            const user = userResult.rows[0];

            // Check if account is active
            if (user.status !== 'ACTIVE' && user.status !== 'PENDING_VERIFICATION') {
                throw new Error('Account is not active');
            }

            // Verify password
            const isPasswordValid = await this.verifyPassword(validatedData.password, user.password_hash);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            const baseUser: BaseUser = {
                id: user.id,
                email: user.email,
                phone: user.phone,
                firstName: user.first_name,
                lastName: user.last_name,
                dateOfBirth: user.date_of_birth,
                gender: user.gender,
                profileImage: user.profile_image,
                role: user.role,
                status: user.status,
                isEmailVerified: user.is_email_verified,
                isPhoneVerified: user.is_phone_verified,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            };

            const tokens = this.generateTokens(baseUser);
            await this.storeRefreshToken(baseUser.id, tokens.refreshToken);

            return {
                user: baseUser,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresIn: tokens.expiresIn
            };
        } catch (error) {
            logger.error('Login failed:', error);
            throw error;
        }
    }

    // Refresh access token
    static async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
        try {
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET not configured');
            }

            const decoded = (jwt.verify as any)(refreshToken, JWT_SECRET) as any;

            // Verify refresh token exists in Redis
            const redisClient = await getRedisClient();
            const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);

            if (!storedToken || storedToken !== refreshToken) {
                throw new Error('Invalid refresh token');
            }

            const pgClient = await getPostgresClient();
            const userResult = await pgClient.query(`
        SELECT id, email, phone, first_name, last_name, date_of_birth, gender, profile_image, role, status, is_email_verified, is_phone_verified, created_at, updated_at
        FROM users 
        WHERE id = $1 AND status = 'ACTIVE'
      `, [decoded.userId]);

            if (userResult.rows.length === 0) {
                throw new Error('User not found or inactive');
            }

            const user = userResult.rows[0];
            const baseUser: BaseUser = {
                id: user.id,
                email: user.email,
                phone: user.phone,
                firstName: user.first_name,
                lastName: user.last_name,
                dateOfBirth: user.date_of_birth,
                gender: user.gender,
                profileImage: user.profile_image,
                role: user.role,
                status: user.status,
                isEmailVerified: user.is_email_verified,
                isPhoneVerified: user.is_phone_verified,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            };

            const tokens = this.generateTokens(baseUser);

            return {
                accessToken: tokens.accessToken,
                expiresIn: tokens.expiresIn
            };
        } catch (error) {
            logger.error('Token refresh failed:', error);
            throw error;
        }
    }

    // Logout user
    static async logout(userId: string): Promise<void> {
        try {
            await this.removeRefreshToken(userId);
        } catch (error) {
            logger.error('Logout failed:', error);
            throw error;
        }
    }

    // Change password
    static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        try {
            const pgClient = await getPostgresClient();

            // Get current password hash
            const userResult = await pgClient.query(
                'SELECT password_hash FROM users WHERE id = $1',
                [userId]
            );

            if (userResult.rows.length === 0) {
                throw new Error('User not found');
            }

            // Verify current password
            const isCurrentPasswordValid = await this.verifyPassword(
                currentPassword,
                userResult.rows[0].password_hash
            );

            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect');
            }

            // Hash new password
            const hashedNewPassword = await this.hashPassword(newPassword);

            // Update password
            await pgClient.query(
                'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [hashedNewPassword, userId]
            );

            // Remove all refresh tokens for security
            await this.removeRefreshToken(userId);
        } catch (error) {
            logger.error('Password change failed:', error);
            throw error;
        }
    }
}
