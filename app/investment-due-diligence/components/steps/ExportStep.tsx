'use client'

import {
    Button
} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs'
import { useAtom } from 'jotai'
import {
    CheckCircle,
    Copy,
    Download,
    FileText,
    Printer,
    Share2
} from 'lucide-react'
import { useState } from 'react'

import {
    investmentRecommendationAtom,
    selectedCompanyAtom
} from '../../stores/investmentStore'

export function ExportStep() {
  // Jotai 状态
  const [selectedCompany] = useAtom(selectedCompanyAtom)
  const [recommendation] = useAtom(investmentRecommendationAtom)
  
  // 本地状态
  const [activeTab, setActiveTab] = useState('preview')
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx'>('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  // 处理导出
  const handleExport = async () => {
    if (!recommendation) return
    
    setIsExporting(true)
    
    try {
      // 导出逻辑实现
      // 实际项目中需要实现PDF或Word文档生成
      // 这里仅作演示，模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 模拟下载操作
      const dummyLink = document.createElement('a')
      dummyLink.href = '#'
      dummyLink.setAttribute('download', `${selectedCompany?.Name || '企业'}_投资建议书.${exportFormat}`)
      dummyLink.click()
    } catch (error) {
      console.error('导出失败:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // 处理打印
  const handlePrint = () => {
    window.print()
  }

  // 处理复制链接
  const handleCopyLink = () => {
    // 在实际项目中，这里应该是生成分享链接并复制到剪贴板
    navigator.clipboard.writeText(`${window.location.origin}/shared-report/${selectedCompany?.KeyNo || 'example'}`)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('复制失败:', err)
      })
  }

  if (!recommendation) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">请先生成投资建议书</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">导出投资建议书</h3>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-2" />
            打印
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            分享
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px] mb-4">
          <TabsTrigger value="preview" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            预览
          </TabsTrigger>
          <TabsTrigger value="download" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            下载
          </TabsTrigger>
        </TabsList>
        
        {/* 预览标签内容 */}
        <TabsContent value="preview">
          <Card className="mb-4">
            <CardHeader className="text-center border-b">
              <CardTitle className="text-2xl">{selectedCompany?.Name || '公司'} 投资建议书</CardTitle>
              <CardDescription>生成日期: {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8 max-w-3xl mx-auto">
                {/* 公司基本情况 */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">一、公司基本情况</h2>
                  <div className="space-y-2">
                    <p><strong>公司名称：</strong>{recommendation.companyBasicInfo.name}</p>
                    <p><strong>统一社会信用代码：</strong>{recommendation.companyBasicInfo.creditCode}</p>
                    <p><strong>成立日期：</strong>{recommendation.companyBasicInfo.establishDate}</p>
                    <p><strong>注册资本：</strong>{recommendation.companyBasicInfo.registeredCapital}</p>
                    <p><strong>注册地址：</strong>{recommendation.companyBasicInfo.address}</p>
                    <p><strong>经营范围：</strong>{recommendation.companyBasicInfo.businessScope}</p>
                  </div>
                </section>
                
                {/* 团队简介 */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">二、团队简介</h2>
                  <div className="space-y-2">
                    <p><strong>核心成员：</strong></p>
                    <p className="whitespace-pre-line pl-4">{recommendation.teamInfo.coreMembers}</p>
                    <p><strong>团队背景：</strong></p>
                    <p className="pl-4">{recommendation.teamInfo.background}</p>
                    <p><strong>相关经验：</strong></p>
                    <p className="pl-4">{recommendation.teamInfo.experience}</p>
                  </div>
                </section>
                
                {/* 产品与技术 */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">三、产品与技术</h2>
                  <div className="space-y-2">
                    <p><strong>主要产品：</strong></p>
                    <p className="whitespace-pre-line pl-4">{recommendation.productAndTechnology.mainProducts}</p>
                    <p><strong>技术优势：</strong></p>
                    <p className="pl-4">{recommendation.productAndTechnology.technologyAdvantage}</p>
                    <p><strong>专利情况：</strong></p>
                    <p className="pl-4">{recommendation.productAndTechnology.patents}</p>
                  </div>
                </section>
                
                {/* 业务模式 */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">四、业务模式</h2>
                  <div className="space-y-2">
                    <p><strong>收入来源：</strong></p>
                    <p className="pl-4">{recommendation.businessModel.revenueStream}</p>
                    <p><strong>客户情况：</strong></p>
                    <p className="pl-4">{recommendation.businessModel.customers}</p>
                    <p><strong>竞争优势：</strong></p>
                    <p className="pl-4">{recommendation.businessModel.competitiveAdvantage}</p>
                  </div>
                </section>
                
                {/* 市场分析 */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">五、市场分析</h2>
                  <div className="space-y-2">
                    <p><strong>行业规模：</strong></p>
                    <p className="pl-4">{recommendation.marketAnalysis.industrySize}</p>
                    <p><strong>成长性：</strong></p>
                    <p className="pl-4">{recommendation.marketAnalysis.growth}</p>
                    <p><strong>成熟度：</strong></p>
                    <p className="pl-4">{recommendation.marketAnalysis.maturity}</p>
                    <p><strong>竞争格局：</strong></p>
                    <p className="pl-4">{recommendation.marketAnalysis.competition}</p>
                  </div>
                </section>
                
                {/* 投资建议 */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">六、投资建议</h2>
                  <div className="space-y-2">
                    <p><strong>融资计划：</strong></p>
                    <p className="pl-4">{recommendation.investmentSuggestion.financingPlan}</p>
                    <p><strong>估值分析：</strong></p>
                    <p className="pl-4">{recommendation.investmentSuggestion.valuationAnalysis}</p>
                    <p><strong>风险：</strong></p>
                    <p className="pl-4">{recommendation.investmentSuggestion.risks}</p>
                    <p><strong>机会：</strong></p>
                    <p className="pl-4">{recommendation.investmentSuggestion.opportunities}</p>
                    <p><strong>建议：</strong></p>
                    <p className="pl-4">{recommendation.investmentSuggestion.recommendation}</p>
                  </div>
                </section>
              </div>
            </CardContent>
            <CardFooter className="border-t text-center pt-4 flex justify-center">
              <p className="text-sm text-muted-foreground">本报告由投资尽调报告生成器生成，仅供参考</p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 下载标签内容 */}
        <TabsContent value="download">
          <Card>
            <CardHeader>
              <CardTitle>下载投资建议书</CardTitle>
              <CardDescription>
                选择下载格式，获取完整的投资建议书文档
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant={exportFormat === 'pdf' ? 'default' : 'outline'} 
                  className="h-24 flex flex-col"
                  onClick={() => setExportFormat('pdf')}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span>PDF格式</span>
                </Button>
                <Button 
                  variant={exportFormat === 'docx' ? 'default' : 'outline'} 
                  className="h-24 flex flex-col"
                  onClick={() => setExportFormat('docx')}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span>Word文档</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                size="lg"
                onClick={handleExport}
                disabled={isExporting}
                className="w-1/2"
              >
                {isExporting ? (
                  <>
                    <FileText className="h-5 w-5 mr-2 animate-spin" />
                    正在生成...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    下载{exportFormat === 'pdf' ? 'PDF' : 'Word文档'}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 分享对话框 */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>分享投资建议书</DialogTitle>
            <DialogDescription>
              复制链接，与他人分享该投资建议书
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 mt-4">
            <input 
              type="text" 
              readOnly 
              className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
              value={`${window.location.origin}/shared-report/${selectedCompany?.KeyNo || 'example'}`}
            />
            <Button onClick={handleCopyLink} variant="secondary" className="min-w-[80px]">
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  复制
                </>
              )}
            </Button>
          </div>
          
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowShareDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 