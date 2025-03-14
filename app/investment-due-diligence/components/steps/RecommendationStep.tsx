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
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { useEffect, useState } from 'react'

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
  
  // 本地状态，用于显示生成进度
  const [generationPhase, setGenerationPhase] = useState<string>('准备中')
  const [phaseIndex, setPhaseIndex] = useState<number>(0)
  // 跟踪建议书是否是通过真实API生成的
  const [isRealApiGenerated, setIsRealApiGenerated] = useState<boolean>(false)
  
  // 生成阶段描述
  const generationPhases = [
    '准备数据分析',
    '分析公司基本信息',
    '分析团队背景',
    '评估产品与技术',
    '分析商业模式',
    '进行市场分析',
    '制定投资建议',
    '生成报告'
  ]

  // 当组件挂载或依赖数据变化时生成建议书
  useEffect(() => {
    if (companyDetail && webSearchResults.length > 0 && !recommendation) {
      generateRecommendation()
    }
  }, [companyDetail, webSearchResults])
  
  // 模拟生成进度的效果
  useEffect(() => {
    if (loadingState.isGeneratingRecommendation) {
      const interval = setInterval(() => {
        // 更新当前阶段
        setPhaseIndex(prev => {
          // 如果已经到最后一个阶段，就保持在最后一个阶段
          if (prev >= generationPhases.length - 1) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 3000) // 每3秒更新一次阶段
      
      return () => clearInterval(interval)
    } else {
      // 重置进度
      setPhaseIndex(0)
      setGenerationPhase('准备中')
    }
  }, [loadingState.isGeneratingRecommendation])
  
  // 根据阶段索引更新阶段描述
  useEffect(() => {
    if (phaseIndex < generationPhases.length) {
      setGenerationPhase(generationPhases[phaseIndex])
    }
  }, [phaseIndex])

  // 生成投资建议书
  const generateRecommendation = async (forceRealApi: boolean = false) => {
    if (!companyDetail || webSearchResults.length === 0) return
    
    setLoadingState({ ...loadingState, isGeneratingRecommendation: true })
    setErrorState({ ...errorState, recommendationError: null })
    setPhaseIndex(0) // 重置生成阶段
    
    try {
      // 添加日志以检查环境变量的值
      console.log('环境变量 NEXT_PUBLIC_USE_MOCK_DATA 的值:', process.env.NEXT_PUBLIC_USE_MOCK_DATA);
      console.log('是否将使用模拟数据:', !forceRealApi && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true');
      console.log('DeepSeek API密钥是否配置:', !!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY);
      console.log('强制使用真实API:', forceRealApi);
      
      console.log('开始生成投资建议书，正在调用API服务...');
      const result = await generateInvestmentRecommendation(companyDetail, webSearchResults, forceRealApi)
      console.log('投资建议书生成完成:', result);
      setRecommendation(result)
      setIsRealApiGenerated(forceRealApi)
    } catch (error) {
      console.error('生成投资建议书时发生错误:', error);
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
              当前阶段: <span className="font-medium text-primary">{generationPhase}</span>
            </p>
            
            {/* 进度条 */}
            <div className="w-full max-w-md mb-6">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-in-out" 
                  style={{ width: `${(phaseIndex / (generationPhases.length - 1)) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <span>数据分析</span>
                <span className="float-right">生成完成</span>
              </div>
            </div>
            
            {/* 进度阶段列表 */}
            <div className="w-full max-w-md">
              <ul className="space-y-2">
                {generationPhases.map((phase, index) => (
                  <li 
                    key={index} 
                    className={`flex items-center text-sm ${
                      index <= phaseIndex ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {index < phaseIndex ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : index === phaseIndex ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <div className="mr-2 h-4 w-4 rounded-full border border-muted-foreground" />
                    )}
                    {phase}
                  </li>
                ))}
              </ul>
            </div>
            
            <p className="text-xs text-muted-foreground mt-6">
              使用DeepSeek AI分析公司数据并生成投资建议书，这可能需要30秒到1分钟...
            </p>
          </div>
        </div>
      ) : errorState.recommendationError ? (
        <div className="text-center">
          <p className="text-red-500 mb-2">{errorState.recommendationError}</p>
          <Button onClick={() => generateRecommendation(true)} variant="outline">
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
                {isRealApiGenerated && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    DeepSeek AI生成
                  </span>
                )}
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
                
                {/* 添加模拟数据模式提示 */}
                {!isRealApiGenerated && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4 text-sm text-amber-800">
                    <p className="font-medium">注意: 当前使用的是模拟数据</p>
                    <p>此投资建议书是使用模拟数据生成的，不代表真实API调用结果。请点击下方"重新生成建议书"按钮使用DeepSeek AI生成真实内容。</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-4">
            <Button 
              onClick={() => {
                // 清除当前建议书并重新生成
                setRecommendation(null);
                setPhaseIndex(0);
                setGenerationPhase('准备中');
                generateRecommendation(true);
              }} 
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重新生成建议书
            </Button>
            <Button onClick={handleNext} variant="default">
              继续到下一步
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center p-8">
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <Brain className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">生成投资建议书</h3>
            <p className="text-muted-foreground mb-6 text-center">
              通过DeepSeek AI分析公司基本信息和网络搜索结果，生成专业的投资建议书，
              包括公司分析、团队评估、技术优势、市场前景和投资建议等内容。
            </p>
            
            {/* 添加模拟数据模式提示 */}
            {process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 w-full text-sm text-amber-800">
                <p className="font-medium">当前环境配置为模拟数据模式</p>
                <p>点击下方按钮将强制使用DeepSeek AI生成真实建议书，忽略环境变量设置。</p>
              </div>
            )}
            
            <Button onClick={() => generateRecommendation(true)} variant="default" size="lg">
              <Brain className="mr-2 h-5 w-5" />
              使用DeepSeek AI生成建议书
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 