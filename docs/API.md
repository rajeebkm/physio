# PhysioCare API Documentation

## Overview

The PhysioCare API provides comprehensive endpoints for managing telehealth and physiotherapy services. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Staging**: `https://api-staging.physiocare.com`
- **Production**: `https://api.physiocare.com`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **Appointments**: 10 requests per hour per user
- **File Uploads**: 20 requests per hour per user

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Error Handling

Error responses include:

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required",
      "value": "invalid-email"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "role": "PATIENT",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "gender": "MALE"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "PATIENT",
      "status": "PENDING_VERIFICATION"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 604800
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

#### Logout User
```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Change Password
```http
POST /auth/change-password
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

#### Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

### Appointments

#### Create Appointment
```http
POST /appointments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "providerId": "provider-uuid",
  "type": "CONSULTATION",
  "mode": "VIDEO",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "duration": 30,
  "notes": "Follow-up consultation",
  "symptoms": ["headache", "fever"]
}
```

#### Get Appointments
```http
GET /appointments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `patientId` (optional) - Filter by patient ID
- `providerId` (optional) - Filter by provider ID
- `status` (optional) - Filter by status
- `type` (optional) - Filter by type
- `mode` (optional) - Filter by mode
- `startDate` (optional) - Filter by start date
- `endDate` (optional) - Filter by end date
- `limit` (optional) - Number of results (default: 20)
- `offset` (optional) - Offset for pagination (default: 0)

#### Get Appointment by ID
```http
GET /appointments/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Update Appointment Status
```http
PATCH /appointments/{id}/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

#### Cancel Appointment
```http
POST /appointments/{id}/cancel
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Patient requested cancellation"
}
```

#### Reschedule Appointment
```http
POST /appointments/{id}/reschedule
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "newScheduledAt": "2024-01-16T10:00:00Z",
  "reason": "Provider unavailable"
}
```

### Users

#### Get User Profile
```http
GET /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "gender": "MALE"
}
```

### Providers

#### Search Providers
```http
GET /providers
```

**Query Parameters:**
- `specialization` (optional) - Filter by specialization
- `city` (optional) - Filter by city
- `rating` (optional) - Minimum rating
- `available` (optional) - Available for booking
- `homeVisit` (optional) - Provides home visits
- `limit` (optional) - Number of results (default: 20)
- `offset` (optional) - Offset for pagination (default: 0)

#### Get Provider by ID
```http
GET /providers/{id}
```

#### Get Provider Availability
```http
GET /providers/{id}/availability
```

**Query Parameters:**
- `date` (required) - Date to check availability
- `duration` (optional) - Appointment duration in minutes

### Clinics

#### Search Clinics
```http
GET /clinics
```

**Query Parameters:**
- `type` (optional) - Clinic type
- `city` (optional) - Filter by city
- `specializations` (optional) - Filter by specializations
- `services` (optional) - Filter by services
- `homeVisitAvailable` (optional) - Provides home visits
- `minRating` (optional) - Minimum rating
- `maxDistance` (optional) - Maximum distance in km
- `latitude` (optional) - User latitude for distance calculation
- `longitude` (optional) - User longitude for distance calculation

#### Get Clinic by ID
```http
GET /clinics/{id}
```

### Payments

#### Create Payment
```http
POST /payments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 500.00,
  "currency": "INR",
  "method": "UPI",
  "provider": "RAZORPAY",
  "appointmentId": "appointment-uuid",
  "description": "Consultation fee"
}
```

#### Get Payment by ID
```http
GET /payments/{id}
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Process Payment
```http
POST /payments/{id}/process
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "providerTransactionId": "txn_123456789",
  "providerOrderId": "order_123456789",
  "status": "COMPLETED"
}
```

### Subscriptions

#### Get Subscription Plans
```http
GET /subscriptions/plans
```

#### Subscribe to Plan
```http
POST /subscriptions
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "planId": "plan-uuid",
  "billingPeriod": "MONTHLY"
}
```

#### Get User Subscription
```http
GET /subscriptions/current
```

**Headers:**
```
Authorization: Bearer <token>
```

### AI Recommendations

#### Get AI Recommendations
```http
GET /ai/recommendations
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional) - Recommendation type
- `category` (optional) - Recommendation category
- `priority` (optional) - Priority level

#### Submit Symptom
```http
POST /ai/symptoms
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "symptom": "headache",
  "severity": 7,
  "duration": 2,
  "frequency": "DAILY",
  "triggers": ["stress", "lack of sleep"],
  "notes": "Pain in temples"
}
```

#### Submit Pain Assessment
```http
POST /ai/pain-assessment
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "location": "lower back",
  "intensity": 6,
  "type": "ACHING",
  "duration": 30,
  "triggers": ["sitting", "bending"],
  "reliefMethods": ["heat", "stretching"],
  "impactOnDailyLife": 7
}
```

### Exercises

#### Search Exercises
```http
GET /exercises
```

**Query Parameters:**
- `category` (optional) - Exercise category
- `bodyPart` (optional) - Target body part
- `difficulty` (optional) - Difficulty level
- `equipment` (optional) - Required equipment
- `duration` (optional) - Duration range
- `tags` (optional) - Exercise tags

#### Get Exercise by ID
```http
GET /exercises/{id}
```

#### Create Exercise Plan
```http
POST /exercises/plans
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Lower Back Strengthening",
  "description": "Exercises to strengthen lower back muscles",
  "goal": "Reduce lower back pain",
  "duration": 4,
  "difficulty": "INTERMEDIATE",
  "exercises": [
    {
      "exerciseId": "exercise-uuid",
      "duration": 10,
      "repetitions": 15,
      "sets": 3,
      "order": 1
    }
  ]
}
```

### Notifications

#### Get Notifications
```http
GET /notifications
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional) - Notification type
- `status` (optional) - Notification status
- `limit` (optional) - Number of results (default: 20)
- `offset` (optional) - Offset for pagination (default: 0)

#### Mark Notification as Read
```http
PATCH /notifications/{id}/read
```

**Headers:**
```
Authorization: Bearer <token>
```

#### Update Notification Preferences
```http
PUT /notifications/preferences
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "emailEnabled": true,
  "smsEnabled": false,
  "pushEnabled": true,
  "appointmentReminders": true,
  "paymentNotifications": true,
  "exerciseReminders": true,
  "progressUpdates": true,
  "promotionalEmails": false,
  "systemUpdates": true
}
```

## Webhooks

The API supports webhooks for real-time notifications. Configure webhook endpoints to receive notifications for:

- Appointment status changes
- Payment status updates
- New messages
- System updates

### Webhook Payload

```json
{
  "event": "appointment.updated",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "appointmentId": "uuid",
    "status": "CONFIRMED",
    "patientId": "uuid",
    "providerId": "uuid"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @physiotherapy/sdk
```

```javascript
import { PhysioCareClient } from '@physiotherapy/sdk';

const client = new PhysioCareClient({
  apiUrl: 'https://api.physiocare.com',
  apiKey: 'your-api-key'
});

// Create appointment
const appointment = await client.appointments.create({
  providerId: 'provider-uuid',
  type: 'CONSULTATION',
  mode: 'VIDEO',
  scheduledAt: '2024-01-15T10:00:00Z',
  duration: 30
});
```

### Python

```bash
pip install physiocare-sdk
```

```python
from physiocare import PhysioCareClient

client = PhysioCareClient(
    api_url='https://api.physiocare.com',
    api_key='your-api-key'
)

# Create appointment
appointment = client.appointments.create({
    'providerId': 'provider-uuid',
    'type': 'CONSULTATION',
    'mode': 'VIDEO',
    'scheduledAt': '2024-01-15T10:00:00Z',
    'duration': 30
})
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Invalid email or password |
| `TOKEN_EXPIRED` | JWT token has expired |
| `INVALID_TOKEN` | Invalid or malformed token |
| `USER_NOT_FOUND` | User does not exist |
| `APPOINTMENT_CONFLICT` | Appointment time conflict |
| `PAYMENT_FAILED` | Payment processing failed |
| `VALIDATION_ERROR` | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |

## Support

For API support and questions:

- **Documentation**: https://docs.physiocare.com
- **Status Page**: https://status.physiocare.com
- **Support Email**: api-support@physiocare.com
- **Developer Portal**: https://developers.physiocare.com

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Authentication endpoints
- Appointment management
- User profile management
- Payment processing
- AI recommendations
- Exercise management
