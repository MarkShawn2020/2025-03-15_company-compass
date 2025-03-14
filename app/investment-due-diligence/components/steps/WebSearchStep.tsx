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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAtom } from 'jotai'
import {
  ArrowRight,
  ExternalLink,
  Grid,
  LayoutList,
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
  webSearchLayoutAtom,
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
  const [layout, setLayout] = useAtom(webSearchLayoutAtom)

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
      // 构建搜索关键词 - 使用公司名称和核心业务领域
      const searchQuery = `${companyDetail.Name} 公司简介 商业模式 融资`;
      console.log('执行网络搜索，关键词:', searchQuery);
      
      const results = await webSearch(searchQuery)
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

  // 布局切换
  const handleLayoutChange = (value: string) => {
    setLayout(value as 'grid' | 'card')
  }

  // 进入下一步
  const handleNext = () => {
    setCurrentStep(WorkflowStep.GENERATE_RECOMMENDATION)
  }

  // 渲染网格布局（精简模式）
  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {webSearchResults.map((result, index) => (
        <a 
          key={index}
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0 w-6 h-6 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mr-3">
            {result.siteName?.[0] || 'W'}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-medium text-blue-600 truncate">{result.name}</h3>
          </div>
        </a>
      ))}
    </div>
  )

  // 渲染卡片布局（详细模式）
  const renderCardLayout = () => (
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
  )

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
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>网络搜索结果</CardTitle>
                  <CardDescription>
                    关于 {companyDetail.Name} 的网络信息，共 {webSearchResults.length} 条结果
                  </CardDescription>
                </div>
                <Tabs 
                  value={layout} 
                  onValueChange={handleLayoutChange}
                  className="ml-auto"
                >
                  <TabsList className="grid w-20 grid-cols-2">
                    <TabsTrigger value="grid" title="精简布局" aria-label="切换到精简网格布局">
                      <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="card" title="详细卡片" aria-label="切换到详细卡片布局">
                      <LayoutList className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {/* 根据选择的布局展示不同的内容 */}
              {layout === 'grid' ? renderGridLayout() : renderCardLayout()}
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>提示:</strong> 这些网络搜索结果将用于生成投资建议书，提供公司背景、
                  业务模式、市场竞争情况等关键信息。如果这些结果不够准确或不全面，可点击"重新搜索"按钮尝试
                  获取更多信息。
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-4">
            <Button onClick={performWebSearch} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              重新搜索
            </Button>
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