'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { Brain, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function DeepSeekDebugger() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  const testDeepSeekApi = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setLogs([])

    try {
      addLog('开始测试DeepSeek API...')
      addLog(`环境变量 NEXT_PUBLIC_USE_MOCK_DATA: ${process.env.NEXT_PUBLIC_USE_MOCK_DATA}`)
      addLog(`环境变量 NEXT_PUBLIC_DEEPSEEK_API_KEY 是否存在: ${!!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`)
      
      // 创建一个测试客户端
      const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY
      if (!apiKey) {
        throw new Error('DeepSeek API密钥未配置！请在.env.local文件中设置NEXT_PUBLIC_DEEPSEEK_API_KEY')
      }
      
      addLog('创建DeepSeek API客户端...')
      const client = axios.create({
        baseURL: 'https://api.deepseek.com',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      })
      
      addLog('准备发送简单测试请求...')
      const response = await client.post('/v1/chat/completions', {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一个投资专家。"
          },
          {
            role: "user",
            content: "生成一个简单的JSON对象，包含以下字段：greeting, currentTime"
          }
        ],
        response_format: {
          type: "json_object"
        },
        max_tokens: 100,
        temperature: 0.2
      })
      
      addLog(`收到响应，状态码: ${response.status}`)
      addLog(`响应内容: ${JSON.stringify(response.data)}`)
      
      setResult(response.data)
    } catch (err: any) {
      const errorMessage = err.message || '未知错误'
      addLog(`测试失败: ${errorMessage}`)
      
      if (err.response) {
        addLog(`响应状态码: ${err.response.status}`)
        addLog(`响应数据: ${JSON.stringify(err.response.data)}`)
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>DeepSeek API 调试器</CardTitle>
        <CardDescription>用于测试DeepSeek API连接是否正常工作</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button 
              onClick={testDeepSeekApi} 
              disabled={isLoading} 
              size="lg"
              variant="default"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  测试DeepSeek API
                </>
              )}
            </Button>
          </div>
          
          {/* 日志显示 */}
          {logs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">调试日志:</h3>
              <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="text-xs font-mono whitespace-pre-wrap mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 错误显示 */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
              <h3 className="text-sm font-medium mb-1">错误:</h3>
              <p className="text-xs">{error}</p>
            </div>
          )}
          
          {/* 结果显示 */}
          {result && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">API响应:</h3>
              <div className="bg-muted p-3 rounded-md overflow-x-auto">
                <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
          
          {/* API密钥信息 */}
          <div className="mt-6 text-sm">
            <h3 className="font-medium mb-2">提示与帮助:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>确保在<code className="bg-muted p-1 rounded text-xs">.env.local</code>文件中正确配置了<code className="bg-muted p-1 rounded text-xs">NEXT_PUBLIC_DEEPSEEK_API_KEY</code></li>
              <li>设置<code className="bg-muted p-1 rounded text-xs">NEXT_PUBLIC_USE_MOCK_DATA=false</code>以启用真实API调用</li>
              <li>如果出现401错误，表示API密钥无效或权限不足</li>
              <li>如果出现网络错误，请检查DeepSeek API服务是否可用</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 