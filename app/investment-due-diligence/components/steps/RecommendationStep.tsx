'use client'

import {
    Button
} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { useAtom } from 'jotai'
import {
    ArrowRight,
    Brain,
    RefreshCw
} from 'lucide-react'
import { useEffect } from 'react'

import {
    generateInvestmentRecommendation
} from '../../lib/api-services'
import {
    WorkflowStep
} from '../../models/types'
import {
    companyDetailAtom,
    currentStepAtom,
    errorStateAtom,
    investmentRecommendationAtom,
    loadingStateAtom,
    webSearchResultsAtom
} from '../../stores/investmentStore'

export function RecommendationStep() {
  // Jotai 状态
  const [companyDetail] = useAtom(companyDetailAtom)
  const [webSearchResults] = useAtom(webSearchResultsAtom)
  const [recommendation, setRecommendation] = useAtom(investmentRecommendationAtom)
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
  const [loadingState, setLoadingState] = useAtom(loadingStateAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)

  // 当组件挂载或依赖数据变化时生成建议书
  useEffect(() => {
    if (companyDetail && webSearchResults.length > 0 && !recommendation) {
      generateRecommendation()
    }
  }, [companyDetail, webSearchResults])

  // 生成投资建议书
  const generateRecommendation = async () => {
    if (!companyDetail || webSearchResults.length === 0) return
    
    setLoadingState({ ...loadingState, isGeneratingRecommendation: true })
    setErrorState({ ...errorState, recommendationError: null })
    
    try {
      const result = await generateInvestmentRecommendation(companyDetail, webSearchResults)
      setRecommendation(result)
    } catch (error) {
      setErrorState({ 
        ...errorState, 
        recommendationError: error instanceof Error ? error.message : '生成投资建议书时发生未知错误' 
      })
    } finally {
      setLoadingState({ ...loadingState, isGeneratingRecommendation: false })
    }
  }

  // 进入下一步
  const handleNext = () => {
    setCurrentStep(WorkflowStep.REVIEW_AND_EDIT)
  }

  if (!companyDetail || webSearchResults.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">请先完成公司信息与网络搜索步骤</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {loadingState.isGeneratingRecommendation ? (
        <div className="text-center p-8">
          <div className="flex flex-col items-center justify-center">
            <Brain className="h-16 w-16 text-primary animate-pulse mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI正在生成投资建议书</h3>
            <p className="text-muted-foreground mb-4">
              正在分析公司数据和行业信息，生成专业的投资建议书，这可能需要一些时间...
            </p>
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-progress"></div>
            </div>
          </div>
        </div>
      ) : errorState.recommendationError ? (
        <div className="text-center">
          <p className="text-red-500 mb-2">{errorState.recommendationError}</p>
          <Button onClick={generateRecommendation} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        </div>
      ) : recommendation ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>投资建议书生成完成</CardTitle>
              <CardDescription>
                已基于公司信息和网络数据生成初步投资建议书，您可以在下一步中查看和编辑
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-semibold mb-2">投资建议书包含以下内容:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>公司基本情况</li>
                    <li>团队简介</li>
                    <li>公司主要产品与技术</li>
                    <li>公司主要业务模式</li>
                    <li>行业规模及市场情况</li>
                    <li>融资计划及投资建议</li>
                  </ul>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  提示: 建议书已生成，但可能需要您在下一步进行细节调整和完善，以确保内容准确与专业。
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-4">
            <Button onClick={handleNext}>
              继续
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <Button onClick={generateRecommendation} variant="default">
            <Brain className="mr-2 h-4 w-4" />
            生成投资建议书
          </Button>
        </div>
      )}
    </div>
  )
} 