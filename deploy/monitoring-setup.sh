#!/bin/bash

# GreenOps AI - Monitoring & Alerting Setup Script
# This script configures comprehensive monitoring and alerting for the deployed application

set -e

# Configuration
RESOURCE_GROUP="greenops-rg"
LOCATION="eastus"
APP_NAME="greenops-ai"
ALERT_EMAIL="your-email@example.com"  # Change this to your email

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create Action Group for Alerts
create_action_group() {
    log_info "Creating action group for alerts..."
    
    az monitor action-group create \
        --name greenops-action-group \
        --resource-group $RESOURCE_GROUP \
        --short-name GreenOps || log_warning "Action group already exists"
    
    # Add email receiver
    az monitor action-group receiver email add \
        --action-group greenops-action-group \
        --resource-group $RESOURCE_GROUP \
        --name greenops-email \
        --email-receiver $ALERT_EMAIL || log_warning "Email receiver already exists"
    
    log_success "Action group created"
}

# Create Metric Alerts
create_metric_alerts() {
    log_info "Creating metric alerts..."
    
    # Get resource IDs
    APP_RESOURCE_ID="/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/containerApps/$APP_NAME"
    INSIGHTS_RESOURCE_ID="/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Insights/components/greenops-insights"
    ACTION_GROUP_ID="/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Insights/actionGroups/greenops-action-group"
    
    # Alert 1: High CPU Usage
    log_info "Creating alert for high CPU usage..."
    az monitor metrics alert create \
        --name greenops-high-cpu \
        --resource-group $RESOURCE_GROUP \
        --scopes $APP_RESOURCE_ID \
        --condition "avg CpuUsagePercentage > 80" \
        --window-size 5m \
        --evaluation-frequency 1m \
        --action $ACTION_GROUP_ID \
        --description "Alert when CPU usage exceeds 80%" || log_warning "CPU alert already exists"
    
    # Alert 2: High Memory Usage
    log_info "Creating alert for high memory usage..."
    az monitor metrics alert create \
        --name greenops-high-memory \
        --resource-group $RESOURCE_GROUP \
        --scopes $APP_RESOURCE_ID \
        --condition "avg MemoryUsagePercentage > 85" \
        --window-size 5m \
        --evaluation-frequency 1m \
        --action $ACTION_GROUP_ID \
        --description "Alert when memory usage exceeds 85%" || log_warning "Memory alert already exists"
    
    # Alert 3: High Error Rate
    log_info "Creating alert for high error rate..."
    az monitor metrics alert create \
        --name greenops-high-error-rate \
        --resource-group $RESOURCE_GROUP \
        --scopes $INSIGHTS_RESOURCE_ID \
        --condition "avg failedRequests > 10" \
        --window-size 5m \
        --evaluation-frequency 1m \
        --action $ACTION_GROUP_ID \
        --description "Alert when error rate is high" || log_warning "Error rate alert already exists"
    
    # Alert 4: Low Availability
    log_info "Creating alert for low availability..."
    az monitor metrics alert create \
        --name greenops-low-availability \
        --resource-group $RESOURCE_GROUP \
        --scopes $INSIGHTS_RESOURCE_ID \
        --condition "avg availabilityResults/availabilityPercentage < 95" \
        --window-size 5m \
        --evaluation-frequency 1m \
        --action $ACTION_GROUP_ID \
        --description "Alert when availability drops below 95%" || log_warning "Availability alert already exists"
    
    log_success "Metric alerts created"
}

# Create Log Analytics Queries
create_log_queries() {
    log_info "Creating saved log queries..."
    
    WORKSPACE_ID=$(az monitor log-analytics workspace list \
        --resource-group $RESOURCE_GROUP \
        --query "[0].id" -o tsv)
    
    if [ -z "$WORKSPACE_ID" ]; then
        log_warning "Log Analytics workspace not found"
        return
    fi
    
    # Query 1: Recent Errors
    log_info "Creating 'Recent Errors' query..."
    az monitor log-analytics query \
        --workspace $WORKSPACE_ID \
        --analytics-query "ContainerAppConsoleLogs_CL | where Log_s contains 'ERROR' | project TimeGenerated, Log_s | order by TimeGenerated desc | take 50" \
        || log_warning "Query creation skipped"
    
    # Query 2: Performance Metrics
    log_info "Creating 'Performance Metrics' query..."
    az monitor log-analytics query \
        --workspace $WORKSPACE_ID \
        --analytics-query "ContainerAppConsoleLogs_CL | summarize Count=count() by bin(TimeGenerated, 5m) | order by TimeGenerated desc" \
        || log_warning "Query creation skipped"
    
    log_success "Log queries created"
}

# Create Dashboard
create_dashboard() {
    log_info "Creating monitoring dashboard..."
    
    # Create dashboard JSON
    cat > dashboard.json << 'EOF'
{
  "location": "eastus",
  "properties": {
    "lenses": {
      "0": {
        "order": 0,
        "parts": {
          "0": {
            "position": {
              "x": 0,
              "y": 0,
              "colSpan": 6,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [
                {
                  "name": "resourceId",
                  "value": "/subscriptions/{subscription}/resourceGroups/greenops-rg/providers/Microsoft.App/containerApps/greenops-ai"
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {
                "content": {
                  "metrics": [
                    {
                      "resourceMetadata": {
                        "id": "/subscriptions/{subscription}/resourceGroups/greenops-rg/providers/Microsoft.App/containerApps/greenops-ai"
                      },
                      "name": "CpuUsagePercentage",
                      "aggregationType": "Average",
                      "namespace": "Microsoft.App/containerApps",
                      "metricVisualization": {
                        "displayName": "CPU Usage %"
                      }
                    }
                  ]
                }
              }
            }
          },
          "1": {
            "position": {
              "x": 6,
              "y": 0,
              "colSpan": 6,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [
                {
                  "name": "resourceId",
                  "value": "/subscriptions/{subscription}/resourceGroups/greenops-rg/providers/Microsoft.App/containerApps/greenops-ai"
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {
                "content": {
                  "metrics": [
                    {
                      "resourceMetadata": {
                        "id": "/subscriptions/{subscription}/resourceGroups/greenops-rg/providers/Microsoft.App/containerApps/greenops-ai"
                      },
                      "name": "MemoryUsagePercentage",
                      "aggregationType": "Average",
                      "namespace": "Microsoft.App/containerApps",
                      "metricVisualization": {
                        "displayName": "Memory Usage %"
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
}
EOF
    
    log_success "Dashboard configuration created (dashboard.json)"
}

# Setup Budget Alert
setup_budget_alert() {
    log_info "Setting up budget alert..."
    
    az consumption budget create \
        --budget-name greenops-budget \
        --amount 100 \
        --time-grain Monthly \
        --start-date 2024-01-01 \
        --end-date 2024-12-31 \
        --resource-group $RESOURCE_GROUP \
        --category Cost || log_warning "Budget alert already exists"
    
    log_success "Budget alert configured"
}

# Create Diagnostic Settings
create_diagnostic_settings() {
    log_info "Creating diagnostic settings..."
    
    WORKSPACE_ID=$(az monitor log-analytics workspace list \
        --resource-group $RESOURCE_GROUP \
        --query "[0].id" -o tsv)
    
    if [ -z "$WORKSPACE_ID" ]; then
        log_warning "Log Analytics workspace not found"
        return
    fi
    
    APP_RESOURCE_ID="/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/containerApps/$APP_NAME"
    
    az monitor diagnostic-settings create \
        --name greenops-diagnostics \
        --resource $APP_RESOURCE_ID \
        --workspace $WORKSPACE_ID \
        --logs '[{"category":"ContainerAppConsoleLogs","enabled":true}]' \
        --metrics '[{"category":"AllMetrics","enabled":true}]' || log_warning "Diagnostic settings already exist"
    
    log_success "Diagnostic settings created"
}

# Main execution
main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║    GreenOps AI - Monitoring & Alerting Setup Script        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check if email is configured
    if [ "$ALERT_EMAIL" == "your-email@example.com" ]; then
        log_warning "Please update ALERT_EMAIL in the script before running"
        log_info "Edit the script and set ALERT_EMAIL to your email address"
        exit 1
    fi
    
    create_action_group
    create_metric_alerts
    create_log_queries
    create_dashboard
    setup_budget_alert
    create_diagnostic_settings
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         ✅ Monitoring Setup Complete! ✅                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📊 Monitoring Configuration:${NC}"
    echo -e "  📧 Alert Email:          ${YELLOW}$ALERT_EMAIL${NC}"
    echo -e "  🔔 Alerts Created:       ${YELLOW}4 metric alerts${NC}"
    echo -e "  📈 Dashboard:            ${YELLOW}dashboard.json${NC}"
    echo -e "  💰 Budget Alert:         ${YELLOW}$100/month${NC}"
    echo -e "  📋 Diagnostic Settings:  ${YELLOW}Enabled${NC}"
    echo ""
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo -e "  1. Verify alerts are working by checking your email"
    echo -e "  2. Import dashboard.json into Azure Portal"
    echo -e "  3. Configure additional alert recipients as needed"
    echo -e "  4. Review and adjust alert thresholds based on your needs"
    echo ""
}

# Run main function
main
