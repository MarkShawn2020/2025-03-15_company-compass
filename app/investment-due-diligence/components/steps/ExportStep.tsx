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
import { useEffect, useRef, useState } from 'react'
// 导入file-saver
// @ts-ignore
import { saveAs } from 'file-saver'

import {
    investmentRecommendationAtom,
    selectedCompanyAtom
} from '../../stores/investmentStore'

// 删除无效的模块声明

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
  const [pdfMakeReady, setPdfMakeReady] = useState(false)
  
  // 报告内容的ref，用于HTML到PDF转换
  const reportContentRef = useRef<HTMLDivElement>(null)

  // 初始化pdfMake - 仅在客户端执行，使用动态导入
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 动态导入pdfMake相关模块
      const initPdfMake = async () => {
        try {
          // 动态导入
          // @ts-ignore
          const pdfMakeModule = await import('pdfmake/build/pdfmake');
          // @ts-ignore
          const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
          
          // 获取实例
          // @ts-ignore
          const pdfMake = pdfMakeModule.default;
          
          // 安全检查
          if (pdfMake && pdfFontsModule.default && pdfFontsModule.default.pdfMake && pdfFontsModule.default.pdfMake.vfs) {
            // 初始化字体
            pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
            
            // 设置字体
            pdfMake.fonts = {
              Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf'
              },
              SimSun: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf'
              }
            };
            
            // 标记初始化完成
            setPdfMakeReady(true);
            console.log('pdfMake initialized successfully');
          } else {
            console.error('pdfMake or pdfFontsModule is not properly loaded');
          }
        } catch (error) {
          console.error('Failed to initialize pdfMake:', error);
        }
      };
      
      initPdfMake();
    }
  }, []);

  // 处理导出
  const handleExport = async () => {
    if (!recommendation) return
    
    setIsExporting(true)
    
    try {
      // 根据选择的格式导出文件
      if (exportFormat === 'pdf') {
        // 检查pdfMake是否已初始化
        if (!pdfMakeReady) {
          // 如果pdfMake未准备好，动态导入并初始化
          // @ts-ignore
          const pdfMakeModule = await import('pdfmake/build/pdfmake');
          // @ts-ignore
          const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
          
          // @ts-ignore
          const pdfMake = pdfMakeModule.default;
          
          // 安全检查
          if (!pdfMake || !pdfFontsModule.default || !pdfFontsModule.default.pdfMake || !pdfFontsModule.default.pdfMake.vfs) {
            throw new Error('PDF生成库加载失败，请刷新页面重试');
          }
          
          // 初始化
          pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
          
          pdfMake.fonts = {
            Roboto: {
              normal: 'Roboto-Regular.ttf',
              bold: 'Roboto-Medium.ttf',
              italics: 'Roboto-Italic.ttf',
              bolditalics: 'Roboto-MediumItalic.ttf'
            },
            SimSun: {
              normal: 'Roboto-Regular.ttf',
              bold: 'Roboto-Medium.ttf',
              italics: 'Roboto-Italic.ttf',
              bolditalics: 'Roboto-MediumItalic.ttf'
            }
          };
        }
      
        const companyName = selectedCompany?.Name || '企业'
        const fileName = `${companyName}_投资建议书.pdf`
        
        // 创建PDF文档定义
        const docDefinition = {
          // 设置页面默认值
          defaultStyle: {
            font: 'SimSun',  // 使用中文字体
            fontSize: 10,
            lineHeight: 1.5
          },
          // 页眉
          header: function(currentPage: number, pageCount: number) {
            return { 
              text: `第 ${currentPage} 页 / 共 ${pageCount} 页`,
              alignment: 'right',
              margin: [0, 10, 20, 0],
              fontSize: 8,
              color: '#666666'
            };
          },
          // 页脚
          footer: function() {
            return { 
              text: '本报告由投资尽调报告生成器生成，仅供参考',
              alignment: 'center',
              margin: [0, 0, 0, 10],
              fontSize: 8,
              color: '#666666'
            };
          },
          // 内容
          content: [
            // 标题
            {
              text: `${companyName} 投资建议书`,
              style: 'header',
              alignment: 'center',
              margin: [0, 0, 0, 5]
            },
            {
              text: `生成日期: ${new Date().toLocaleDateString()}`,
              alignment: 'center',
              margin: [0, 0, 0, 20],
              fontSize: 10,
              color: '#666666'
            },
            
            // 公司基本情况
            {
              text: '一、公司基本情况',
              style: 'sectionHeader'
            },
            {
              text: [
                { text: '公司名称：', bold: true },
                recommendation.companyBasicInfo.name,
                '\n',
                { text: '统一社会信用代码：', bold: true },
                recommendation.companyBasicInfo.creditCode,
                '\n',
                { text: '成立日期：', bold: true },
                recommendation.companyBasicInfo.establishDate,
                '\n',
                { text: '注册资本：', bold: true },
                recommendation.companyBasicInfo.registeredCapital,
                '\n',
                { text: '注册地址：', bold: true },
                recommendation.companyBasicInfo.address,
                '\n',
                { text: '经营范围：', bold: true },
                recommendation.companyBasicInfo.businessScope
              ],
              margin: [0, 5, 0, 15]
            },
            
            // 团队简介
            {
              text: '二、团队简介',
              style: 'sectionHeader'
            },
            {
              text: '核心成员：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.teamInfo.coreMembers,
              margin: [10, 0, 0, 5]
            },
            {
              text: '团队背景：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.teamInfo.background,
              margin: [10, 0, 0, 5]
            },
            {
              text: '相关经验：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.teamInfo.experience,
              margin: [10, 0, 0, 15]
            },
            
            // 产品与技术
            {
              text: '三、产品与技术',
              style: 'sectionHeader'
            },
            {
              text: '主要产品：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.productAndTechnology.mainProducts,
              margin: [10, 0, 0, 5]
            },
            {
              text: '技术优势：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.productAndTechnology.technologyAdvantage,
              margin: [10, 0, 0, 5]
            },
            {
              text: '专利情况：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.productAndTechnology.patents,
              margin: [10, 0, 0, 15]
            },
            
            // 业务模式
            {
              text: '四、业务模式',
              style: 'sectionHeader'
            },
            {
              text: '收入来源：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.businessModel.revenueStream,
              margin: [10, 0, 0, 5]
            },
            {
              text: '客户情况：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.businessModel.customers,
              margin: [10, 0, 0, 5]
            },
            {
              text: '竞争优势：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.businessModel.competitiveAdvantage,
              margin: [10, 0, 0, 15]
            },
            
            // 市场分析
            {
              text: '五、市场分析',
              style: 'sectionHeader'
            },
            {
              text: '行业规模：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.marketAnalysis.industrySize,
              margin: [10, 0, 0, 5]
            },
            {
              text: '成长性：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.marketAnalysis.growth,
              margin: [10, 0, 0, 5]
            },
            {
              text: '成熟度：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.marketAnalysis.maturity,
              margin: [10, 0, 0, 5]
            },
            {
              text: '竞争格局：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.marketAnalysis.competition,
              margin: [10, 0, 0, 15]
            },
            
            // 投资建议
            {
              text: '六、投资建议',
              style: 'sectionHeader'
            },
            {
              text: '融资计划：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.investmentSuggestion.financingPlan,
              margin: [10, 0, 0, 5]
            },
            {
              text: '估值分析：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.investmentSuggestion.valuationAnalysis,
              margin: [10, 0, 0, 5]
            },
            {
              text: '风险：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.investmentSuggestion.risks,
              margin: [10, 0, 0, 5]
            },
            {
              text: '机会：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.investmentSuggestion.opportunities,
              margin: [10, 0, 0, 5]
            },
            {
              text: '建议：',
              bold: true,
              margin: [0, 5, 0, 2]
            },
            {
              text: recommendation.investmentSuggestion.recommendation,
              margin: [10, 0, 0, 5]
            }
          ],
          // 样式定义
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 0, 0, 10]
            },
            sectionHeader: {
              fontSize: 14,
              bold: true,
              margin: [0, 10, 0, 5]
            }
          }
        };
        
        // 动态导入再次检查
        // @ts-ignore
        const pdfMakeModule = await import('pdfmake/build/pdfmake');
        // @ts-ignore
        const pdfMake = pdfMakeModule.default;
        
        // 创建PDF并下载
        pdfMake.createPdf(docDefinition).download(fileName);
      } else if (exportFormat === 'docx') {
        // 在实际项目中可以添加docx导出逻辑
        // 这里为了演示，暂时使用Blob创建一个简单的文本文档
        const companyName = selectedCompany?.Name || '企业'
        const content = `
${companyName} 投资建议书
生成日期: ${new Date().toLocaleDateString()}

一、公司基本情况
公司名称：${recommendation.companyBasicInfo.name}
统一社会信用代码：${recommendation.companyBasicInfo.creditCode}
成立日期：${recommendation.companyBasicInfo.establishDate}
注册资本：${recommendation.companyBasicInfo.registeredCapital}
注册地址：${recommendation.companyBasicInfo.address}
经营范围：${recommendation.companyBasicInfo.businessScope}

二、团队简介
核心成员：
${recommendation.teamInfo.coreMembers}
团队背景：
${recommendation.teamInfo.background}
相关经验：
${recommendation.teamInfo.experience}
        `
        const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        saveAs(blob, `${companyName}_投资建议书.docx`)
      }
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请稍后重试：' + (error instanceof Error ? error.message : '未知错误'))
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
              <div className="space-y-8 max-w-3xl mx-auto" ref={reportContentRef}>
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