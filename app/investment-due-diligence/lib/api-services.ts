import axios from 'axios';
import {
  BochaSearchResult,
  InvestmentRecommendation,
  QccCompanyDetail,
  QccCompanySearchResult
} from '../models/types';

// 创建API客户端实例
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// 添加响应拦截器来处理错误
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API请求错误:', error);
    // 如果有响应数据，则提取错误信息
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.error || error.response.data.message || '未知错误';
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(error);
  }
);

const deepseekClient = axios.create({
  baseURL: 'https://api.deepseek.com',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

// 企查查企业高级搜索API
export async function searchCompany(query: string): Promise<QccCompanySearchResult[]> {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      // 开发时使用模拟数据
      return mockSearchCompany(query);
    }
    
    // 调用我们的代理API路由
    const response = await apiClient.get('/qcc/search', { 
      params: { query }
    });
    
    // 检查API响应状态
    if (response.data.Status !== '200') {
      throw new Error(`API错误: ${response.data.Message}`);
    }
    
    // 转换为应用所需的数据格式
    return (response.data.Result || []).map((item: any) => ({
      Name: item.Name,
      KeyNo: item.KeyNo,
      CreditCode: item.CreditCode,
      OperName: item.OperName,
      Address: item.Address,
      StartDate: item.StartDate,
      RegCapital: item.RegistCapi,
      Status: item.Status
    }));
  } catch (error) {
    console.error('搜索公司失败:', error);
    // 如果是开发环境但模拟数据标志未设置，则返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      console.warn('使用模拟数据作为备选');
      return mockSearchCompany(query);
    }
    throw new Error('搜索公司时发生错误');
  }
}

// 企查查企业信息核验API
export async function getCompanyDetail(searchKey: string): Promise<QccCompanyDetail> {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('使用模拟数据获取公司详情');
      return mockGetCompanyDetail(searchKey);
    }
    
    console.log('正在获取公司详情，KeyNo:', searchKey);
    
    // 调用我们的代理API路由
    const response = await apiClient.get('/qcc/detail', { 
      params: { searchKey }
    });
    
    // 打印原始响应数据以便调试
    console.log('企业详情API响应:', JSON.stringify(response.data).substring(0, 500) + '...');
    
    // 检查API响应状态
    if (response.data.Status !== '200') {
      throw new Error(`API错误: ${response.data.Message}`);
    }
    
    // 检查是否有结果数据
    if (!response.data.Result || !response.data.Result.Data) {
      throw new Error('API响应中缺少数据');
    }
    
    // 获取数据
    const data = response.data.Result.Data;
    
    // 转换为应用所需的数据格式
    return {
      KeyNo: data.KeyNo,
      Name: data.Name,
      CreditCode: data.CreditCode,
      OperName: data.OperName,
      Status: data.Status,
      StartDate: data.StartDate,
      RegistCapi: data.RegistCapi,
      RegisteredCapital: data.RegisteredCapital,
      RegisteredCapitalUnit: data.RegisteredCapitalUnit,
      RegisteredCapitalCCY: data.RegisteredCapitalCCY,
      Address: data.Address,
      Scope: data.Scope,
      ContactInfo: data.ContactInfo
    };
  } catch (error) {
    console.error('获取公司详情失败:', error);
    // 如果是开发环境但模拟数据标志未设置，则返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      console.warn('使用模拟数据作为备选');
      return mockGetCompanyDetail(searchKey);
    }
    throw new Error(`获取公司详情时发生错误: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 博查网络搜索API
export async function webSearch(query: string): Promise<BochaSearchResult[]> {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('使用模拟数据进行网络搜索');
      return mockWebSearch(query);
    }
    
    console.log('正在进行网络搜索，关键词:', query);
    
    // 调用我们的博查API代理
    const response = await apiClient.post('/bocha/search', {
      query,
      freshness: 'noLimit', // 默认不限时间
      summary: true,        // 返回摘要
      count: 10,            // 返回10条结果
      page: 1               // 第一页
    });
    
    // 打印原始响应数据以便调试
    console.log('博查API响应:', JSON.stringify(response.data).substring(0, 500) + '...');
    
    // 检查API响应状态
    if (response.data.code !== 200) {
      throw new Error(`API错误: ${response.data.msg || '未知错误'}`);
    }
    
    // 检查是否有搜索结果
    if (!response.data.data || !response.data.data.webPages || !response.data.data.webPages.value) {
      console.warn('博查API返回空结果');
      return [];
    }
    
    // 转换为应用所需的数据格式
    return response.data.data.webPages.value.map((item: any) => ({
      name: item.name,
      url: item.url,
      snippet: item.snippet,
      summary: item.summary,
      siteName: item.siteName,
      dateLastCrawled: item.dateLastCrawled
    }));
  } catch (error) {
    console.error('网络搜索失败:', error);
    // 如果是开发环境但模拟数据标志未设置，则返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      console.warn('使用模拟数据作为备选');
      return mockWebSearch(query);
    }
    throw new Error(`网络搜索时发生错误: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// DeepSeek API生成投资建议书
export async function generateInvestmentRecommendation(
  companyDetail: QccCompanyDetail,
  webSearchResults: BochaSearchResult[]
): Promise<InvestmentRecommendation> {
  try {
    // 构建输入数据
    const inputData = {
      companyInfo: companyDetail,
      webSearchInfo: webSearchResults
    };
    
    // 使用环境变量标志决定是使用真实API还是模拟数据
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('使用模拟数据生成投资建议书');
      return mockGenerateInvestmentRecommendation(companyDetail, webSearchResults);
    }
    
    console.log('调用DeepSeek API生成投资建议书');
    
    // 创建一个JSON结构的示例，帮助模型理解我们期望的输出格式
    const jsonExample = {
      "companyBasicInfo": {
        "name": "公司名称",
        "creditCode": "统一社会信用代码",
        "establishDate": "成立日期",
        "registeredCapital": "注册资本",
        "businessScope": "经营范围概述",
        "address": "注册地址"
      },
      "teamInfo": {
        "coreMembers": "核心成员及其背景介绍",
        "background": "团队整体背景评价",
        "experience": "团队过往经验和成就"
      },
      "productAndTechnology": {
        "mainProducts": "主要产品或服务列表及简介",
        "technologyAdvantage": "技术优势分析",
        "patents": "专利、知识产权情况"
      },
      "businessModel": {
        "revenueStream": "收入来源及商业模式",
        "customers": "主要客户群体分析",
        "competitiveAdvantage": "竞争优势分析"
      },
      "marketAnalysis": {
        "industrySize": "行业规模数据",
        "growth": "市场增长趋势",
        "maturity": "市场成熟度分析",
        "competition": "竞争格局分析"
      },
      "investmentSuggestion": {
        "financingPlan": "融资计划建议",
        "valuationAnalysis": "估值分析",
        "risks": "投资风险分析",
        "opportunities": "投资机会点",
        "recommendation": "最终投资建议"
      }
    };
    
    // 创建一个详细的系统提示词
    const systemPrompt = `你是一位专业的投资分析师，精通企业尽职调查和投资评估。
请基于提供的公司信息和网络搜索结果，生成一份全面、专业且客观的投资建议书。

请注意以下要求：
1. 分析内容必须基于提供的事实数据，避免编造或添加虚构内容
2. 使用专业的金融和投资术语，但确保内容通俗易懂
3. 分析要客观中立，同时指出风险与机会
4. 对公司的竞争优势和劣势要有深入分析
5. 对市场前景和估值逻辑要有合理论证
6. 最终给出清晰的投资建议

你的输出必须是有效的JSON格式，结构应与下面的示例一致：
${JSON.stringify(jsonExample, null, 2)}

请严格按照此JSON结构输出，不要添加额外的字段或修改字段名称。`;

    // 调用DeepSeek API
    const response = await deepseekClient.post('/v1/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `请根据以下公司信息和网络搜索结果，生成一份JSON格式的投资建议书：\n\n${JSON.stringify(inputData, null, 2)}`
        }
      ],
      response_format: {
        type: "json_object"
      },
      max_tokens: 4000, // 设置足够长的输出长度，确保完整的JSON
      temperature: 0.2  // 低温度参数使输出更加确定和精确
    });
    
    // 解析API响应
    console.log('DeepSeek API响应成功');
    const content = response.data.choices[0].message.content;
    
    // 确保返回的是有效的JSON
    try {
      const result = JSON.parse(content);
      
      // 验证返回的数据结构是否符合我们的期望
      // 如果缺少关键字段，可以使用默认值代替或抛出错误
      if (!result.companyBasicInfo || !result.teamInfo || !result.productAndTechnology || 
          !result.businessModel || !result.marketAnalysis || !result.investmentSuggestion) {
        console.error('API返回的JSON结构不完整:', result);
        throw new Error('生成的投资建议书结构不完整');
      }
      
      return result as InvestmentRecommendation;
    } catch (parseError) {
      console.error('解析DeepSeek API返回的JSON失败:', parseError);
      console.error('原始内容:', content);
      throw new Error('解析生成的投资建议书失败');
    }
  } catch (error) {
    console.error('生成投资建议书失败:', error);
    // 如果在开发环境中API调用失败，则回退到模拟数据
    if (process.env.NODE_ENV === 'development') {
      console.warn('API调用失败，使用模拟数据作为备选');
      return mockGenerateInvestmentRecommendation(companyDetail, webSearchResults);
    }
    throw new Error(error instanceof Error ? `生成投资建议书时发生错误: ${error.message}` : '生成投资建议书时发生未知错误');
  }
}

// 模拟数据，用于开发测试

function mockSearchCompany(query: string): QccCompanySearchResult[] {
  // 模拟搜索结果
  return [
    {
      Name: `${query}科技有限公司`,
      KeyNo: "abc123",
      CreditCode: "91110111MA01C8JT4A",
      OperName: "张三",
      Address: "北京市海淀区西土城路10号",
      StartDate: "2018-05-15",
      RegCapital: "1000万",
      Status: "在业"
    },
    {
      Name: `${query}信息技术有限公司`,
      KeyNo: "def456",
      CreditCode: "91110111MA01C8JT4B",
      OperName: "李四",
      Address: "北京市朝阳区建国路88号",
      StartDate: "2015-08-22",
      RegCapital: "500万",
      Status: "在业"
    }
  ];
}

function mockGetCompanyDetail(keyNo: string): QccCompanyDetail {
  // 模拟公司详情
  return {
    KeyNo: keyNo,
    Name: "模拟科技有限公司",
    CreditCode: "91110111MA01C8JT4A",
    OperName: "张三",
    Status: "存续（在营、开业、在册）",
    StartDate: "2018-05-15",
    RegistCapi: "1000万元",
    RegisteredCapital: "1000",
    RegisteredCapitalUnit: "万",
    RegisteredCapitalCCY: "CNY",
    Address: "北京市海淀区西土城路10号",
    Scope: "技术开发；货物进出口、技术进出口；销售通讯设备、计算机软件及辅助设备",
    ContactInfo: {
      WebSiteList: ["https://www.example.com"],
      Email: "contact@example.com",
      Tel: "010-12345678"
    }
  };
}

function mockWebSearch(query: string): BochaSearchResult[] {
  // 模拟网络搜索结果
  return [
    {
      name: `${query}科技有限公司完成A轮融资`,
      url: "https://news.example.com/article1",
      snippet: `${query}科技有限公司宣布完成5000万元人民币A轮融资，由XXX资本领投。`,
      summary: `${query}科技有限公司于2023年6月完成5000万元人民币A轮融资，由XXX资本领投，YYY资本跟投。公司主要业务为企业级SaaS服务，目前已有超过100家企业客户。`,
      siteName: "科技新闻网",
      dateLastCrawled: "2023-07-01"
    },
    {
      name: `${query}科技CEO专访：谈技术创新与未来发展`,
      url: "https://blog.example.com/interview",
      snippet: `${query}科技CEO张三分享了公司的核心技术和未来发展规划。`,
      summary: `在这次专访中，${query}科技CEO张三介绍了公司的核心AI技术，以及在企业服务领域的创新应用。他表示，公司计划在明年拓展海外市场，并推出新的数据分析产品线。`,
      siteName: "科技博客",
      dateLastCrawled: "2023-08-15"
    }
  ];
}

function mockGenerateInvestmentRecommendation(
  companyDetail: QccCompanyDetail,
  webSearchResults: BochaSearchResult[]
): InvestmentRecommendation {
  // 模拟生成的投资建议书
  return {
    companyBasicInfo: {
      name: companyDetail.Name,
      creditCode: companyDetail.CreditCode,
      establishDate: companyDetail.StartDate,
      registeredCapital: companyDetail.RegistCapi,
      businessScope: companyDetail.Scope,
      address: companyDetail.Address
    },
    teamInfo: {
      coreMembers: "张三（CEO）：清华大学计算机博士，前XXX公司技术总监\n李四（CTO）：斯坦福大学人工智能硕士，拥有多项专利",
      background: "创始团队拥有丰富的技术和行业经验，在人工智能领域有深厚的研究背景",
      experience: "管理团队曾成功创办过两家科技企业，并有丰富的企业级服务经验"
    },
    productAndTechnology: {
      mainProducts: "1. 企业智能决策系统\n2. 数据分析平台\n3. 行业专用AI解决方案",
      technologyAdvantage: "自主研发的机器学习算法，在数据处理效率上比行业平均水平提高30%",
      patents: "拥有5项核心技术专利，3项软件著作权"
    },
    businessModel: {
      revenueStream: "主要通过SaaS服务订阅模式获取收入，辅以定制化解决方案服务",
      customers: "目前已服务超过100家中大型企业客户，包括金融、制造、零售等多个行业",
      competitiveAdvantage: "技术领先、产品体验优秀、客户服务及时，客户续约率达95%"
    },
    marketAnalysis: {
      industrySize: "企业级SaaS市场规模2023年达到2000亿元，年增长率25%",
      growth: "未来5年，预计复合增长率将保持在20%以上",
      maturity: "行业处于快速发展期，国内市场渗透率仍较低，有巨大发展空间",
      competition: "目前有3-5家主要竞争对手，但各家在细分领域侧重点不同"
    },
    investmentSuggestion: {
      financingPlan: "计划在12个月内完成B轮融资，融资金额1亿元人民币",
      valuationAnalysis: "基于当前营收和增长率，估值区间为5-7亿元人民币",
      risks: "技术迭代风险、市场竞争加剧风险、人才流失风险",
      opportunities: "产业数字化转型加速、政策支持、国产替代趋势",
      recommendation: "建议投资，看好公司在企业服务领域的长期发展潜力。投资者可考虑参与下一轮融资，建议投资额不超过3000万元。"
    }
  };
} 