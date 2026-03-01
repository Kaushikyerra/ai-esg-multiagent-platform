# GreenOps AI - Demo Script

## 5-Minute Hackathon Demo

### Setup (Before Demo)
- [ ] Backend running on localhost:8000
- [ ] Frontend dashboard open
- [ ] Sample pipeline ready
- [ ] Azure deployment URL ready
- [ ] Slides/presentation ready

---

## Demo Flow

### 1. Problem Introduction (30 seconds)
**Say:**
> "DevOps teams deploy code without understanding the environmental and financial impact. GreenOps AI solves this with AI-powered analysis that provides carbon footprint, cost estimates, and risk scoring in real-time."

**Show:** Problem slide with statistics

---

### 2. Architecture Overview (30 seconds)
**Say:**
> "We built a multi-agent system using Microsoft Azure OpenAI and Semantic Kernel. Six specialized AI agents work in parallel to analyze pipelines: Pipeline Analyzer, Carbon Estimator, Cost Calculator, Risk Scorer, Policy Enforcer, and Report Generator."

**Show:** Architecture diagram

---

### 3. Live Demo - API (1 minute)
**Say:**
> "Let me show you how it works. Here's a typical GitHub Actions pipeline."

**Do:**
1. Open `examples/sample_pipeline.yaml` in editor
2. Show the pipeline structure (build, test, deploy jobs)
3. Run: `python test_api.py`
4. Show terminal output with analysis results

**Highlight:**
- Carbon: X kg CO₂ (Rating: B)
- Cost: $X (Monthly: $X)
- Risk Score: X/100 (Level: LOW)
- Decision: APPROVED

---

### 4. Live Demo - Dashboard (1.5 minutes)
**Say:**
> "Now let's see this in our executive dashboard."

**Do:**
1. Open frontend dashboard
2. Paste sample pipeline into text area
3. Click "Analyze Pipeline"
4. Show loading state
5. Results appear with visualizations

**Highlight:**
- Color-coded cards (green/blue/orange)
- Carbon impact with tree equivalents
- Cost breakdown and monthly projection
- Risk factors and recommendations
- Policy decision banner

---

### 5. Policy Enforcement Demo (1 minute)
**Say:**
> "GreenOps AI enforces governance policies automatically. Watch what happens when we analyze a high-risk pipeline."

**Do:**
1. Modify pipeline to remove tests
2. Add more compute-intensive jobs
3. Re-analyze
4. Show BLOCKED decision with violations

**Highlight:**
- Risk score increased to 75+
- Policy violations listed
- Recommendations provided
- Deployment blocked automatically

---

### 6. Azure Deployment (30 seconds)
**Say:**
> "This entire system runs on Azure Container Apps with Azure OpenAI, fully scalable and production-ready."

**Show:**
- Azure Portal with deployed resources
- Live API endpoint URL
- Quick health check: `curl https://your-app.azurecontainerapps.io/health`

---

### 7. Business Impact (30 seconds)
**Say:**
> "GreenOps AI delivers real business value:"

**Highlight:**
- 20-40% reduction in carbon emissions
- 15-30% cost savings
- Automated compliance and governance
- Zero manual intervention required

---

### 8. Closing (30 seconds)
**Say:**
> "We've built a production-ready Agentic DevOps system that makes every deployment sustainable, cost-efficient, and reliable. Thank you!"

**Show:** Thank you slide with team info

---

## Backup Plans

### If API Fails
- Show pre-recorded video
- Walk through code in IDE
- Show test results from earlier

### If Frontend Fails
- Use API terminal output
- Show screenshots
- Demo with curl commands

### If Azure Fails
- Show local deployment
- Show deployment scripts
- Show infrastructure code

---

## Key Talking Points

### Technical Excellence
- Multi-agent architecture
- Parallel processing
- Real-time analysis
- Azure OpenAI integration
- Production-ready deployment

### Business Value
- Sustainability metrics
- Cost optimization
- Risk reduction
- Automated governance
- Executive reporting

### Innovation
- First AI-powered DevOps governance
- Carbon-aware deployments
- Proactive policy enforcement
- Multi-cloud support

---

## Questions & Answers

**Q: How accurate are the carbon estimates?**
A: Based on industry-standard power consumption data and regional carbon intensity from official sources.

**Q: Can it integrate with existing CI/CD?**
A: Yes, supports GitHub Actions, Azure DevOps, with extensible architecture for more platforms.

**Q: What about security?**
A: All data processed in Azure, no pipeline code stored, enterprise-grade security.

**Q: How does it scale?**
A: Azure Container Apps auto-scales, agents run in parallel, handles thousands of analyses per day.

**Q: Can policies be customized?**
A: Absolutely, policies are configurable per organization's requirements.
