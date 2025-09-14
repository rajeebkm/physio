# PhysioCare Platform Deployment Guide

## Overview

This guide covers the complete deployment process for the PhysioCare telehealth and therapy platform, including local development setup, staging deployment, and production deployment on AWS.

## Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- AWS CLI configured with appropriate permissions
- Terraform 1.6+
- PostgreSQL 15+ (for local development)
- Redis 7+ (for local development)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd physiotherapy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment template and configure your local environment:

```bash
cp env.example .env
```

Update the `.env` file with your local configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/physiotherapy"
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-for-development"
JWT_EXPIRES_IN="7d"

# API Configuration
API_URL="http://localhost:3000/api"
WEB_URL="http://localhost:3001"
```

### 4. Start Local Services

Start the required services using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Elasticsearch
- RabbitMQ
- MinIO (S3-compatible storage)

### 5. Run Database Migrations

```bash
npm run db:migrate
```

### 6. Seed the Database

```bash
npm run db:seed
```

### 7. Start Development Servers

In separate terminals:

```bash
# Start API server
cd packages/api
npm run dev

# Start Web application
cd apps/web
npm run dev
```

The application will be available at:
- Web App: http://localhost:3001
- API: http://localhost:3000
- API Health Check: http://localhost:3000/health

## Staging Deployment

### 1. AWS Infrastructure Setup

Create a staging environment using Terraform:

```bash
cd infrastructure/aws
terraform init
terraform plan -var="environment=staging" -var="aws_account_id=YOUR_ACCOUNT_ID"
terraform apply -var="environment=staging" -var="aws_account_id=YOUR_ACCOUNT_ID"
```

### 2. Build and Push Docker Images

```bash
# Build API image
docker build -t physiotherapy-api:staging -f packages/api/Dockerfile .

# Build Web image
docker build -t physiotherapy-web:staging -f apps/web/Dockerfile .

# Tag and push to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com

docker tag physiotherapy-api:staging YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/physiotherapy-api:staging
docker push YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/physiotherapy-api:staging

docker tag physiotherapy-web:staging YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/physiotherapy-web:staging
docker push YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/physiotherapy-web:staging
```

### 3. Deploy to ECS

Update the ECS service to use the new image:

```bash
aws ecs update-service --cluster physiotherapy-cluster --service physiotherapy-api-service --force-new-deployment
```

## Production Deployment

### 1. Infrastructure Setup

Deploy the production infrastructure:

```bash
cd infrastructure/aws
terraform init
terraform plan -var="environment=production" -var="aws_account_id=YOUR_ACCOUNT_ID"
terraform apply -var="environment=production" -var="aws_account_id=YOUR_ACCOUNT_ID"
```

### 2. Configure Secrets

Store sensitive configuration in AWS Systems Manager Parameter Store:

```bash
# JWT Secret
aws ssm put-parameter --name "/physiotherapy/jwt-secret" --value "your-production-jwt-secret" --type "SecureString"

# Database Password
aws ssm put-parameter --name "/physiotherapy/db-password" --value "your-production-db-password" --type "SecureString"

# Other secrets...
```

### 3. CI/CD Pipeline

The GitHub Actions workflow will automatically:
1. Run tests and linting
2. Build Docker images
3. Push to ECR
4. Deploy to ECS
5. Run security scans

### 4. Domain and SSL Setup

1. Create a Route 53 hosted zone for your domain
2. Configure CloudFront distribution for the web app
3. Set up SSL certificates using AWS Certificate Manager
4. Configure custom domain for the ALB

### 5. Monitoring and Logging

Set up monitoring using:
- CloudWatch for logs and metrics
- DataDog for application performance monitoring
- Sentry for error tracking
- AWS X-Ray for distributed tracing

## Environment Variables

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | Redis connection string | `redis://host:6379` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `...` |
| `AWS_REGION` | AWS region | `ap-south-1` |
| `AWS_S3_BUCKET` | S3 bucket name | `physiotherapy-storage` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | API port | `3000` |
| `API_URL` | API base URL | `http://localhost:3000/api` |
| `WEB_URL` | Web app URL | `http://localhost:3001` |
| `LOG_LEVEL` | Logging level | `info` |

## Database Management

### Migrations

Run database migrations:

```bash
npm run db:migrate
```

### Seeding

Seed the database with initial data:

```bash
npm run db:seed
```

### Backup

Create database backups:

```bash
# Local backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# AWS RDS snapshot
aws rds create-db-snapshot --db-instance-identifier physiotherapy-db --db-snapshot-identifier physiotherapy-backup-$(date +%Y%m%d)
```

## Security Considerations

### 1. Network Security
- Use VPC with private subnets for databases
- Configure security groups with minimal required access
- Enable VPC Flow Logs for monitoring

### 2. Data Encryption
- Enable encryption at rest for RDS and ElastiCache
- Use HTTPS for all communications
- Encrypt sensitive data in S3

### 3. Access Control
- Use IAM roles for ECS tasks
- Implement least privilege access
- Enable MFA for AWS console access

### 4. Compliance
- Implement HIPAA compliance measures
- Enable audit logging
- Regular security assessments

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check security group rules
   - Verify database endpoint and credentials
   - Check VPC configuration

2. **ECS Service Issues**
   - Check CloudWatch logs
   - Verify task definition
   - Check IAM permissions

3. **Load Balancer Issues**
   - Check target group health
   - Verify security group rules
   - Check SSL certificate configuration

### Logs

View application logs:

```bash
# ECS logs
aws logs tail /ecs/physiotherapy-api --follow

# CloudWatch metrics
aws cloudwatch get-metric-statistics --namespace AWS/ECS --metric-name CPUUtilization --dimensions Name=ServiceName,Value=physiotherapy-api-service
```

## Scaling

### Horizontal Scaling

Scale ECS services:

```bash
aws ecs update-service --cluster physiotherapy-cluster --service physiotherapy-api-service --desired-count 5
```

### Vertical Scaling

Update task definition with more CPU/memory:

```bash
# Update ECS task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Auto Scaling

Configure auto scaling based on CPU/memory usage:

```bash
aws application-autoscaling register-scalable-target --service-namespace ecs --resource-id service/physiotherapy-cluster/physiotherapy-api-service --scalable-dimension ecs:service:DesiredCount --min-capacity 2 --max-capacity 10
```

## Monitoring and Alerting

### CloudWatch Alarms

Set up alarms for:
- High CPU usage
- High memory usage
- Database connection errors
- API response time
- Error rates

### Health Checks

Monitor application health:
- API health endpoint: `/health`
- Database connectivity
- Redis connectivity
- External service dependencies

## Backup and Disaster Recovery

### Database Backups
- Automated daily backups with 7-day retention
- Point-in-time recovery capability
- Cross-region backup replication

### Application Backups
- Infrastructure as Code (Terraform)
- Docker images in ECR
- Configuration in Parameter Store

### Disaster Recovery Plan
1. Multi-AZ deployment for high availability
2. Cross-region backup replication
3. Automated failover procedures
4. Regular disaster recovery testing

## Performance Optimization

### Database Optimization
- Connection pooling
- Query optimization
- Index optimization
- Read replicas for read-heavy workloads

### Application Optimization
- Caching strategies
- CDN for static assets
- Image optimization
- Code splitting and lazy loading

### Infrastructure Optimization
- Auto Scaling policies
- Load balancer optimization
- Network optimization
- Cost optimization

## Cost Optimization

### Resource Right-sizing
- Monitor resource utilization
- Adjust instance sizes based on usage
- Use spot instances for non-critical workloads

### Storage Optimization
- Lifecycle policies for S3
- Compression for logs
- Cleanup old snapshots

### Monitoring Costs
- Set up billing alerts
- Use AWS Cost Explorer
- Regular cost reviews

## Maintenance

### Regular Tasks
- Security updates
- Dependency updates
- Performance monitoring
- Backup verification
- Security audits

### Scheduled Maintenance
- Database maintenance windows
- OS updates
- Security patches
- Performance tuning

## Support and Documentation

### Internal Documentation
- API documentation
- Architecture diagrams
- Runbooks
- Troubleshooting guides

### External Support
- AWS Support
- Third-party service support
- Community forums
- Professional services

For additional support, contact the development team or refer to the project documentation.
