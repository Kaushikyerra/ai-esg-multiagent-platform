# 🚀 Frontend Setup Guide - Reporting Member

## What You Need

### 1. API Keys Required
**Azure OpenAI API Key** - Ask your Cloud/DevOps team member (Member 4) or Backend member (Member 1) for:
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_DEPLOYMENT_NAME`

**Note**: You don't need these keys for frontend development! Only the backend needs them.

### 2. Prerequisites
- Node.js 18+ installed
- npm or yarn
- Backend server running (Member 1's work)

## 🎯 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The frontend will start at: http://localhost:3000

### Step 3: Start Backend (in another terminal)
```bash
# Go back to project root
cd ..

# Make sure backend is running
python orchestrator/main.py
```

Backend runs at: http://localhost:8000

### Step 4: Test It!
1. Open http://localhost:3000 in your browser
2. You'll see a sample pipeline already loaded
3. Click "Analyze Pipeline"
4. View the results dashboard!

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard container
│   │   ├── PipelineInput.tsx      # Pipeline input form
│   │   ├── SummaryCard.tsx        # Overall decision summary
│   │   ├── CarbonCard.tsx         # Carbon analysis with chart
│   │   ├── CostCard.tsx           # Cost breakdown with chart
│   │   ├── RiskCard.tsx           # Risk assessment with gauge
│   │   ├── PolicyCard.tsx         # Policy enforcement results
│   │   └── RecommendationsCard.tsx # Optimization suggestions
│   ├── App.tsx                    # Main app component
│   ├── types.ts                   # TypeScript interfaces
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Features Implemented

### ✅ Pipeline Input
- Text area for YAML configuration
- Pipeline type selector (GitHub Actions, Azure DevOps)
- Region selector (Azure, AWS, GCP)
- Pre-loaded sample pipeline for quick demo

### ✅ Analysis Dashboard
- **Summary Card**: Overall decision (Approved/Warning/Blocked)
- **Carbon Card**: CO₂ emissions with pie chart and rating
- **Cost Card**: Cost breakdown with bar chart and monthly projection
- **Risk Card**: Risk score with radial gauge and factors
- **Policy Card**: Policy checks (passed/warnings/violations)
- **Recommendations Card**: Optimization suggestions

### ✅ Visualizations
- Recharts library for all charts
- Pie chart for carbon emissions
- Bar chart for cost breakdown
- Radial gauge for risk score
- Color-coded ratings (A-F scale)

### ✅ UI/UX
- Tailwind CSS for styling
- Lucide React for icons
- Responsive design (mobile-friendly)
- Loading states with spinner
- Error handling with alerts

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  success: '#10B981',  // Green
  warning: '#F59E0B',  // Yellow
  danger: '#EF4444',   // Red
  carbon: '#059669',   // Emerald
  cost: '#3B82F6',     // Blue
  risk: '#F97316',     // Orange
}
```

### Add New Components
1. Create file in `src/components/`
2. Import in `Dashboard.tsx`
3. Add to layout

### Modify API Endpoint
Edit `vite.config.ts` proxy settings if backend runs on different port.

## 🧪 Testing

### Manual Testing Checklist
- [ ] Form loads with sample pipeline
- [ ] Can change pipeline type
- [ ] Can change region
- [ ] Can edit YAML content
- [ ] Analyze button works
- [ ] Loading spinner shows
- [ ] Results display correctly
- [ ] All charts render
- [ ] Ratings show correct colors
- [ ] Responsive on mobile

### Test Different Scenarios
1. **Approved Pipeline**: Use the default sample
2. **High Carbon**: Add more jobs/steps
3. **High Cost**: Change to larger compute size
4. **High Risk**: Remove test steps

## 📊 Demo Tips

### For Hackathon Presentation
1. **Pre-load sample pipeline** - Already done!
2. **Show real-time analysis** - Click analyze and show loading
3. **Highlight visualizations** - Point out charts and ratings
4. **Explain decision logic** - Show how policy enforcement works
5. **Show recommendations** - Demonstrate optimization suggestions

### Demo Script
```
1. "Here's our GreenOps AI dashboard"
2. "We have a sample GitHub Actions pipeline loaded"
3. "Let's analyze it..." [Click button]
4. "The system analyzes carbon, cost, and risk in parallel"
5. "Here are the results:"
   - "Carbon rating: B - 156g CO₂"
   - "Cost: $0.26 per deployment, $7.70/month"
   - "Risk: LOW - all checks passed"
6. "The pipeline is APPROVED to proceed"
7. "We also get optimization recommendations"
```

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Can't connect to backend
1. Check backend is running: http://localhost:8000/health
2. Check proxy settings in `vite.config.ts`
3. Check CORS is enabled in backend

### Charts not showing
```bash
# Reinstall recharts
npm install recharts --force
```

### TypeScript errors
```bash
# Rebuild
npm run build
```

## 🚀 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output goes to `dist/` folder.

## 📝 Next Steps

### Day 1-2: Core Features ✅
- [x] Setup project
- [x] Create all components
- [x] Implement visualizations
- [x] Connect to API
- [x] Add loading states

### Day 3-5: Polish
- [ ] Add more chart types
- [ ] Export to PDF feature
- [ ] Historical data view
- [ ] Dark mode toggle
- [ ] Animation improvements

### Day 6-8: Integration
- [ ] Test with real backend
- [ ] Fix any bugs
- [ ] Optimize performance
- [ ] Mobile testing

### Day 9-12: Final Polish
- [ ] UI/UX improvements
- [ ] Add tooltips
- [ ] Improve error messages
- [ ] Practice demo

### Day 13-15: Demo Ready
- [ ] Final testing
- [ ] Demo practice
- [ ] Backup screenshots
- [ ] Presentation ready

## 💡 Tips for Success

1. **Start Simple**: The basic dashboard is already working!
2. **Test Early**: Test with backend as soon as possible
3. **Ask for Help**: If backend API changes, ask Member 1
4. **Focus on Demo**: Make sure the demo flow is smooth
5. **Have Backup**: Take screenshots in case of live demo issues

## 🎯 Your Deliverables

As Reporting Member, you need to deliver:
1. ✅ Working dashboard (DONE!)
2. ✅ Visualizations (DONE!)
3. ✅ API integration (DONE!)
4. [ ] Polish UI/UX
5. [ ] Test thoroughly
6. [ ] Demo preparation

## 📞 Need Help?

- **Backend API issues**: Talk to Member 1 (Backend/Agents)
- **Deployment issues**: Talk to Member 4 (Cloud/DevOps)
- **Documentation**: Talk to Member 3 (Testing/Docs)

## 🎉 You're Ready!

Everything is set up and working. Just run:
```bash
npm install
npm run dev
```

Then open http://localhost:3000 and start testing!

**Good luck with the hackathon! 🚀**
