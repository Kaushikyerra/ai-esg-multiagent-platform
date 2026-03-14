# 🏗️ Frontend Architecture

## Component Hierarchy

```
App.tsx
├── Header (inline)
│   └── Logo + Title
│
├── PipelineInput
│   ├── Pipeline Type Selector
│   ├── Region Selector
│   ├── YAML Text Area
│   └── Analyze Button
│
├── Dashboard (conditional - shows after analysis)
│   ├── SummaryCard
│   │   ├── Decision Badge
│   │   └── Rating Summary
│   │
│   ├── Grid Row 1 (3 columns)
│   │   ├── CarbonCard
│   │   │   ├── Rating Badge
│   │   │   ├── CO₂ Display
│   │   │   ├── Pie Chart
│   │   │   └── Metrics
│   │   │
│   │   ├── CostCard
│   │   │   ├── Rating Badge
│   │   │   ├── Cost Display
│   │   │   ├── Bar Chart
│   │   │   └── Monthly Projection
│   │   │
│   │   └── RiskCard
│   │       ├── Risk Level Badge
│   │       ├── Score Display
│   │       ├── Radial Gauge
│   │       └── Risk Factors
│   │
│   └── Grid Row 2 (2 columns)
│       ├── PolicyCard
│       │   ├── Passed Checks
│       │   ├── Warnings
│       │   └── Violations
│       │
│       └── RecommendationsCard
│           ├── Cost Optimizations
│           └── Risk Mitigations
│
└── Footer (inline)
    └── Hackathon Info
```

## Data Flow

```
User Input
    ↓
PipelineInput Component
    ↓
[User clicks "Analyze"]
    ↓
App.tsx (handleAnalyze)
    ↓
POST /api/analyze
    ↓
Backend API (FastAPI)
    ↓
[6 Agents Process]
    ↓
JSON Response
    ↓
App.tsx (setResult)
    ↓
Dashboard Component
    ↓
[Props passed to child components]
    ↓
Individual Cards Render
    ↓
Charts Display
```

## State Management

```typescript
// App.tsx
const [result, setResult] = useState<AnalysisResult | null>(null)
const [loading, setLoading] = useState(false)

// Flow:
1. User clicks Analyze
2. setLoading(true)
3. API call
4. setResult(data)
5. setLoading(false)
6. Dashboard renders with result
```

## API Integration

```
Frontend (Vite)          Backend (FastAPI)
Port 3000                Port 8000
    │                        │
    │  POST /api/analyze     │
    ├────────────────────────>│
    │                        │
    │  [Proxy rewrites to    │
    │   http://localhost:8000]
    │                        │
    │  JSON Response         │
    │<────────────────────────┤
    │                        │
    └─> Render Dashboard    │
```

## Component Props

### Dashboard
```typescript
interface Props {
  result: AnalysisResult
}
```

### CarbonCard
```typescript
interface Props {
  data: {
    co2_grams: number
    co2_kg: number
    power_consumption_kwh: number
    trees_equivalent_per_year: number
    rating: string
    region: string
  }
}
```

### CostCard
```typescript
interface Props {
  data: {
    compute_cost_usd: number
    storage_cost_usd: number
    network_cost_usd: number
    total_cost_usd: number
    monthly_projection_usd: number
    cost_rating: string
  }
}
```

### RiskCard
```typescript
interface Props {
  data: {
    risk_score: number
    risk_level: string
    risk_factors: Array<{
      factor: string
      severity: string
      impact: number
    }>
  }
}
```

### PolicyCard
```typescript
interface Props {
  data: {
    decision: string
    violations: any[]
    warnings: any[]
    passed: string[]
    can_proceed: boolean
  }
}
```

### RecommendationsCard
```typescript
interface Props {
  costOptimizations: string[]
  riskRecommendations: string[]
}
```

## Styling System

### Tailwind CSS Classes

**Colors:**
- Success: `text-green-600`, `bg-green-50`
- Warning: `text-yellow-600`, `bg-yellow-50`
- Danger: `text-red-600`, `bg-red-50`
- Carbon: `text-green-600`
- Cost: `text-blue-600`
- Risk: `text-orange-600`

**Layout:**
- Container: `max-w-7xl mx-auto px-4`
- Card: `bg-white rounded-lg shadow-sm border p-6`
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-6`

**Typography:**
- Heading: `text-2xl font-bold text-gray-900`
- Subheading: `text-lg font-semibold text-gray-900`
- Body: `text-sm text-gray-600`

## Chart Configuration

### Pie Chart (Carbon)
```typescript
<PieChart>
  <Pie
    data={chartData}
    innerRadius={40}
    outerRadius={60}
    paddingAngle={2}
  />
</PieChart>
```

### Bar Chart (Cost)
```typescript
<BarChart data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" fill="#3B82F6" />
</BarChart>
```

### Radial Gauge (Risk)
```typescript
<RadialBarChart
  innerRadius="60%"
  outerRadius="90%"
  startAngle={180}
  endAngle={0}
>
  <RadialBar dataKey="value" />
</RadialBarChart>
```

## Error Handling

```typescript
try {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  
  if (!response.ok) {
    throw new Error('Analysis failed')
  }
  
  const data = await response.json()
  setResult(data)
} catch (error) {
  console.error('Analysis error:', error)
  alert('Failed to analyze pipeline')
} finally {
  setLoading(false)
}
```

## Build Process

```
Source Files (src/)
    ↓
TypeScript Compilation
    ↓
Vite Bundling
    ↓
Tailwind CSS Processing
    ↓
Asset Optimization
    ↓
Output (dist/)
```

## Development Workflow

```
1. Edit component in src/components/
2. Save file
3. Vite hot-reloads
4. See changes instantly
5. No manual refresh needed
```

## Production Build

```bash
npm run build

# Output:
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
```

## Performance Optimizations

1. **Code Splitting**: Vite automatically splits code
2. **Tree Shaking**: Unused code removed
3. **Lazy Loading**: Components load on demand
4. **Asset Optimization**: Images/fonts optimized
5. **Caching**: Build hashes for cache busting

## Responsive Design

```
Mobile (< 768px)
├── Single column layout
├── Stacked cards
└── Smaller charts

Tablet (768px - 1024px)
├── 2 column layout
├── Medium cards
└── Medium charts

Desktop (> 1024px)
├── 3 column layout
├── Full-size cards
└── Large charts
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast (WCAG AA)
- Screen reader friendly

## Testing Strategy

### Manual Testing
1. Load page
2. Check sample pipeline
3. Click analyze
4. Verify results
5. Check responsive

### Integration Testing
1. Backend connection
2. API calls
3. Error handling
4. Loading states

### Visual Testing
1. Layout check
2. Chart rendering
3. Color consistency
4. Icon display

## Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production
```bash
npm run build
npm run preview
# Preview production build
```

### Azure Static Web Apps
```bash
# Build command
npm run build

# Output directory
dist

# API location
/api
```

## Environment Variables

```bash
# .env (optional)
VITE_API_URL=http://localhost:8000
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || '/api'
```

## File Size Budget

- Initial JS: < 200KB
- Initial CSS: < 50KB
- Total bundle: < 500KB
- Images: < 100KB each

## Performance Metrics

Target:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## Security

- No API keys in frontend
- CORS configured
- Input sanitization
- XSS protection
- HTTPS in production

---

This architecture provides a solid foundation for the GreenOps AI dashboard!
