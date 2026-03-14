export interface AnalysisResult {
  status: string
  pipeline_analysis: {
    status: string
    jobs_count: number
    steps_count: number
    estimated_duration_minutes: number
    compute_size: string
    deployment_detected: boolean
    test_coverage_detected: boolean
  }
  carbon_analysis: {
    status: string
    co2_grams: number
    co2_kg: number
    power_consumption_kwh: number
    carbon_intensity: number
    region: string
    trees_equivalent_per_year: number
    rating: string
  }
  cost_analysis: {
    status: string
    compute_cost_usd: number
    storage_cost_usd: number
    network_cost_usd: number
    total_cost_usd: number
    monthly_projection_usd: number
    cost_rating: string
    optimization_potential: string[]
  }
  risk_analysis: {
    status: string
    risk_score: number
    risk_level: string
    risk_factors: Array<{
      factor: string
      severity: string
      impact: number
    }>
    recommendations: string[]
  }
  policy_decision: {
    status: string
    decision: string
    violations: any[]
    warnings: any[]
    passed: string[]
    can_proceed: boolean
  }
  summary: {
    can_proceed: boolean
    decision: string
    carbon_rating: string
    cost_rating: string
    risk_level: string
  }
}
