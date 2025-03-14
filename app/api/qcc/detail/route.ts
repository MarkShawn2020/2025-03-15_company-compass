import { md5 } from '@/lib/crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 获取URL参数
    const searchParams = request.nextUrl.searchParams;
    const searchKey = searchParams.get('searchKey');
    
    if (!searchKey) {
      return NextResponse.json(
        { error: '企业标识不能为空' }, 
        { status: 400 }
      );
    }
    
    // 企查查API认证
    const appKey = process.env.QCC_APP_KEY || '';
    const secretKey = process.env.QCC_SECRET_KEY || '';
    const timespan = Math.floor(Date.now() / 1000).toString();
    const token = md5(`${appKey}${timespan}${secretKey}`).toUpperCase();
    
    // 构建请求URL和参数 - 根据企查查API文档使用正确的接口路径
    const apiUrl = new URL('/EnterpriseInfo/Verify', 'https://api.qichacha.com');
    apiUrl.searchParams.append('key', appKey);
    apiUrl.searchParams.append('searchKey', searchKey);
    
    console.log('企查查API请求URL:', apiUrl.toString());
    console.log('请求头:', { Token: token, Timespan: timespan });
    
    // 发送请求到企查查API
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Token': token,
        'Timespan': timespan
      } 
    });
    
    if (!response.ok) {
      console.error('企查查API响应错误:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('错误响应内容:', errorText);
      
      return NextResponse.json(
        { error: `API请求失败: ${response.status} ${response.statusText}` }, 
        { status: response.status }
      );
    }
    
    // 处理API响应
    const data = await response.json();
    console.log('企查查API响应数据:', JSON.stringify(data).substring(0, 200) + '...');
    
    // 检查API响应状态
    if (data.Status !== '200') {
      console.error('企查查API业务错误:', data.Status, data.Message);
      
      return NextResponse.json(
        { error: `企查查API错误: ${data.Message}` }, 
        { status: 400 }
      );
    }
    
    // 返回数据到客户端
    return NextResponse.json(data);
  } catch (error) {
    console.error('企查查API请求失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
