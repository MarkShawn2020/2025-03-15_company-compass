import { Metadata } from 'next'
import { DeepSeekDebugger } from '../components/DeepSeekDebugger'

export const metadata: Metadata = {
  title: 'DeepSeek API 调试',
  description: '测试DeepSeek API连接与配置',
}

export default function DeepSeekDebugPage() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">DeepSeek API 调试工具</h1>
        <p className="text-muted-foreground">
          用于测试DeepSeek API连接是否正常工作，帮助排查投资建议书生成问题
        </p>
      </div>
      
      <DeepSeekDebugger />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>如果调试测试成功，但投资建议书生成失败，请检查其他组件的配置</p>
        <p className="mt-2">
          <a 
            href="/investment-due-diligence" 
            className="text-blue-500 hover:underline"
          >
            返回投资尽调报告生成器
          </a>
        </p>
      </div>
    </div>
  )
} 