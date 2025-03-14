import { md5 } from '@/lib/crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 获取URL参数
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json(
        { error: '查询参数不能为空' }, 
        { status: 400 }
      );
    }
    
    // 企查查API认证
    const appKey = process.env.QCC_APP_KEY || '';
    const secretKey = process.env.QCC_SECRET_KEY || '';
    const timespan = Math.floor(Date.now() / 1000).toString();
    const token = md5(`${appKey}${timespan}${secretKey}`).toUpperCase();
    
    // 构建请求URL和参数
    const apiUrl = new URL('/FuzzySearch/GetList', 'https://api.qichacha.com');
    apiUrl.searchParams.append('key', appKey);
    apiUrl.searchParams.append('searchKey', query);
    apiUrl.searchParams.append('pageSize', '10');
    apiUrl.searchParams.append('pageIndex', '1');
    
    // 发送请求到企查查API
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Token': token,
        'Timespan': timespan
      }
    });
    
    // 处理API响应
    const data = await response.json();
    
    // 返回数据到客户端
    return NextResponse.json(data);
  } catch (error) {
    console.error('企查查API请求失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' }, 
      { status: 500 }
    );
  }
} 