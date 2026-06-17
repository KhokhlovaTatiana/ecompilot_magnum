export type ServiceId = "algorithm" | "demand-elasticity" | "sku-budget";

export type ServiceSummary = {
  id: ServiceId;
  title: string;
  description: string;
  path: string;
  icon: "algorithm" | "elasticity" | "budget";
  status: "ready" | "planned";
  source: string;
};

export type Metric = {
  label: string;
  value: string;
  description: string;
};

export type DataTableModel = {
  columns: string[];
  rows: string[][];
};

export type AlgorithmType = {
  key: "alpha" | "beta" | "sigma" | "omega";
  title: string;
  share: number;
  shortDefinition: string;
  description: string;
  brandRole: string;
  productRole: string;
  priceElasticity: string;
  examples: string[];
  sourcePage: number;
  image: string;
};

export type AlgorithmCategorySplit = {
  category: string;
  alpha: number;
  beta: number;
  sigma: number;
  omega: number;
  sourcePage: number;
};

export type AlgorithmCaseStep = {
  title: string;
  text: string;
  image: string;
  sourcePage: number;
};

export type AlgorithmEvidence = {
  title: string;
  image: string;
  sourcePage: number;
};

export type AlgorithmPurchaseData = {
  id: "algorithm";
  title: string;
  description: string;
  source: string;
  sourceUrl?: string;
  hero: {
    insight: string;
    note: string;
  };
  metrics: Metric[];
  algorithms: AlgorithmType[];
  categorySplit: AlgorithmCategorySplit;
  caseStudy: {
    title: string;
    description: string;
    steps: AlgorithmCaseStep[];
  };
  opportunities: string[];
  evidence: AlgorithmEvidence[];
};

export type ElasticityRowFormat =
  | "currency"
  | "decimal"
  | "number"
  | "percent"
  | "percentPoint";

export type ElasticitySummaryRow = {
  label: string;
  value: number | string;
  format?: ElasticityRowFormat;
};

export type ElasticityScenarioRow = {
  scenario: string;
  priceChange: number;
  newAveragePrice: number;
  salesMultiplier: number;
  expectedSalesChange: number;
  expectedAnnualUnits: number;
  expectedDailyUnits: number;
  businessReadout: string;
  dailyRevenue: number;
  marginPerUnit: number | null;
  dailyMargin: number | null;
};

export type ElasticityTopSku = {
  label: string;
  barcode: string;
  code: string;
  category: string;
  sellOutQty: number;
  revenue: number;
  qtyShare: number;
  revenueShare: number;
  averagePrice: number;
  averageDiscount: number;
  daysWithSales: number;
};

export type ElasticityCategory = {
  key: string;
  title: string;
  shortTitle: string;
  source: string;
  description: string;
  period: string;
  summary: {
    selectedSkus: number;
    selectedBarcodes: number;
    selectedCodes: number;
    daysWithSales: number;
    daysUsedInRegression: number;
    totalUnits: number;
    totalRevenue: number;
    averagePrice: number;
    averageDiscount: number;
    elasticity: number;
    rSquared: number;
    correlation: number;
    impactPlus10: number;
    impactMinus10: number;
    interpretation: string;
  };
  assessment: {
    label: string;
    reliability: string;
    text: string;
  };
  summaryRows: ElasticitySummaryRow[];
  scenarioRows: ElasticityScenarioRow[];
  method: string;
};

export type DemandElasticityData = {
  id: "demand-elasticity";
  title: string;
  description: string;
  source: string;
  period: string;
  overall: {
    elasticity: number;
    rSquared: number;
    impactPlus10: number;
    impactMinus10: number;
    assessment: string;
    basis: string;
    text: string;
  };
  categories: ElasticityCategory[];
  topSkus: ElasticityTopSku[];
};

export type SkuBudgetPoint = {
  date?: string;
  budget: number;
  skuStatBudget?: number;
  generateBudget?: number;
  salesUnits: number;
  modelUnits?: number;
  salesRub: number;
  orders?: number;
  clicks?: number;
  impressions?: number;
};

export type SkuBudgetItem = {
  sku: string;
  name: string;
  shortName: string;
  category: string;
  activeDays: number;
  activeDaysPerMonth: number;
  skuStatMonthly: number;
  generateMonthly: number;
  currentMonthly: number;
  currentDaily: number;
  saturationDaily: number;
  recommendedDaily: number;
  recommendedMonthly: number;
  alwaysOnMonthly: number;
  deltaMonthly: number;
  drr: number;
  cr: number;
  ctr: number;
  salesUnits3d: number;
  r2: number;
  status: string;
  recommendation: string;
  action: "Увеличить" | "Снизить" | "Оставить" | "Нет активного бюджета";
  averageUnitPrice: number;
  points: SkuBudgetPoint[];
  curve: SkuBudgetPoint[];
};

export type SkuBudgetData = {
  id: "sku-budget";
  title: string;
  description: string;
  source: string;
  period: string;
  methodology: {
    budgetRule: string;
    salesRule: string;
    model: string;
    limitation: string;
  };
  overview: {
    currentMonthly: number;
    recommendedMonthly: number;
    testCeilingMonthly: number;
    alwaysOnMonthly: number;
    deltaMonthly: number;
    skuCount: number;
    dailyPoints: number;
    excludedNoImpressions: number;
    confirmedPlateau: number;
    aboveObservedPlateau: number;
    weakRelation: number;
    meanR2: number;
    medianR2: number;
  };
  skus: SkuBudgetItem[];
};
