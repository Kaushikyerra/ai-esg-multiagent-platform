# GreenOps AI - Frontend

## For Member 2: Frontend/Reporting

This directory is for the dashboard and reporting interface.

## Suggested Tech Stack
- React + TypeScript
- Next.js (for SSR)
- Tailwind CSS
- Chart.js or Recharts (for visualizations)

## Key Features to Build

### 1. Pipeline Upload/Input
- Text area for YAML input
- File upload for pipeline configs
- Dropdown for pipeline type (GitHub Actions, Azure DevOps)
- Region selector

### 2. Analysis Dashboard
Display results from `/analyze` endpoint:
- Overall decision badge (Approved/Warning/Blocked)
- Carbon footprint card with rating
- Cost breakdown card with rating
- Risk score gauge
- Policy violations/warnings list

### 3. Visualizations
- Carbon emissions chart (bar/line)
- Cost breakdown pie chart
- Risk factors breakdown
- Monthly projections

### 4. Recommendations Panel
- List optimization suggestions
- Action buttons for each recommendation

## API Integration

### Base URL
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### Example API Call
```typescript
const analyzePipeline = async (config: string, type: string, region: string) => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pipeline_config: config,
      pipeline_type: type,
      region: region
    })
  });
  return response.json();
};
```

### Response Format
```typescript
interface AnalysisResult {
  status: string;
  pipeline_analysis: {
    jobs_count: number;
    steps_count: number;
    estimated_duration_minutes: number;
  };
  carbon_analysis: {
    co2_kg: number;
    rating: string;
    trees_equivalent_per_year: number;
  };
  cost_analysis: {
    total_cost_usd: number;
    monthly_projection_usd: number;
    cost_rating: string;
  };
  risk_analysis: {
    risk_score: number;
    risk_level: string;
    risk_factors: Array<{factor: string; severity: string}>;
  };
  policy_decision: {
    decision: string;
    violations: any[];
    warnings: any[];
  };
}
```

## Quick Start

### Option 1: Next.js
```bash
npx create-next-app@latest greenops-dashboard --typescript --tailwind
cd greenops-dashboard
npm install recharts
```

### Option 2: Vite + React
```bash
npm create vite@latest greenops-dashboard -- --template react-ts
cd greenops-dashboard
npm install
npm install recharts tailwindcss
```

## Color Scheme Suggestions
- Success/Approved: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Blocked/Error: Red (#EF4444)
- Carbon: Green gradient
- Cost: Blue (#3B82F6)
- Risk: Orange to Red gradient

## Demo Tips
- Pre-load sample pipeline for quick demo
- Add loading states with animations
- Show real-time analysis progress
- Add export to PDF feature for reports
