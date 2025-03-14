import { Metadata } from 'next'
import { InvestmentDueDiligenceWorkflow } from './components/InvestmentWorkflow'

export const metadata: Metadata = {
  title: '投资尽调报告生成器',
  description: '基于企业信息生成专业的投资尽调报告',
}

export default function InvestmentDueDiligencePage() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">投资尽调报告生成器</h1>
        <p className="text-muted-foreground">
          输入公司或项目名称，自动生成专业的投资建议书
        </p>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <InvestmentDueDiligenceWorkflow />
      </div>
    </div>
  )
} 