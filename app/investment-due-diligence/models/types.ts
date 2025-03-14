// 企查查搜索结果类型
export interface QccCompanySearchResult {
  Name: string;
  KeyNo: string;
  CreditCode: string;
  OperName: string;
  Address: string;
  StartDate?: string;
  RegCapital?: string;
  Status?: string;
}

// 企查查企业详情类型
export interface QccCompanyDetail {
  KeyNo: string;
  Name: string;
  CreditCode: string;
  OperName: string;
  Status: string;
  StartDate: string;
  RegistCapi: string;
  RegisteredCapital: string;
  RegisteredCapitalUnit: string;
  RegisteredCapitalCCY: string;
  Address: string;
  Scope: string;
  ContactInfo?: {
    WebSiteList?: string[];
    Email?: string;
    Tel?: string;
  };
  // 添加更多需要的字段...
}

// 博查搜索结果类型
export interface BochaSearchResult {
  name: string;
  url: string;
  snippet: string;
  summary?: string;
  siteName?: string;
  dateLastCrawled?: string;
}

// 投资建议书类型
export interface InvestmentRecommendation {
  companyBasicInfo: {
    name: string;
    creditCode: string;
    establishDate: string;
    registeredCapital: string;
    businessScope: string;
    address: string;
  };
  teamInfo: {
    coreMembers: string;
    background: string;
    experience: string;
  };
  productAndTechnology: {
    mainProducts: string;
    technologyAdvantage: string;
    patents: string;
  };
  businessModel: {
    revenueStream: string;
    customers: string;
    competitiveAdvantage: string;
  };
  marketAnalysis: {
    industrySize: string;
    growth: string;
    maturity: string;
    competition: string;
  };
  investmentSuggestion: {
    financingPlan: string;
    valuationAnalysis: string;
    risks: string;
    opportunities: string;
    recommendation: string;
  };
}

// 工作流步骤类型
export enum WorkflowStep {
  COMPANY_SEARCH = 'COMPANY_SEARCH',
  COMPANY_INFO = 'COMPANY_INFO',
  WEB_SEARCH = 'WEB_SEARCH',
  GENERATE_RECOMMENDATION = 'GENERATE_RECOMMENDATION',
  REVIEW_AND_EDIT = 'REVIEW_AND_EDIT',
  EXPORT = 'EXPORT',
} 