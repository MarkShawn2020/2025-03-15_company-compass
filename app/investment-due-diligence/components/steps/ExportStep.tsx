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
  Table,
  TableBody,
  TableCell, TableRow
} from '@/components/ui/table'
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

// 导入中文字体支持
// 注意：实际项目应该从字体文件或CDN加载字体
// 这里使用的是一个简单的字体导入示例

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

  // 导出为PDF
  const exportToPdf = async (markdown: string, filename: string) => {
    try {
      // 获取预览内容的克隆，而不是从Markdown重新生成
      const previewContent = document.querySelector('.max-w-3xl')
      if (!previewContent) {
        throw new Error('无法获取预览内容')
      }
      
      // 克隆节点以避免修改原始DOM
      const contentElement = previewContent.cloneNode(true) as HTMLElement
      
      // 应用打印样式
      const printStyles = document.createElement('style')
      printStyles.textContent = `
        body {
          font-family: Arial, "Microsoft YaHei", "微软雅黑", SimHei, "黑体", sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.5;
          color: #000;
          background: #fff;
        }
        
        /* 重置一些可能影响打印的样式 */
        * {
          box-sizing: border-box;
        }
        
        h1 {
          font-size: 24px;
          text-align: center;
          margin-bottom: 20px;
          font-weight: bold;
        }
        
        h2 {
          font-size: 18px;
          margin-top: 30px;
          margin-bottom: 15px;
          font-weight: bold;
        }
        
        .meta {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
        }
        
        /* 表格样式 */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0 25px 0;
        }
        
        th, td {
          border: 1px solid #000;
          padding: 8px 12px;
          text-align: left;
        }
        
        th {
          background-color: #f0f0f0;
          font-weight: bold;
          width: 25%;
        }
        
        /* 内容样式 */
        section {
          margin-bottom: 25px;
        }
        
        p {
          margin-bottom: 10px;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-style: italic;
          border-top: 1px solid #eaeaea;
          padding-top: 20px;
        }
        
        /* 打印特定样式 */
        @media print {
          body {
            padding: 0;
          }
          @page {
            margin: 2cm;
            size: A4;
          }
          button, .no-print {
            display: none !important;
          }
        }
      `
      
      // 使用浏览器的打印功能
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        // 准备打印文档
        printWindow.document.write(`
          <html>
            <head>
              <title>${filename}</title>
              ${printStyles.outerHTML}
            </head>
            <body>
              <h1>${selectedCompany?.Name || '企业'} 投资建议书</h1>
              <div class="meta">生成日期: ${new Date().toLocaleDateString()}</div>
              ${contentElement.outerHTML}
              <div class="footer">本报告由投资尽调报告生成器生成，仅供参考</div>
              <script>
                // 处理打印后的动作
                window.onload = function() {
                  // 移除不需要打印的元素
                  document.querySelectorAll('button, .no-print').forEach(el => el.remove());
                  
                  // 确保表格样式正确
                  document.querySelectorAll('table').forEach(table => {
                    table.border = '1';
                    table.style.width = '100%';
                    table.style.borderCollapse = 'collapse';
                    table.style.marginBottom = '25px';
                    
                    // 设置单元格样式
                    table.querySelectorAll('th, td').forEach(cell => {
                      cell.style.border = '1px solid #000';
                      cell.style.padding = '8px 12px';
                      cell.style.textAlign = 'left';
                    });
                    
                    // 设置表头样式
                    table.querySelectorAll('th').forEach(th => {
                      th.style.backgroundColor = '#f0f0f0';
                      th.style.fontWeight = 'bold';
                      th.style.width = '25%';
                    });
                  });
                  
                  // 自动打印并关闭窗口
                  setTimeout(function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                  }, 500);
                };
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      } else {
        // 如果无法打开新窗口，提供下载HTML文件的选项
        const htmlContent = `
          <html>
            <head>
              <title>${filename}</title>
              <style>
                body {
                  font-family: Arial, "Microsoft YaHei", "微软雅黑", SimHei, "黑体", sans-serif;
                  padding: 40px;
                  max-width: 800px;
                  margin: 0 auto;
                  line-height: 1.5;
                }
                h1 { font-size: 24px; text-align: center; margin-bottom: 20px; }
                h2 { font-size: 18px; margin-top: 30px; margin-bottom: 15px; }
                .meta { text-align: center; color: #666; margin-bottom: 30px; }
                
                /* 表格样式 */
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 15px 0 25px 0;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 8px 12px;
                  text-align: left;
                }
                th {
                  background-color: #f0f0f0;
                  font-weight: bold;
                  width: 25%;
                }
                
                .footer { margin-top: 40px; text-align: center; color: #666; font-style: italic; }
              </style>
            </head>
            <body>
              ${contentElement.outerHTML}
            </body>
          </html>
        `
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
        saveAs(blob, `${filename}.html`)
        alert('浏览器阻止了打开新窗口。已将报告保存为HTML文件，您可以使用浏览器打开并打印为PDF。')
      }
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
      // 处理表格
      .replace(/<!-- TABLE_START -->([\s\S]*?)<!-- TABLE_END -->/g, (match, tableContent) => {
        // 表格行数据
        const rows = tableContent.trim().split('\n');
        let tableHtml = '<table>';
        
        rows.forEach((row: string) => {
          const [label, value] = row.split('|').map((item: string) => item.trim());
          tableHtml += `
            <tr>
              <th>${label}</th>
              <td>${value}</td>
            </tr>
          `;
        });
        
        tableHtml += '</table>';
        return tableHtml;
      })
       
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
              
              /* 表格样式 */
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                mso-border-alt: solid windowtext .5pt;
                mso-padding-alt: 3pt 3pt 3pt 3pt;
              }
              th, td {
                border: 1pt solid windowtext;
                padding: 5pt;
                text-align: left;
              }
              th {
                background-color: #f1f1f1;
                font-weight: bold;
              }
              
              /* Word专用样式 */
              @page Section1 {
                mso-header-margin:.5in;
                mso-footer-margin:.5in;
                mso-paper-source:0;
              }
              div.Section1 {page:Section1;}
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

  // 生成Markdown格式的投资建议书
  const generateMarkdown = (data: InvestmentRecommendation, companyName: string): string => {
    // 生成公司基本信息表格内容
    const companyInfoTable = `<!-- TABLE_START -->
公司名称|${data.companyBasicInfo.name}
统一社会信用代码|${data.companyBasicInfo.creditCode}
成立日期|${data.companyBasicInfo.establishDate}
注册资本|${data.companyBasicInfo.registeredCapital}
注册地址|${data.companyBasicInfo.address}
经营范围|${data.companyBasicInfo.businessScope}
<!-- TABLE_END -->`;

    return `# ${companyName} 投资建议书
生成日期: ${new Date().toLocaleDateString()}

## 一、公司基本情况

${companyInfoTable}

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
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">公司名称</TableCell>
                    <TableCell>{recommendation.companyBasicInfo.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">统一社会信用代码</TableCell>
                    <TableCell>{recommendation.companyBasicInfo.creditCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">成立日期</TableCell>
                    <TableCell>{recommendation.companyBasicInfo.establishDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">注册资本</TableCell>
                    <TableCell>{recommendation.companyBasicInfo.registeredCapital}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">注册地址</TableCell>
                    <TableCell>{recommendation.companyBasicInfo.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">经营范围</TableCell>
                    <TableCell className="whitespace-pre-wrap">{recommendation.companyBasicInfo.businessScope}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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