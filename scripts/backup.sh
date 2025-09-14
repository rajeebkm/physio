#!/bin/bash

# PhysioCare Platform Backup Script
# This script creates backups of the database and important files

set -e

echo "💾 Creating PhysioCare Platform backup..."

# Create backup directory
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Backup directory: $BACKUP_DIR"

# Backup database
echo "🗄️  Backing up database..."
pg_dump $DATABASE_URL > "$BACKUP_DIR/database.sql"

# Backup environment files
echo "⚙️  Backing up environment files..."
cp .env "$BACKUP_DIR/env.backup" 2>/dev/null || echo "⚠️  .env file not found"

# Backup important configuration files
echo "📋 Backing up configuration files..."
cp -r infrastructure "$BACKUP_DIR/" 2>/dev/null || echo "⚠️  Infrastructure directory not found"
cp -r docs "$BACKUP_DIR/" 2>/dev/null || echo "⚠️  Docs directory not found"

# Create backup archive
echo "📦 Creating backup archive..."
cd backups
tar -czf "$(basename $BACKUP_DIR).tar.gz" "$(basename $BACKUP_DIR)"
cd ..

# Upload to S3 (if configured)
if [ ! -z "$S3_BACKUP_BUCKET" ]; then
    echo "☁️  Uploading backup to S3..."
    aws s3 cp "backups/$(basename $BACKUP_DIR).tar.gz" "s3://$S3_BACKUP_BUCKET/backups/"
    echo "✅ Backup uploaded to S3"
fi

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find backups -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup complete!"
echo "📁 Backup location: $BACKUP_DIR"
echo "📦 Archive: backups/$(basename $BACKUP_DIR).tar.gz"
