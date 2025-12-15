#!/usr/bin/env bash
set -euo pipefail

# ============================================
# ComicWise Docker Test Script (Next.js 16)
# ============================================

# Colors for output
readonly BLUE='\033[0;34m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly NC='\033[0m' # No Color

# Configuration
readonly MAX_RETRIES=30
readonly RETRY_INTERVAL=2
readonly HEALTH_ENDPOINT="http://localhost:3000/api/health"

# Functions
print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}   $1${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

print_status() {
    if [ "$1" -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        echo -e "${RED}Error: $3${NC}"
        return 1
    fi
}

wait_for_service() {
    local service=$1
    local check_command=$2
    local retries=0
    
    echo -e "${YELLOW}Waiting for $service to be ready...${NC}"
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if eval "$check_command" &>/dev/null; then
            print_status 0 "$service is ready"
            return 0
        fi
        retries=$((retries + 1))
        sleep $RETRY_INTERVAL
    done
    
    print_status 1 "$service failed to start" "Timeout after $MAX_RETRIES attempts"
    return 1
}

cleanup() {
    echo -e "${YELLOW}Cleaning up...${NC}"
    docker compose down -v 2>/dev/null || true
}

# Trap errors and interrupts
trap cleanup EXIT ERR INT TERM

# Main execution
print_header "ComicWise Docker Test Script"

# Clean up existing containers
echo -e "${YELLOW}Cleaning up existing containers...${NC}"
docker compose down -v 2>/dev/null || true
print_status $? "Cleanup complete" "Failed to clean up existing containers"

# Build images
echo -e "${YELLOW}Building Docker images...${NC}"
docker compose build --no-cache --progress=plain
print_status $? "Images built successfully" "Failed to build images"

# Start containers
echo -e "${YELLOW}Starting containers...${NC}"
docker compose up -d
print_status $? "Containers started" "Failed to start containers"

# Wait for PostgreSQL
wait_for_service "PostgreSQL" "docker compose exec -T postgres pg_isready -U postgres"

# Wait for Redis
wait_for_service "Redis" "docker compose exec -T redis redis-cli ping | grep -q PONG"

# Wait for application
wait_for_service "Application" "curl -sf $HEALTH_ENDPOINT"

# Run tests
print_header "Running Health Checks"

# Test database connection
echo -e "${BLUE}Testing PostgreSQL connection...${NC}"
if docker compose exec -T postgres psql -U postgres -d comicwise -c "SELECT 1;" &>/dev/null; then
    print_status 0 "PostgreSQL query successful"
else
    print_status 1 "PostgreSQL query failed" "Cannot execute queries"
fi

# Test Redis connection
echo -e "${BLUE}Testing Redis connection...${NC}"
if docker compose exec -T redis redis-cli SET test_key "test_value" &>/dev/null && \
   docker compose exec -T redis redis-cli GET test_key | grep -q "test_value"; then
    print_status 0 "Redis read/write successful"
else
    print_status 1 "Redis test failed" "Cannot read/write data"
fi

# Test application health endpoint
echo -e "${BLUE}Testing application health endpoint...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_ENDPOINT)
if [ "$HTTP_CODE" == "200" ]; then
    print_status 0 "Health endpoint returned 200 OK"
else
    print_status 1 "Health endpoint test failed" "Returned HTTP $HTTP_CODE"
fi

# Test application homepage
echo -e "${BLUE}Testing application homepage...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "302" ]; then
    print_status 0 "Homepage accessible (HTTP $HTTP_CODE)"
else
    print_status 1 "Homepage test failed" "Returned HTTP $HTTP_CODE"
fi

# Display container status
print_header "Container Status"
docker compose ps

# Display resource usage
print_header "Resource Usage"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Display recent logs
print_header "Recent Application Logs"
docker compose logs --tail=30 app

# Final summary
print_header "Test Summary"
echo -e "${GREEN}All tests passed successfully!${NC}"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo -e "${YELLOW}  Stop containers:${NC}    docker compose down"
echo -e "${YELLOW}  View logs:${NC}          docker compose logs -f"
echo -e "${YELLOW}  View app logs:${NC}      docker compose logs -f app"
echo -e "${YELLOW}  Restart app:${NC}        docker compose restart app"
echo -e "${YELLOW}  Shell access:${NC}       docker compose exec app sh"
echo ""

# Keep containers running
echo -e "${GREEN}Containers are running. Press Ctrl+C to stop.${NC}"
trap - EXIT
wait
