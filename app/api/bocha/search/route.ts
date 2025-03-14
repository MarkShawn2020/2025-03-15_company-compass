import { NextRequest, NextResponse } from 'next/server';

/**
 * 博查网络搜索API代理
 * 根据博查API文档(web-search-api.md)实现
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    const { query, freshness = 'noLimit', summary = true, count = 10, page = 1 } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: '搜索关键词不能为空' }, 
        { status: 400 }
      );
    }
    
    // 获取博查API密钥
    const apiKey = process.env.BOCHA_API_KEY;
    if (!apiKey) {
      console.error('博查API密钥未配置');
      return NextResponse.json(
        { error: 'API配置错误，请联系管理员' }, 
        { status: 500 }
      );
    }
    
    // 构建请求数据
    const apiUrl = 'https://api.bochaai.com/v1/web-search';
    const requestData = {
      query,
      freshness,
      summary,
      count,
      page
    };
    
    console.log('博查API请求:', JSON.stringify(requestData));
    
    // 调用博查API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      console.error('博查API响应错误:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('错误响应内容:', errorText);
      return NextResponse.json(
        { error: `博查API请求失败: ${response.status} ${response.statusText}` }, 
        { status: response.status }
      );
    }
    
    // 处理API响应
    const data = await response.json();
    
    // 检查API响应状态
    if (data.code !== 200) {
      console.error('博查API业务错误:', data.code, data.msg);
      return NextResponse.json(
        { error: `博查API错误: ${data.msg || '未知错误'}` }, 
        { status: 400 }
      );
    }
    
    // 返回数据到客户端
    return NextResponse.json(data);
  } catch (error) {
    console.error('博查API请求失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
} 