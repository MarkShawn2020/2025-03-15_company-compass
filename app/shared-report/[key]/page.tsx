'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { InvestmentRecommendation } from '@/app/investment-due-diligence/models/types'

// 定义 params 的类型
type PageParams = {
  key: string;
}

export default function SharedReportPage({ params }: { params: Promise<PageParams> }) {
  const [key, setKey] = useState<string | null>(null);
  const [report, setReport] = useState<InvestmentRecommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  // 解析 params
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setKey(resolvedParams.key);
      } catch (err) {
        console.error('解析参数错误:', err);
        setError('无法加载页面参数');
      }
    };
    
    resolveParams();
  }, [params]);
  
  // 获取报告数据
  useEffect(() => {
    if (!key) return;

    const fetchReport = async () => {
      try {
        setLoading(true)
        
        // 从API获取报告数据，使用解包后的 key 参数
        const response = await fetch(`/api/shared-reports/${key}`)
        
        if (!response.ok) {
          // 处理错误状态码
          if (response.status === 404) {
            setError('找不到对应的报告数据')
          } else {
            setError('获取报告数据时发生错误')
          }
          return
        }
        
        const data = await response.json()
        setReport(data)
      } catch (err) {
        console.error('获取报告失败:', err)
        setError('获取报告数据时发生错误')
      } finally {
        setLoading(false)
      }
    }
    
    fetchReport()
  }, [key]) // 依赖项也使用新解包的 key
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">加载共享报告...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !report) {
    return (
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-semibold mb-4">报告未找到</h2>
          <p className="text-muted-foreground mb-6">{error || '无法加载此报告，链接可能已过期或无效'}</p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => router.push('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回首页
      </Button>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">共享投资尽调报告</h1>
        <p className="text-muted-foreground">
          分享ID: {key}
        </p>
      </div>
      
      {/* 预览内容 */}
      <Card className="mb-4">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl">{report.companyBasicInfo.name} 投资建议书</CardTitle>
          <CardDescription>生成日期: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8 max-w-3xl mx-auto">
            {/* 公司基本情况 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">一、公司基本情况</h2>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">公司名称</TableCell>
                    <TableCell>{report.companyBasicInfo.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">统一社会信用代码</TableCell>
                    <TableCell>{report.companyBasicInfo.creditCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">成立日期</TableCell>
                    <TableCell>{report.companyBasicInfo.establishDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">注册资本</TableCell>
                    <TableCell>{report.companyBasicInfo.registeredCapital}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">注册地址</TableCell>
                    <TableCell>{report.companyBasicInfo.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">经营范围</TableCell>
                    <TableCell className="whitespace-pre-wrap">{report.companyBasicInfo.businessScope}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>
            
            {/* 团队简介 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">二、团队简介</h2>
              <div className="space-y-2">
                <p><strong>核心成员：</strong></p>
                <p className="whitespace-pre-line pl-4">{report.teamInfo.coreMembers}</p>
                <p><strong>团队背景：</strong></p>
                <p className="pl-4">{report.teamInfo.background}</p>
                <p><strong>相关经验：</strong></p>
                <p className="pl-4">{report.teamInfo.experience}</p>
              </div>
            </section>
            
            {/* 产品与技术 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">三、产品与技术</h2>
              <div className="space-y-2">
                <p><strong>主要产品：</strong></p>
                <p className="whitespace-pre-line pl-4">{report.productAndTechnology.mainProducts}</p>
                <p><strong>技术优势：</strong></p>
                <p className="pl-4">{report.productAndTechnology.technologyAdvantage}</p>
                <p><strong>专利情况：</strong></p>
                <p className="pl-4">{report.productAndTechnology.patents}</p>
              </div>
            </section>
            
            {/* 业务模式 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">四、业务模式</h2>
              <div className="space-y-2">
                <p><strong>收入来源：</strong></p>
                <p className="pl-4">{report.businessModel.revenueStream}</p>
                <p><strong>客户情况：</strong></p>
                <p className="pl-4">{report.businessModel.customers}</p>
                <p><strong>竞争优势：</strong></p>
                <p className="pl-4">{report.businessModel.competitiveAdvantage}</p>
              </div>
            </section>
            
            {/* 市场分析 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">五、市场分析</h2>
              <div className="space-y-2">
                <p><strong>行业规模：</strong></p>
                <p className="pl-4">{report.marketAnalysis.industrySize}</p>
                <p><strong>成长性：</strong></p>
                <p className="pl-4">{report.marketAnalysis.growth}</p>
                <p><strong>成熟度：</strong></p>
                <p className="pl-4">{report.marketAnalysis.maturity}</p>
                <p><strong>竞争格局：</strong></p>
                <p className="pl-4">{report.marketAnalysis.competition}</p>
              </div>
            </section>
            
            {/* 投资建议 */}
            <section>
              <h2 className="text-xl font-semibold mb-4">六、投资建议</h2>
              <div className="space-y-2">
                <p><strong>融资计划：</strong></p>
                <p className="pl-4">{report.investmentSuggestion.financingPlan}</p>
                <p><strong>估值分析：</strong></p>
                <p className="pl-4">{report.investmentSuggestion.valuationAnalysis}</p>
                <p><strong>风险：</strong></p>
                <p className="pl-4">{report.investmentSuggestion.risks}</p>
                <p><strong>机会：</strong></p>
                <p className="pl-4">{report.investmentSuggestion.opportunities}</p>
                <p><strong>建议：</strong></p>
                <p className="pl-4">{report.investmentSuggestion.recommendation}</p>
              </div>
            </section>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <p className="text-sm text-muted-foreground w-full text-center">本报告由投资尽调报告生成器生成，仅供参考</p>
        </CardFooter>
      </Card>
    </div>
  )
} 