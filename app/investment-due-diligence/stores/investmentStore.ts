import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import {
    BochaSearchResult,
    InvestmentRecommendation,
    QccCompanyDetail,
    QccCompanySearchResult,
    WorkflowStep
} from '../models/types'

// 当前工作流步骤状态
export const currentStepAtom = atomWithStorage<WorkflowStep>(
  'investment-due-diligence-current-step',
  WorkflowStep.COMPANY_SEARCH
)

// 搜索查询状态
export const searchQueryAtom = atomWithStorage<string>(
  'investment-due-diligence-search-query',
  ''
)

// 企查查搜索结果状态
export const qccSearchResultsAtom = atomWithStorage<QccCompanySearchResult[]>(
  'investment-due-diligence-qcc-search-results',
  []
)

// 选中的目标公司状态
export const selectedCompanyAtom = atomWithStorage<QccCompanySearchResult | null>(
  'investment-due-diligence-selected-company',
  null
)

// 企查查公司详情状态
export const companyDetailAtom = atomWithStorage<QccCompanyDetail | null>(
  'investment-due-diligence-company-detail',
  null
)

// 重置公司详情，用于在选择新公司时清除旧数据
export const resetCompanyDetailAtom = atom(
  null,
  (get, set) => {
    set(companyDetailAtom, null)
  }
)

// 博查网络搜索结果状态
export const webSearchResultsAtom = atomWithStorage<BochaSearchResult[]>(
  'webSearchResults',
  []
)

// 网络搜索结果布局选择（grid或card）
export const webSearchLayoutAtom = atomWithStorage<'grid' | 'card'>(
  'webSearchLayout',
  'grid' // 默认使用精简网格布局
)

// 生成的投资建议书状态
export const investmentRecommendationAtom = atomWithStorage<InvestmentRecommendation | null>(
  'investment-due-diligence-recommendation',
  null
)

// 加载状态
export const loadingStateAtom = atom<{
  isSearching: boolean;
  isLoadingCompanyDetail: boolean;
  isLoadingWebSearch: boolean;
  isGeneratingRecommendation: boolean;
}>({
  isSearching: false,
  isLoadingCompanyDetail: false,
  isLoadingWebSearch: false,
  isGeneratingRecommendation: false,
})

// 错误状态
export const errorStateAtom = atom<{
  searchError: string | null;
  companyDetailError: string | null;
  webSearchError: string | null;
  recommendationError: string | null;
}>({
  searchError: null,
  companyDetailError: null,
  webSearchError: null,
  recommendationError: null,
}) 