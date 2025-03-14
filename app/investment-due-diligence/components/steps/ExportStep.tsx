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
import { saveAs } from 'file-saver'
import { useAtom } from 'jotai'
import {
  CheckCircle,
  Copy,
  Download,
  FileText, Share2
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { InvestmentRecommendation } from '../../models/types'
import {
  investmentRecommendationAtom,
  selectedCompanyAtom
} from '../../stores/investmentStore'

export function ExportStep() {
  // Jotai 状态
  const [selectedCompany] = useAtom(selectedCompanyAtom)
  const [recommendation] = useAtom(investmentRecommendationAtom)
  
  // 本地状态
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [isExportingDocx, setIsExportingDocx] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')

  // 生成Markdown内容
  useEffect(() => {
    if (recommendation) {
      const md = generateMarkdown(recommendation, selectedCompany?.Name || '企业')
      setMarkdownContent(md)
    }
  }, [recommendation, selectedCompany])

  // 处理导出PDF
  const handleExportPdf = async () => {
    if (!recommendation) return
    
    setIsExportingPdf(true) 
    
    try {
      await exportToPdf(markdownContent, `${selectedCompany?.Name || '企业'}_投资建议书`)
    } catch (error) {
      console.error('导出PDF失败:', error)
      alert('导出PDF时发生错误，请重试')
    } finally {
      setIsExportingPdf(false)
    }
  }
  
  // 处理导出Word
  const handleExportDocx = async () => {
    if (!recommendation) return
    
    setIsExportingDocx(true)
    
    try {
      await exportToDocx(markdownContent, `${selectedCompany?.Name || '企业'}_投资建议书`)
    } catch (error) {
      console.error('导出Word文档失败:', error)
      alert('导出Word文档时发生错误，请重试')
    } finally {
      setIsExportingDocx(false)
    }
  }

  // 导出为PDF - 使用浏览器自带的打印功能
  const exportToPdf = async (markdown: string, filename: string) => {
    try {
      // 创建一个新窗口用于打印
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('无法打开打印窗口，请检查是否允许弹出窗口')
      }
      
      // 将Markdown转换为HTML
      const htmlContent = markdownToHtml(markdown)
      
      // 设置窗口内容
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${filename}</title>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
            
            body {
              font-family: 'Noto Sans SC', sans-serif;
              padding: 40px;
              line-height: 1.5;
              font-size: 14px;
            }
            h1 {
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
            }
            h2 {
              font-size: 18px;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            .meta {
              text-align: center;
              color: #666;
              margin-bottom: 30px;
            }
            strong {
              font-weight: bold;
            }
            p {
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-style: italic;
            }
            @media print {
              body {
                padding: 0;
              }
              @page {
                margin: 1.5cm;
                size: A4;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `)
      
      // 等待资源加载完成
      setTimeout(() => {
        try {
          // 执行打印
          printWindow.document.close()
          printWindow.focus()
          printWindow.print()
          printWindow.close()
        } catch (e) {
          console.error('打印过程出错:', e)
          printWindow.close()
          throw e
        }
      }, 500)
    } catch (error) {
      console.error('PDF生成失败:', error)
      throw new Error('PDF生成失败')
    }
  }

  // 将Markdown转换为HTML
  const markdownToHtml = (markdown: string): string => {
    // 简单的Markdown到HTML转换
    let html = markdown
      // 处理标题
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      // 处理加粗
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 处理分隔线
      .replace(/^---$/gm, '<hr>')
      // 处理斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 保留换行
      .replace(/\n\n/g, '</p><p>')
      // 处理列表项
      .replace(/^\* (.*)$/gm, '<li>$1</li>')
    
    // 包装在段落中
    html = `<h1>${recommendation?.companyBasicInfo.name || '企业'} 投资建议书</h1>
<div class="meta">生成日期: ${new Date().toLocaleDateString()}</div>
<p>${html}</p>
<div class="footer">本报告由投资尽调报告生成器生成，仅供参考</div>`
    
    return html
  }

  // 导出为DOCX (使用HTML方式)
  const exportToDocx = async (markdown: string, filename: string) => {
    try {
      // 将Markdown转换为HTML
      const htmlContent = markdownToHtml(markdown)
      
      // 完整的HTML文档
      const fullHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:w="urn:schemas-microsoft-com:office:word" 
              xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta charset="utf-8">
            <title>${filename}</title>
            <style>
              body {
                font-family: "Microsoft YaHei", "微软雅黑", SimHei, "黑体", Arial, sans-serif;
                padding: 20px;
                line-height: 1.5;
                font-size: 12pt;
              }
              h1 { font-size: 18pt; text-align: center; margin-bottom: 20px; }
              h2 { font-size: 14pt; margin-top: 30px; margin-bottom: 15px; }
              .meta { text-align: center; color: #666; margin-bottom: 30px; }
              strong { font-weight: bold; }
              p { margin-bottom: 10px; }
              .footer { margin-top: 40px; text-align: center; color: #666; font-style: italic; }
              
              /* Word专用样式 */
              @page Section1 {
                mso-header-margin:.5in;
                mso-footer-margin:.5in;
                mso-paper-source:0;
              }
              div.Section1 {page:Section1;}
              
              /* 表格样式 */
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 15px 0;
              }
              td, th {
                border: 1px solid #ddd;
                padding: 8px;
              }
            </style>
            <!-- 告诉浏览器这是Word文档 -->
            <!--[if gte mso 9]>
            <xml>
              <w:WordDocument>
                <w:View>Print</w:View>
                <w:Zoom>100</w:Zoom>
                <w:DoNotOptimizeForBrowser/>
              </w:WordDocument>
            </xml>
            <![endif]-->
          </head>
          <body>
            <div class="Section1">
              ${htmlContent}
            </div>
          </body>
        </html>
      `;
      
      // 创建Blob对象
      const blob = new Blob([fullHtml], { type: 'application/msword;charset=utf-8' });
      
      // 下载文件
      saveAs(blob, `${filename}.doc`);
      
      // 显示使用说明
      alert('Word文档已生成。\n\n打开文件后，请注意：\n1. 如果看到格式警告，请点击"是"继续\n2. 在Word中选择"另存为"并选择".docx"格式以获得最佳兼容性');
      
    } catch (error) {
      console.error('Word文档生成失败:', error);
      throw new Error('Word文档生成失败');
    }
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

  // 生成Markdown格式的投资建议书
  const generateMarkdown = (data: InvestmentRecommendation, companyName: string): string => {
    return `# ${companyName} 投资建议书
生成日期: ${new Date().toLocaleDateString()}

## 一、公司基本情况

**公司名称：**${data.companyBasicInfo.name}
**统一社会信用代码：**${data.companyBasicInfo.creditCode}
**成立日期：**${data.companyBasicInfo.establishDate}
**注册资本：**${data.companyBasicInfo.registeredCapital}
**注册地址：**${data.companyBasicInfo.address}
**经营范围：**${data.companyBasicInfo.businessScope}

## 二、团队简介

**核心成员：**
${data.teamInfo.coreMembers}

**团队背景：**
${data.teamInfo.background}

**相关经验：**
${data.teamInfo.experience}

## 三、产品与技术

**主要产品：**
${data.productAndTechnology.mainProducts}

**技术优势：**
${data.productAndTechnology.technologyAdvantage}

**专利情况：**
${data.productAndTechnology.patents}

## 四、业务模式

**收入来源：**
${data.businessModel.revenueStream}

**客户情况：**
${data.businessModel.customers}

**竞争优势：**
${data.businessModel.competitiveAdvantage}

## 五、市场分析

**行业规模：**
${data.marketAnalysis.industrySize}

**成长性：**
${data.marketAnalysis.growth}

**成熟度：**
${data.marketAnalysis.maturity}

**竞争格局：**
${data.marketAnalysis.competition}

## 六、投资建议

**融资计划：**
${data.investmentSuggestion.financingPlan}

**估值分析：**
${data.investmentSuggestion.valuationAnalysis}

**风险：**
${data.investmentSuggestion.risks}

**机会：**
${data.investmentSuggestion.opportunities}

**建议：**
${data.investmentSuggestion.recommendation}

---
*本报告由投资尽调报告生成器生成，仅供参考*
`
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
        <h3 className="text-lg font-semibold">投资建议书预览</h3>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleExportPdf} 
              disabled={isExportingPdf}
              className="flex items-center gap-2"
            >
              {isExportingPdf ? (
                <>
                  <FileText className="h-4 w-4 animate-spin" />
                  生成PDF中...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  下载PDF
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleExportDocx} 
              disabled={isExportingDocx}
              className="flex items-center gap-2"
            >
              {isExportingDocx ? (
                <>
                  <FileText className="h-4 w-4 animate-spin" />
                  生成Word中...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  下载Word
                </>
              )}
            </Button>
          </div>
          
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
      
      {/* 预览内容 */}
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
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <p className="text-sm text-muted-foreground w-full text-center">本报告由投资尽调报告生成器生成，仅供参考</p>
          

        </CardFooter>
      </Card>
      
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