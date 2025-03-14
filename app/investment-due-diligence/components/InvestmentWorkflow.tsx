'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { useAtom } from 'jotai'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

import {
    WorkflowStep
} from '../models/types'
import {
    companyDetailAtom,
    currentStepAtom,
    errorStateAtom,
    investmentRecommendationAtom,
    loadingStateAtom,
    selectedCompanyAtom,
    webSearchResultsAtom
} from '../stores/investmentStore'

import { CompanyInfoStep } from './steps/CompanyInfoStep'
import { CompanySearchStep } from './steps/CompanySearchStep'
import { ExportStep } from './steps/ExportStep'
import { RecommendationStep } from './steps/RecommendationStep'
import { ReviewEditStep } from './steps/ReviewEditStep'
import { WebSearchStep } from './steps/WebSearchStep'

export function InvestmentDueDiligenceWorkflow() {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
  const [selectedCompany] = useAtom(selectedCompanyAtom)
  const [companyDetail] = useAtom(companyDetailAtom)
  const [webSearchResults] = useAtom(webSearchResultsAtom)
  const [recommendation] = useAtom(investmentRecommendationAtom)
  const [loadingState] = useAtom(loadingStateAtom)
  const [errorState] = useAtom(errorStateAtom)

  // 根据当前步骤和数据状态确定哪些步骤已完成
  const isStepCompleted = (step: WorkflowStep): boolean => {
    switch (step) {
      case WorkflowStep.COMPANY_SEARCH:
        return !!selectedCompany
      case WorkflowStep.COMPANY_INFO:
        return !!companyDetail
      case WorkflowStep.WEB_SEARCH:
        return webSearchResults.length > 0
      case WorkflowStep.GENERATE_RECOMMENDATION:
        return !!recommendation
      case WorkflowStep.REVIEW_AND_EDIT:
        return currentStep === WorkflowStep.EXPORT
      case WorkflowStep.EXPORT:
        return false
      default:
        return false
    }
  }

  // 根据当前步骤状态确定哪些步骤是禁用的
  const isStepDisabled = (step: WorkflowStep): boolean => {
    switch (step) {
      case WorkflowStep.COMPANY_SEARCH:
        return false
      case WorkflowStep.COMPANY_INFO:
        return !selectedCompany
      case WorkflowStep.WEB_SEARCH:
        return !companyDetail
      case WorkflowStep.GENERATE_RECOMMENDATION:
        return !companyDetail || webSearchResults.length === 0
      case WorkflowStep.REVIEW_AND_EDIT:
        return !recommendation
      case WorkflowStep.EXPORT:
        return !recommendation
      default:
        return true
    }
  }

  // 根据步骤返回相应的组件
  const renderStepContent = (step: WorkflowStep) => {
    switch (step) {
      case WorkflowStep.COMPANY_SEARCH:
        return <CompanySearchStep />
      case WorkflowStep.COMPANY_INFO:
        return <CompanyInfoStep />
      case WorkflowStep.WEB_SEARCH:
        return <WebSearchStep />
      case WorkflowStep.GENERATE_RECOMMENDATION:
        return <RecommendationStep />
      case WorkflowStep.REVIEW_AND_EDIT:
        return <ReviewEditStep />
      case WorkflowStep.EXPORT:
        return <ExportStep />
      default:
        return null
    }
  }

  // 渲染步骤状态图标
  const renderStepStatus = (step: WorkflowStep) => {
    if (isStepCompleted(step)) {
      return <Check className="h-5 w-5 text-green-500" />
    } else if (currentStep === step && getStepLoadingState(step)) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    }
    return <ArrowRight className="h-5 w-5 text-muted-foreground" />
  }

  // 获取当前步骤的加载状态
  const getStepLoadingState = (step: WorkflowStep): boolean => {
    switch (step) {
      case WorkflowStep.COMPANY_SEARCH:
        return loadingState.isSearching
      case WorkflowStep.COMPANY_INFO:
        return loadingState.isLoadingCompanyDetail
      case WorkflowStep.WEB_SEARCH:
        return loadingState.isLoadingWebSearch
      case WorkflowStep.GENERATE_RECOMMENDATION:
        return loadingState.isGeneratingRecommendation
      default:
        return false
    }
  }

  // 获取步骤的错误状态
  const getStepErrorState = (step: WorkflowStep): string | null => {
    switch (step) {
      case WorkflowStep.COMPANY_SEARCH:
        return errorState.searchError
      case WorkflowStep.COMPANY_INFO:
        return errorState.companyDetailError
      case WorkflowStep.WEB_SEARCH:
        return errorState.webSearchError
      case WorkflowStep.GENERATE_RECOMMENDATION:
        return errorState.recommendationError
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">投资尽调流程</h2>
      
      <Accordion 
        type="single" 
        collapsible 
        defaultValue={currentStep}
        value={currentStep}
        onValueChange={(value) => {
          if (value && !isStepDisabled(value as WorkflowStep)) {
            setCurrentStep(value as WorkflowStep)
          }
        }}
      >
        {/* 第一步：公司搜索 */}
        <AccordionItem 
          value={WorkflowStep.COMPANY_SEARCH}
          disabled={isStepDisabled(WorkflowStep.COMPANY_SEARCH)}
        >
          <AccordionTrigger className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-center text-sm font-medium">
                1
              </span>
              <span>公司搜索</span>
            </div>
            <div className="ml-auto mr-4">
              {renderStepStatus(WorkflowStep.COMPANY_SEARCH)}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderStepContent(WorkflowStep.COMPANY_SEARCH)}
          </AccordionContent>
        </AccordionItem>

        {/* 第二步：公司信息 */}
        <AccordionItem 
          value={WorkflowStep.COMPANY_INFO}
          disabled={isStepDisabled(WorkflowStep.COMPANY_INFO)}
        >
          <AccordionTrigger className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-center text-sm font-medium">
                2
              </span>
              <span>公司信息</span>
            </div>
            <div className="ml-auto mr-4">
              {renderStepStatus(WorkflowStep.COMPANY_INFO)}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderStepContent(WorkflowStep.COMPANY_INFO)}
          </AccordionContent>
        </AccordionItem>

        {/* 第三步：网络搜索 */}
        <AccordionItem 
          value={WorkflowStep.WEB_SEARCH}
          disabled={isStepDisabled(WorkflowStep.WEB_SEARCH)}
        >
          <AccordionTrigger className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-center text-sm font-medium">
                3
              </span>
              <span>网络搜索</span>
            </div>
            <div className="ml-auto mr-4">
              {renderStepStatus(WorkflowStep.WEB_SEARCH)}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderStepContent(WorkflowStep.WEB_SEARCH)}
          </AccordionContent>
        </AccordionItem>

        {/* 第四步：生成建议书 */}
        <AccordionItem 
          value={WorkflowStep.GENERATE_RECOMMENDATION}
          disabled={isStepDisabled(WorkflowStep.GENERATE_RECOMMENDATION)}
        >
          <AccordionTrigger className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-center text-sm font-medium">
                4
              </span>
              <span>生成建议书</span>
            </div>
            <div className="ml-auto mr-4">
              {renderStepStatus(WorkflowStep.GENERATE_RECOMMENDATION)}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderStepContent(WorkflowStep.GENERATE_RECOMMENDATION)}
          </AccordionContent>
        </AccordionItem>

        {/* 第五步：查看与编辑 */}
        <AccordionItem 
          value={WorkflowStep.REVIEW_AND_EDIT}
          disabled={isStepDisabled(WorkflowStep.REVIEW_AND_EDIT)}
        >
          <AccordionTrigger className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-center text-sm font-medium">
                5
              </span>
              <span>查看与编辑</span>
            </div>
            <div className="ml-auto mr-4">
              {renderStepStatus(WorkflowStep.REVIEW_AND_EDIT)}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderStepContent(WorkflowStep.REVIEW_AND_EDIT)}
          </AccordionContent>
        </AccordionItem>

        {/* 第六步：导出 */}
        <AccordionItem 
          value={WorkflowStep.EXPORT}
          disabled={isStepDisabled(WorkflowStep.EXPORT)}
        >
          <AccordionTrigger className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-center text-sm font-medium">
                6
              </span>
              <span>导出报告</span>
            </div>
            <div className="ml-auto mr-4">
              {renderStepStatus(WorkflowStep.EXPORT)}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {renderStepContent(WorkflowStep.EXPORT)}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
} 