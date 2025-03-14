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
    ExternalLink,
    Loader2,
    RefreshCw
} from 'lucide-react'
import { useEffect } from 'react'

import {
    webSearch
} from '../../lib/api-services'
import {
    WorkflowStep
} from '../../models/types'
import {
    companyDetailAtom,
    currentStepAtom,
    errorStateAtom,
    loadingStateAtom,
    selectedCompanyAtom,
    webSearchResultsAtom
} from '../../stores/investmentStore'

export function WebSearchStep() {
  // Jotai 状态
  const [selectedCompany] = useAtom(selectedCompanyAtom)
  const [companyDetail] = useAtom(companyDetailAtom)
  const [webSearchResults, setWebSearchResults] = useAtom(webSearchResultsAtom)
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
  const [loadingState, setLoadingState] = useAtom(loadingStateAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)

  // 当组件挂载或公司详情变化时执行网络搜索
  useEffect(() => {
    if (companyDetail && webSearchResults.length === 0) {
      performWebSearch()
    }
  }, [companyDetail])

  // 执行网络搜索
  const performWebSearch = async () => {
    if (!companyDetail) return
    
    setLoadingState({ ...loadingState, isLoadingWebSearch: true })
    setErrorState({ ...errorState, webSearchError: null })
    
    try {
      const results = await webSearch(companyDetail.Name)
      setWebSearchResults(results)
    } catch (error) {
      setErrorState({ 
        ...errorState, 
        webSearchError: error instanceof Error ? error.message : '网络搜索时发生未知错误' 
      })
    } finally {
      setLoadingState({ ...loadingState, isLoadingWebSearch: false })
    }
  }

  // 进入下一步
  const handleNext = () => {
    setCurrentStep(WorkflowStep.GENERATE_RECOMMENDATION)
  }

  if (!companyDetail) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">请先获取公司详情</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {loadingState.isLoadingWebSearch ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">正在搜索网络信息...</p>
        </div>
      ) : errorState.webSearchError ? (
        <div className="text-center">
          <p className="text-red-500 mb-2">{errorState.webSearchError}</p>
          <Button onClick={performWebSearch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        </div>
      ) : webSearchResults.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>网络搜索结果</CardTitle>
              <CardDescription>
                关于 {companyDetail.Name} 的网络信息，共 {webSearchResults.length} 条结果
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webSearchResults.map((result, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          {result.name}
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        来源: {result.siteName || '未知'} · 
                        时间: {result.dateLastCrawled ? new Date(result.dateLastCrawled).toLocaleDateString() : '未知'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">{result.snippet}</p>
                      {result.summary && (
                        <div className="mt-2 text-sm bg-muted p-2 rounded-md">
                          <p className="font-semibold">摘要:</p>
                          <p>{result.summary}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
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
          <p className="text-muted-foreground mb-2">暂无搜索结果</p>
          <Button onClick={performWebSearch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            重新搜索
          </Button>
        </div>
      )}
    </div>
  )
} 