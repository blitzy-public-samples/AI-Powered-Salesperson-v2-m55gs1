#!/bin/bash

# Set global variables
PROJECT_ROOT=$(pwd)
DEPLOY_ENV=${1:-$DEPLOY_ENV}
DOCKER_REPO=${DOCKER_REPO:-"example.com/repo"}

# Function to check if the deployment environment is properly set
check_environment() {
    # Check if DEPLOY_ENV is set and valid
    if [[ -z "$DEPLOY_ENV" || ! "$DEPLOY_ENV" =~ ^(production|staging)$ ]]; then
        echo "Error: DEPLOY_ENV must be set to 'production' or 'staging'"
        return 1
    fi

    # Check if necessary environment variables are set
    if [[ -z "$DOCKER_REPO" ]]; then
        echo "Error: DOCKER_REPO environment variable is not set"
        return 1
    fi

    # Verify access to deployment servers and services
    # This is a placeholder and should be replaced with actual checks
    if ! kubectl cluster-info &>/dev/null; then
        echo "Error: Unable to access Kubernetes cluster"
        return 1
    fi

    return 0
}

# Function to build the frontend application
build_frontend() {
    echo "Building frontend..."
    cd "$PROJECT_ROOT/frontend" || return 1
    npm ci --only=production
    npm run build
    # Add any additional steps for optimizing and compressing assets here
    return 0
}

# Function to build the backend application
build_backend() {
    echo "Building backend..."
    cd "$PROJECT_ROOT/backend" || return 1
    npm ci --only=production
    npm run build
    npm test
    return 0
}

# Function to build Docker images for the application
build_docker_images() {
    echo "Building Docker images..."
    docker build -t "$DOCKER_REPO/frontend:$DEPLOY_ENV" "$PROJECT_ROOT/frontend"
    docker build -t "$DOCKER_REPO/backend:$DEPLOY_ENV" "$PROJECT_ROOT/backend"
    docker build -t "$DOCKER_REPO/ai-service:$DEPLOY_ENV" "$PROJECT_ROOT/ai-service"
    return 0
}

# Function to push Docker images to the repository
push_docker_images() {
    echo "Pushing Docker images..."
    docker login "$DOCKER_REPO"
    docker push "$DOCKER_REPO/frontend:$DEPLOY_ENV"
    docker push "$DOCKER_REPO/backend:$DEPLOY_ENV"
    docker push "$DOCKER_REPO/ai-service:$DEPLOY_ENV"
    return 0
}

# Function to update Kubernetes configuration files
update_kubernetes_config() {
    echo "Updating Kubernetes configuration..."
    sed -i "s|image: .*|image: $DOCKER_REPO/frontend:$DEPLOY_ENV|" "$PROJECT_ROOT/k8s/frontend-deployment.yaml"
    sed -i "s|image: .*|image: $DOCKER_REPO/backend:$DEPLOY_ENV|" "$PROJECT_ROOT/k8s/backend-deployment.yaml"
    sed -i "s|image: .*|image: $DOCKER_REPO/ai-service:$DEPLOY_ENV|" "$PROJECT_ROOT/k8s/ai-service-deployment.yaml"
    # Apply any environment-specific configurations here
    return 0
}

# Function to deploy the application to Kubernetes cluster
deploy_to_kubernetes() {
    echo "Deploying to Kubernetes..."
    kubectl apply -f "$PROJECT_ROOT/k8s/"
    kubectl rollout status deployment/frontend
    kubectl rollout status deployment/backend
    kubectl rollout status deployment/ai-service
    # Add health check for services here
    return 0
}

# Function to run any pending database migrations
run_database_migrations() {
    echo "Running database migrations..."
    # This is a placeholder and should be replaced with actual migration commands
    kubectl exec -it $(kubectl get pods -l app=backend -o jsonpath="{.items[0].metadata.name}") -- npm run migrate
    return 0
}

# Main function to orchestrate the deployment process
main() {
    echo "Starting deployment process for $DEPLOY_ENV environment..."

    check_environment || return 1
    build_frontend || return 1
    build_backend || return 1
    build_docker_images || return 1
    push_docker_images || return 1
    update_kubernetes_config || return 1
    deploy_to_kubernetes || return 1
    run_database_migrations || return 1

    echo "Deployment completed successfully!"
    return 0
}

# Main execution
main
exit $?