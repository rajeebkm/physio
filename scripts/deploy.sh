#!/bin/bash

# PhysioCare Platform Deployment Script
# This script deploys the platform to production

set -e

echo "🚀 Deploying PhysioCare Platform..."

# Check if required environment variables are set
if [ -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "❌ AWS_ACCESS_KEY_ID is not set"
    exit 1
fi

if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "❌ AWS_SECRET_ACCESS_KEY is not set"
    exit 1
fi

if [ -z "$AWS_REGION" ]; then
    echo "❌ AWS_REGION is not set"
    exit 1
fi

echo "✅ Environment variables are set"

# Build all packages
echo "🔨 Building packages..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm run test

# Deploy infrastructure
echo "🏗️  Deploying infrastructure..."
cd infrastructure/aws
terraform init
terraform plan
terraform apply -auto-approve

# Deploy API
echo "📡 Deploying API..."
cd ../../packages/api
docker build -t physiocare-api .
docker tag physiocare-api:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/physiocare-api:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/physiocare-api:latest

# Deploy Web App
echo "🌐 Deploying web app..."
cd ../../apps/web
docker build -t physiocare-web .
docker tag physiocare-web:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/physiocare-web:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/physiocare-web:latest

# Update ECS services
echo "🔄 Updating ECS services..."
aws ecs update-service --cluster physiocare-cluster --service physiocare-api-service --force-new-deployment
aws ecs update-service --cluster physiocare-cluster --service physiocare-web-service --force-new-deployment

echo "✅ Deployment complete!"
echo ""
echo "🎉 PhysioCare Platform is now live!"
echo ""
echo "Web App: https://physiocare.com"
echo "API: https://api.physiocare.com"
echo ""
echo "Monitor your deployment in the AWS Console"
