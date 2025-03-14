'use client'

import {
    Button
} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription, CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Input
} from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { useAtom } from 'jotai'
import {
    ArrowRight,
    Loader2,
    Search
} from 'lucide-react'
import { useState } from 'react'

import {
    searchCompany
} from '../../lib/api-services'
import {
    QccCompanySearchResult,
    WorkflowStep
} from '../../models/types'
import {
    currentStepAtom,
    errorStateAtom,
    loadingStateAtom,
    qccSearchResultsAtom,
    resetCompanyDetailAtom,
    searchQueryAtom,
    selectedCompanyAtom
} from '../../stores/investmentStore'

export function CompanySearchStep() {
  // 本地状态
  const [searchInput, setSearchInput] = useState('')
  
  // Jotai 状态
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [searchResults, setSearchResults] = useAtom(qccSearchResultsAtom)
  const [selectedCompany, setSelectedCompany] = useAtom(selectedCompanyAtom)
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
  const [loadingState, setLoadingState] = useAtom(loadingStateAtom)
  const [errorState, setErrorState] = useAtom(errorStateAtom)
  const [, resetCompanyDetail] = useAtom(resetCompanyDetailAtom)

  // 处理搜索
  const handleSearch = async () => {
    if (!searchInput.trim()) return
    
    // 更新查询和加载状态
    setSearchQuery(searchInput)
    setLoadingState({ ...loadingState, isSearching: true })
    setErrorState({ ...errorState, searchError: null })
    
    try {
      // 调用API搜索公司
      const results = await searchCompany(searchInput)
      setSearchResults(results)
    } catch (error) {
      setErrorState({ 
        ...errorState, 
        searchError: error instanceof Error ? error.message : '搜索公司时发生未知错误' 
      })
    } finally {
      setLoadingState({ ...loadingState, isSearching: false })
    }
  }

  // 处理公司选择
  const handleSelectCompany = (company: QccCompanySearchResult) => {
    // 重置公司详情，确保会重新获取新选择的公司详情
    resetCompanyDetail()
    
    // 然后设置新选中的公司
    setSelectedCompany(company)
    
    // 自动前进到下一步
    setCurrentStep(WorkflowStep.COMPANY_INFO)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input 
          placeholder="请输入公司或项目名称" 
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loadingState.isSearching}>
          {loadingState.isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              搜索中
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              搜索
            </>
          )}
        </Button>
      </div>

      {errorState.searchError && (
        <p className="text-red-500 text-sm">{errorState.searchError}</p>
      )}

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>搜索结果</CardTitle>
            <CardDescription>
              共找到 {searchResults.length} 条结果，请选择目标公司
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>公司名称</TableHead>
                  <TableHead>法定代表人</TableHead>
                  <TableHead>注册资本</TableHead>
                  <TableHead>成立日期</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((company) => (
                  <TableRow 
                    key={company.KeyNo}
                    className={selectedCompany?.KeyNo === company.KeyNo ? "bg-muted" : undefined}
                  >
                    <TableCell className="font-medium">{company.Name}</TableCell>
                    <TableCell>{company.OperName}</TableCell>
                    <TableCell>{company.RegCapital}</TableCell>
                    <TableCell>{company.StartDate}</TableCell>
                    <TableCell>{company.Status}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSelectCompany(company)}
                      >
                        选择 
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedCompany && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            已选择: <span className="font-semibold">{selectedCompany.Name}</span>
          </p>
        </div>
      )}
    </div>
  )
} 