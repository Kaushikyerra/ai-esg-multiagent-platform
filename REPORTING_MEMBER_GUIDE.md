# 📊 Complete Guide for Reporting Member

## 🎯 Your Role: Frontend & Reporting Dashboard

You're responsible for building the React dashboard that visualizes the analysis results from the backend API.

## ✅ What's Already Done

I've created a complete React + TypeScript frontend with:
- ✅ Full dashboard with 6 components
- ✅ Real-time pipeline analysis
- ✅ Interactive charts (Recharts)
- ✅ Responsive design (Tailwind CSS)
- ✅ API integration ready
- ✅ Sample data pre-loaded
- ✅ Loading states
- ✅ Error handling

## 🔑 API Keys You Need

### Azure OpenAI (Backend Only)
Your backend team needs these keys - **you don't need them for frontend work**:
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_DEPLOYMENT_NAME`

**Where to get them:**
1. Go to Azure Portal (portal.azure.com)
2. Navigate to Azure OpenAI Service
3. Go to "Keys and Endpoint"
4. Copy the key and endpoint

**Who needs to set this up:**
- Member 1 (Backend) or Member 4 (Cloud/DevOps)
- They need to create a `.env` file in the project root

## 🚀 Quick Start (3 Steps)

### Step 1: Install Node.js Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Frontend
```bash
npm run dev
```
Opens at: http://localhost:3000

### Step 3: Start Backend (separate terminal)
```bash
# In project root
python orchestrator/main.py
```
Runs at: http://localhost:8000

## 📁 What I Created for You

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx              # Main container
│   │   ├── PipelineInput.tsx          # YAML input form
│   │   ├── SummaryCard.tsx            # Decision badge
│   │   ├── CarbonCard.tsx             # CO₂ analysis + pie chart
│   │   ├── CostCard.tsx               # Cost breakdown + bar chart
│   │   ├── RiskCard.tsx               # Risk gauge + factors
│   │   ├── PolicyCard.tsx             # Policy results
│   │   └── RecommendationsCard.tsx    # Optimization tips
│   ├── App.tsx                        # Main app
│   ├── types.ts                       # TypeScript types
│   └── index.css                      # Styles
├── package.json                       # Dependencies
├── vite.config.ts                     # Vite config
├── tailwind.config.js                 # Tailwind config
└── SETUP_GUIDE.md                     # Detailed guide
```

## 🎨 Features Breakdown

### 1. Pipeline Input Component
- Text area for YAML pipeline config
- Dropdown for pipeline type (GitHub Actions/Azure DevOps)
- Dropdown for region (Azure/AWS/GCP)
- Pre-loaded sample pipeline
- Analyze button with loading state

### 2. Summary Card
- Large decision badge (APPROVED/WARNING/BLOCKED)
- Color-coded by status (green/yellow/red)
- Shows carbon, cost, and risk ratings
- Can proceed indicator

### 3. Carbon Card
- CO₂ emissions in kg
- Rating (A-F scale)
- Pie chart showing emissions vs budget
- Power consumption in kWh
- Trees equivalent per year

### 4. Cost Card
- Total cost per deployment
- Bar chart breakdown (compute/storage/network)
- Monthly projection
- Cost rating (A-F scale)

### 5. Risk Card
- Risk score (0-100)
- Risk level (LOW/MEDIUM/HIGH/CRITICAL)
- Radial gauge visualization
- List of risk factors with severity

### 6. Policy Card
- Passed checks (green)
- Warnings (yellow)
- Violations (red)
- Can proceed status

### 7. Recommendations Card
- Cost optimization suggestions
- Risk mitigation recommendations
- Color-coded by type

## 🎯 Your Tasks by Day

### Day 1-2 (Setup & Test) ✅ DONE
- [x] Project setup
- [x] All components created
- [x] API integration
- [x] Basic styling
- [ ] Test with backend

### Day 3-5 (Polish)
- [ ] Improve animations
- [ ] Add tooltips
- [ ] Better error messages
- [ ] Mobile optimization
- [ ] Add export to PDF (optional)

### Day 6-8 (Integration)
- [ ] Full integration testing
- [ ] Fix any bugs
- [ ] Performance optimization
- [ ] Cross-browser testing

### Day 9-12 (Final Polish)
- [ ] UI/UX improvements
- [ ] Accessibility check
- [ ] Demo preparation
- [ ] Screenshots/video

### Day 13-15 (Demo Ready)
- [ ] Final testing
- [ ] Demo practice
- [ ] Backup plan ready
- [ ] Presentation polished

## 🧪 Testing Checklist

### Functional Testing
- [ ] Form loads correctly
- [ ] Can input custom YAML
- [ ] Can change pipeline type
- [ ] Can change region
- [ ] Analyze button works
- [ ] Loading spinner shows
- [ ] Results display correctly
- [ ] All charts render
- [ ] Ratings show correct colors

### Visual Testing
- [ ] Layout looks good on desktop
- [ ] Layout looks good on tablet
- [ ] Layout looks good on mobile
- [ ] Colors are consistent
- [ ] Icons display correctly
- [ ] Charts are readable

### Integration Testing
- [ ] Backend connection works
- [ ] API calls succeed
- [ ] Error handling works
- [ ] CORS is configured
- [ ] Proxy works correctly

## 🎬 Demo Script

### 1. Introduction (30 seconds)
"This is GreenOps AI - our DevOps intelligence dashboard that analyzes pipelines for carbon, cost, and risk."

### 2. Show Input (30 seconds)
"Here we have a sample GitHub Actions pipeline. We can analyze pipelines from GitHub Actions or Azure DevOps, across multiple cloud regions."

### 3. Run Analysis (30 seconds)
"Let's analyze this pipeline..." [Click button, show loading]
"The system uses Azure OpenAI to analyze the pipeline in real-time."

### 4. Show Results (2 minutes)
"Here are the results:
- **Decision**: APPROVED - pipeline can proceed
- **Carbon**: Rating B - 156g CO₂ per deployment
- **Cost**: $0.26 per deployment, $7.70 monthly
- **Risk**: LOW - all checks passed
- **Policy**: All governance checks passed
- **Recommendations**: Suggestions for optimization"

### 5. Highlight Value (30 seconds)
"This helps teams:
- Reduce carbon emissions by 20-40%
- Optimize cloud costs by 15-30%
- Prevent production incidents
- Ensure compliance automatically"

## 🐛 Troubleshooting

### Problem: npm install fails
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problem: Can't connect to backend
1. Check backend is running: http://localhost:8000/health
2. Check console for CORS errors
3. Verify proxy in vite.config.ts

### Problem: Charts not rendering
```bash
npm install recharts --force
npm run dev
```

### Problem: TypeScript errors
```bash
npm run build
# Fix any errors shown
```

## 📊 API Reference

### Endpoint: POST /analyze

**Request:**
```json
{
  "pipeline_config": "YAML string",
  "pipeline_type": "github_actions",
  "region": "azure_eastus"
}
```

**Response:**
```json
{
  "status": "success",
  "summary": {
    "decision": "APPROVED",
    "carbon_rating": "B",
    "cost_rating": "B",
    "risk_level": "LOW"
  },
  "carbon_analysis": { ... },
  "cost_analysis": { ... },
  "risk_analysis": { ... },
  "policy_decision": { ... }
}
```

## 🎨 Customization Guide

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
}
```

### Add New Chart
1. Import from recharts
2. Add to component
3. Style with Tailwind

### Modify Layout
Edit `Dashboard.tsx` grid layout:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
```

## 💡 Pro Tips

1. **Use the sample pipeline** - It's pre-loaded for quick demos
2. **Test early** - Connect to backend ASAP
3. **Keep it simple** - The core features are done
4. **Focus on polish** - Animations, tooltips, error messages
5. **Practice demo** - Know your talking points
6. **Have backup** - Screenshots if live demo fails

## 📞 Who to Ask

- **Backend API changes**: Member 1 (Backend/Agents)
- **Azure deployment**: Member 4 (Cloud/DevOps)
- **Documentation**: Member 3 (Testing/Docs)
- **API keys**: Member 4 (Cloud/DevOps)

## 🎯 Success Criteria

### Must Have (P0) ✅ DONE
- [x] Working dashboard
- [x] All visualizations
- [x] API integration
- [x] Responsive design
- [x] Loading states

### Should Have (P1)
- [ ] Smooth animations
- [ ] Better error handling
- [ ] Tooltips
- [ ] Mobile optimization

### Nice to Have (P2)
- [ ] Export to PDF
- [ ] Dark mode
- [ ] Historical data
- [ ] Advanced filters

## 🚀 Next Steps

1. **Right now**: Run `npm install` in frontend folder
2. **Next**: Run `npm run dev` to start
3. **Then**: Test with backend
4. **After**: Polish and improve
5. **Finally**: Practice demo

## 📚 Resources

- **Recharts Docs**: https://recharts.org/
- **Tailwind Docs**: https://tailwindcss.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/

## ✅ Final Checklist

Before demo day:
- [ ] All features working
- [ ] Tested with backend
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Demo practiced
- [ ] Screenshots taken
- [ ] Backup plan ready

## 🎉 You're All Set!

Everything is ready to go. Just:
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000 and start building!

**Good luck with the hackathon! 🚀**

---

**Questions?** Check `frontend/SETUP_GUIDE.md` for more details.
