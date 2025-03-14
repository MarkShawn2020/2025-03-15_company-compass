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
    Loader2,
    RefreshCw
} from 'lucide-react'
import { useEffect } from 'react'

import {
    getCompanyDetail
} from '../../lib/api-services'
import {
    WorkflowStep
} from '../../models/types'
import {
    companyDetailAtom,
    currentStepAtom,
    errorStateAtom,
    loadingStateAtom,
    selectedCompanyAtom
} from '../../stores/investmentStore'

export function CompanyInfoStep() {
  // Jotai 状态
  const [selectedCompany] = useAtom(selectedCompanyAtom)
  const [companyDetail, setCompanyDetail] = useAtom(companyDetailAtom)
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
  const [loadingState, setLoadingState] = useAtom(loadingStateAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)

  // 当组件挂载或选中公司变化时加载公司详情
  useEffect(() => {
    if (selectedCompany && !companyDetail) {
      fetchCompanyDetail()
    }
  }, [selectedCompany])

  // 加载公司详情
  const fetchCompanyDetail = async () => {
    if (!selectedCompany) return
    
    setLoadingState({ ...loadingState, isLoadingCompanyDetail: true })
    setErrorState({ ...errorState, companyDetailError: null })
    
    try {
      const details = await getCompanyDetail(selectedCompany.KeyNo)
      setCompanyDetail(details)
    } catch (error) {
      setErrorState({ 
        ...errorState, 
        companyDetailError: error instanceof Error ? error.message : '获取公司详情时发生未知错误' 
      })
    } finally {
      setLoadingState({ ...loadingState, isLoadingCompanyDetail: false })
    }
  }

  // 进入下一步
  const handleNext = () => {
    setCurrentStep(WorkflowStep.WEB_SEARCH)
  }

  if (!selectedCompany) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">请先选择一个公司</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {loadingState.isLoadingCompanyDetail ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">加载公司详情...</p>
        </div>
      ) : errorState.companyDetailError ? (
        <div className="text-center">
          <p className="text-red-500 mb-2">{errorState.companyDetailError}</p>
          <Button onClick={fetchCompanyDetail} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        </div>
      ) : companyDetail ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{companyDetail.Name}</CardTitle>
              <CardDescription>
                统一社会信用代码: {companyDetail.CreditCode} · 成立日期: {companyDetail.StartDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">法定代表人</p>
                    <p>{companyDetail.OperName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">注册资本</p>
                    <p>{companyDetail.RegistCapi}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">经营状态</p>
                    <p>{companyDetail.Status}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">注册地址</p>
                    <p>{companyDetail.Address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">联系方式</p>
                    <p>电话: {companyDetail.ContactInfo?.Tel || '暂无'}</p>
                    <p>邮箱: {companyDetail.ContactInfo?.Email || '暂无'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">经营范围</p>
                <p className="text-sm mt-1">{companyDetail.Scope}</p>
              </div>

              {companyDetail.ContactInfo?.WebSiteList && companyDetail.ContactInfo.WebSiteList.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">官方网站</p>
                  <ul className="list-disc list-inside">
                    {companyDetail.ContactInfo.WebSiteList.map((website, index) => (
                      <li key={index}>
                        <a 
                          href={website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {website}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end mt-4">
            <Button onClick={handleNext}>
              继续
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
} 