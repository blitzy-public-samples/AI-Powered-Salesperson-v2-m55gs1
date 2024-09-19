#!/bin/bash

# Set global variables
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/ai_salesperson"}
DB_NAME=${DB_NAME:-"ai_salesperson"}
DB_USER=${DB_USER:-"ai_user"}
DB_HOST=${DB_HOST:-"localhost"}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Function to check if required tools are installed
check_dependencies() {
    local missing_deps=0
    
    # Check if pg_dump is installed
    if ! command -v pg_dump &> /dev/null; then
        echo "Error: pg_dump is not installed"
        missing_deps=1
    fi
    
    # Check if tar is installed
    if ! command -v tar &> /dev/null; then
        echo "Error: tar is not installed"
        missing_deps=1
    fi
    
    # Check if gzip is installed
    if ! command -v gzip &> /dev/null; then
        echo "Error: gzip is not installed"
        missing_deps=1
    fi
    
    return $missing_deps
}

# Function to create backup directory if it doesn't exist
create_backup_directory() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create backup directory"
            return 1
        fi
    fi
    return 0
}

# Function to backup the PostgreSQL database
backup_database() {
    local db_backup_file="$BACKUP_DIR/db_backup_${TIMESTAMP}.sql.gz"
    
    # Use pg_dump to create a SQL dump of the database and compress it
    pg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" | gzip > "$db_backup_file"
    
    if [ $? -ne 0 ]; then
        echo "Error: Database backup failed"
        return 1
    fi
    
    echo "Database backup created: $db_backup_file"
    return 0
}

# Function to backup AI model files
backup_ai_models() {
    local ai_models_backup_file="$BACKUP_DIR/ai_models_${TIMESTAMP}.tar.gz"
    
    # Tar and compress AI model files
    tar -czf "$ai_models_backup_file" -C /path/to/ai/models .
    
    if [ $? -ne 0 ]; then
        echo "Error: AI models backup failed"
        return 1
    fi
    
    echo "AI models backup created: $ai_models_backup_file"
    return 0
}

# Function to backup configuration files
backup_config_files() {
    local config_backup_file="$BACKUP_DIR/config_${TIMESTAMP}.tar.gz"
    
    # Tar and compress configuration files
    tar -czf "$config_backup_file" -C /path/to/config/files .
    
    if [ $? -ne 0 ]; then
        echo "Error: Configuration files backup failed"
        return 1
    fi
    
    echo "Configuration files backup created: $config_backup_file"
    return 0
}

# Function to clean up old backups
cleanup_old_backups() {
    local retention_days=30
    
    # Find and remove backups older than the specified retention period
    find "$BACKUP_DIR" -type f -name "*.gz" -mtime +$retention_days -delete
    
    if [ $? -ne 0 ]; then
        echo "Error: Cleanup of old backups failed"
        return 1
    fi
    
    echo "Old backups cleaned up"
    return 0
}

# Main function to orchestrate the backup process
main() {
    echo "Starting backup process..."
    
    check_dependencies
    if [ $? -ne 0 ]; then
        echo "Error: Missing dependencies. Aborting backup."
        return 1
    fi
    
    create_backup_directory
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    backup_database
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    backup_ai_models
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    backup_config_files
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    cleanup_old_backups
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    echo "Backup process completed successfully."
    return 0
}

# Execute main function
main
exit $?